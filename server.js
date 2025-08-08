const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const cors = require('cors');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

// Clean up old files (older than 1 hour)
function cleanupOldFiles() {
    const files = fs.readdirSync(downloadsDir);
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    files.forEach(file => {
        const filePath = path.join(downloadsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < oneHourAgo) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up old file: ${file}`);
        }
    });
}

// Clean up old files every 30 minutes
setInterval(cleanupOldFiles, 30 * 60 * 1000);

// Sanitize filename
function sanitizeFilename(filename) {
    return filename
        .replace(/[^\w\s-_.]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
}

// Extract track info and download with progress
async function downloadSoundCloudTrack(url, progressCallback = null) {
    try {
        // First, get track info
        if (progressCallback) progressCallback(10, 'Abrufen der Track-Informationen...');
        
        const infoCommand = `yt-dlp --print "%(title)s|%(uploader)s|%(duration)s" "${url}"`;
        const { stdout: infoOutput } = await execAsync(infoCommand);
        
        const [title, uploader, duration] = infoOutput.trim().split('|');
        const sanitizedTitle = sanitizeFilename(`${uploader} - ${title}`);
        const filename = `${sanitizedTitle}.mp3`;
        const filepath = path.join(downloadsDir, filename);
        
        if (progressCallback) progressCallback(30, 'Starte Download...');
        
        // Download and convert to MP3 with progress
        const downloadCommand = `yt-dlp -x --audio-format mp3 --audio-quality 0 --newline -o "${filepath.replace('.mp3', '.%(ext)s')}" "${url}"`;
        
        console.log(`Starting download: ${title} by ${uploader}`);
        
        return new Promise((resolve, reject) => {
            const process = require('child_process').spawn('sh', ['-c', downloadCommand]);
            let progress = 30;
            
            process.stdout.on('data', (data) => {
                const output = data.toString();
                
                // Parse yt-dlp progress
                if (output.includes('[download]') && output.includes('%')) {
                    const match = output.match(/(\d+\.?\d*)%/);
                    if (match) {
                        const downloadProgress = parseFloat(match[1]);
                        progress = Math.min(30 + (downloadProgress * 0.6), 90);
                        if (progressCallback) {
                            progressCallback(progress, `Herunterladen... ${downloadProgress.toFixed(1)}%`);
                        }
                    }
                }
                
                if (output.includes('[ffmpeg]')) {
                    progress = Math.min(progress + 5, 95);
                    if (progressCallback) {
                        progressCallback(progress, 'Konvertiere zu MP3...');
                    }
                }
            });
            
            process.stderr.on('data', (data) => {
                console.log('yt-dlp stderr:', data.toString());
            });
            
            process.on('close', (code) => {
                if (code === 0) {
                    if (progressCallback) progressCallback(100, 'Abgeschlossen!');
                    
                    // Check if file was created
                    if (fs.existsSync(filepath)) {
                        resolve({
                            success: true,
                            filename: filename,
                            title: `${uploader} - ${title}`,
                            filepath: filepath
                        });
                    } else {
                        reject(new Error('File was not created after download'));
                    }
                } else {
                    reject(new Error(`Download process exited with code ${code}`));
                }
            });
        });
        
    } catch (error) {
        console.error('Download error:', error.message);
        throw new Error(`Download failed: ${error.message}`);
    }
}

// Get track info without downloading (supports playlists)
app.post('/api/track-info', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL ist erforderlich' });
    }
    
    if (!url.includes('soundcloud.com')) {
        return res.status(400).json({ error: 'Nur SoundCloud URLs sind erlaubt' });
    }
    
    try {
        // Check if it's a playlist URL
        const isPlaylist = url.includes('/sets/');
        
        if (isPlaylist) {
            // Handle playlist
            console.log(`Processing playlist: ${url}`);
            
            // Get playlist info first
            const playlistInfoCommand = `yt-dlp --print "%(playlist_title)s|%(uploader)s|%(playlist_count)s" "${url}" | head -1`;
            const { stdout: playlistInfo } = await execAsync(playlistInfoCommand);
            const [playlistTitle, playlistUploader, playlistCount] = playlistInfo.trim().split('|');
            
            // Get all tracks from playlist - try different approach
            const tracksCommand = `yt-dlp --flat-playlist --print "%(url)s" "${url}"`;
            const { stdout: urlsOutput } = await execAsync(tracksCommand);
            
            console.log('Found URLs:', urlsOutput.substring(0, 300));
            
            // Get individual track info for each URL
            const trackUrls = urlsOutput.trim().split('\n').filter(url => url.trim());
            const tracks = [];
            
            console.log(`Processing ${trackUrls.length} tracks from playlist`);
            
            // Process tracks in batches to avoid overwhelming the system
            const batchSize = 5;
            for (let i = 0; i < trackUrls.length; i += batchSize) {
                const batch = trackUrls.slice(i, i + batchSize);
                
                const batchPromises = batch.map(async (trackUrl) => {
                    try {
                        const trackInfoCommand = `yt-dlp --print "%(title)s|%(uploader)s" "${trackUrl.trim()}"`;
                        const { stdout: trackInfo } = await execAsync(trackInfoCommand);
                        const [title, uploader] = trackInfo.trim().split('|');
                        
                        if (title && uploader) {
                            return {
                                url: trackUrl.trim(),
                                title: title,
                                uploader: uploader,
                                fullTitle: `${uploader} - ${title}`
                            };
                        }
                    } catch (trackError) {
                        console.log(`Error getting info for track ${trackUrl}:`, trackError.message);
                        return {
                            url: trackUrl.trim(),
                            title: 'Unknown Track',
                            uploader: 'Unknown Artist',
                            fullTitle: 'Unknown Artist - Unknown Track'
                        };
                    }
                });
                
                const batchResults = await Promise.all(batchPromises);
                tracks.push(...batchResults.filter(track => track));
                
                // Small delay between batches to be nice to SoundCloud
                if (i + batchSize < trackUrls.length) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            
            res.json({
                success: true,
                isPlaylist: true,
                playlistTitle: playlistTitle,
                playlistUploader: playlistUploader,
                playlistCount: parseInt(playlistCount) || tracks.length,
                tracks: tracks
            });
            
        } else {
            // Handle single track (existing logic)
            const infoCommand = `yt-dlp --print "%(title)s|%(uploader)s|%(duration)s" "${url}"`;
            const { stdout: infoOutput } = await execAsync(infoCommand);
            
            const [title, uploader, duration] = infoOutput.trim().split('|');
            
            res.json({
                success: true,
                isPlaylist: false,
                title: title,
                uploader: uploader,
                duration: duration,
                fullTitle: `${uploader} - ${title}`
            });
        }
        
    } catch (error) {
        console.error('Track Info Error:', error.message);
        res.status(500).json({ 
            error: 'Konnte Track-Informationen nicht abrufen.' 
        });
    }
});

// API Routes
app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL ist erforderlich' });
    }
    
    if (!url.includes('soundcloud.com')) {
        return res.status(400).json({ error: 'Nur SoundCloud URLs sind erlaubt' });
    }
    
    try {
        console.log(`Download request for: ${url}`);
        const result = await downloadSoundCloudTrack(url);
        
        res.json({
            success: true,
            filename: result.filename,
            title: result.title,
            message: 'Download erfolgreich'
        });
        
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ 
            error: 'Download fehlgeschlagen. Überprüfe die URL und versuche es erneut.' 
        });
    }
});

// SSE endpoint for download progress
app.get('/api/download-progress/:url', (req, res) => {
    const url = decodeURIComponent(req.params.url);
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const progressCallback = (progress, message) => {
        res.write(`data: ${JSON.stringify({ progress, message })}\n\n`);
    };

    downloadSoundCloudTrack(url, progressCallback)
        .then(result => {
            res.write(`data: ${JSON.stringify({ 
                success: true, 
                filename: result.filename, 
                title: result.title,
                progress: 100,
                message: 'Abgeschlossen!'
            })}\n\n`);
            res.end();
        })
        .catch(error => {
            res.write(`data: ${JSON.stringify({ 
                success: false, 
                error: error.message,
                progress: 0,
                message: 'Fehler beim Download'
            })}\n\n`);
            res.end();
        });
});

// Serve downloaded files
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(downloadsDir, filename);
    
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Datei nicht gefunden' });
    }
    
    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');
    
    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
    
    // Clean up file after download
    fileStream.on('end', () => {
        setTimeout(() => {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log(`Cleaned up downloaded file: ${filename}`);
            }
        }, 5000);
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 SoundCloud Downloader läuft auf http://localhost:${PORT}`);
    console.log(`📁 Downloads werden in: ${downloadsDir} gespeichert`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});