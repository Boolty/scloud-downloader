document.addEventListener('DOMContentLoaded', function() {
    // Language management
    const translations = {
        de: {
            subtitle: "Gib SoundCloud Links ein und verwalte deine Download-Warteschlange",
            url_placeholder: "https://soundcloud.com/artist/track",
            add_to_queue: "Zur Liste hinzufügen",
            download_queue: "Download Warteschlange",
            download_all: "Alle herunterladen",
            download_completed: "Fertige downloaden",
            clear_queue: "Liste leeren",
            copyright_notice: "Hinweis: Respektiere die Urheberrechte und lade nur Musik herunter, die du besitzen darfst.",
            invalid_url: "Bitte gib eine gültige SoundCloud URL ein.",
            duplicate_url: "Diese URL ist bereits in der Warteschlange.",
            loading_info: "📡 Lade Track-Informationen...",
            added_to_queue: "zur Warteschlange hinzugefügt!",
            all_downloads_complete: "Alle Downloads abgeschlossen!",
            clear_queue_confirm: "Möchtest du wirklich alle Items aus der Warteschlange entfernen?",
            queue_cleared: "Warteschlange geleert.",
            status_pending: "Wartend",
            status_downloading: "📥 Wird heruntergeladen...",
            status_completed: "✅ Abgeschlossen:",
            status_error: "❌ Fehler:",
            status_unknown: "Unbekannt",
            empty_queue: "Keine URLs in der Warteschlange",
            download: "Download",
            remove: "Entfernen",
            downloading_progress: "Wird heruntergeladen...",
            files_downloading: "Dateien werden heruntergeladen!",
            playlist_detected: "📋 Playlist erkannt - lade Tracks...",
            playlist_loading: "Lade Playlist-Tracks...",
            playlist_added: "Tracks von Playlist hinzugefügt!",
            playlist_progress: "von",
            loading_metadata: "📡 Lade Track-Namen...",
            metadata_progress: "Verarbeitet"
        },
        en: {
            subtitle: "Enter SoundCloud links and manage your download queue",
            url_placeholder: "https://soundcloud.com/artist/track",
            add_to_queue: "Add to Queue",
            download_queue: "Download Queue",
            download_all: "Download All",
            download_completed: "Download Completed",
            clear_queue: "Clear Queue",
            copyright_notice: "Notice: Respect copyrights and only download music you have the right to own.",
            invalid_url: "Please enter a valid SoundCloud URL.",
            duplicate_url: "This URL is already in the queue.",
            loading_info: "📡 Loading track information...",
            added_to_queue: "added to queue!",
            all_downloads_complete: "All downloads completed!",
            clear_queue_confirm: "Do you really want to remove all items from the queue?",
            queue_cleared: "Queue cleared.",
            status_pending: "Pending",
            status_downloading: "📥 Downloading...",
            status_completed: "✅ Completed:",
            status_error: "❌ Error:",
            status_unknown: "Unknown",
            empty_queue: "No URLs in queue",
            download: "Download",
            remove: "Remove",
            downloading_progress: "Downloading...",
            files_downloading: "files are being downloaded!",
            playlist_detected: "📋 Playlist detected - loading tracks...",
            playlist_loading: "Loading playlist tracks...",
            playlist_added: "tracks from playlist added!",
            playlist_progress: "of",
            loading_metadata: "📡 Loading track names...",
            metadata_progress: "Processed"
        }
    };

    let currentLanguage = localStorage.getItem('language') || 'de';
    
    // Language toggle
    const languageToggle = document.getElementById('languageToggle');
    const languageIcon = document.getElementById('languageIcon');
    
    function updateLanguage() {
        const t = translations[currentLanguage];
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                element.placeholder = t[key];
            }
        });
        
        // Update language icon
        languageIcon.textContent = currentLanguage === 'de' ? '🇩🇪' : '🇺🇸';
        
        // Update page language attribute
        document.documentElement.lang = currentLanguage;
    }
    
    languageToggle.addEventListener('click', function() {
        currentLanguage = currentLanguage === 'de' ? 'en' : 'de';
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
        updateQueueDisplay(); // Refresh queue to apply new language
    });
    
    // Initialize language
    updateLanguage();

    // Dark mode management
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;
    
    // Load dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        darkModeIcon.textContent = '☀️';
    }
    
    // Dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            darkModeIcon.textContent = '🌙';
            localStorage.setItem('darkMode', 'false');
        } else {
            body.setAttribute('data-theme', 'dark');
            darkModeIcon.textContent = '☀️';
            localStorage.setItem('darkMode', 'true');
        }
    });

    // Queue management
    let downloadQueue = JSON.parse(localStorage.getItem('downloadQueue') || '[]');
    let queueIdCounter = parseInt(localStorage.getItem('queueIdCounter') || '0');

    // DOM elements
    const addToQueueForm = document.getElementById('addToQueueForm');
    const urlInput = document.getElementById('urlInput');
    const addToQueueBtn = document.getElementById('addToQueueBtn');
    const queueList = document.getElementById('queueList');
    const queueCount = document.getElementById('queueCount');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const downloadAllText = document.getElementById('downloadAllText');
    const downloadAllSpinner = document.getElementById('downloadAllSpinner');
    const downloadCompletedBtn = document.getElementById('downloadCompletedBtn');
    const downloadCompletedText = document.getElementById('downloadCompletedText');
    const clearQueueBtn = document.getElementById('clearQueueBtn');
    const status = document.getElementById('status');
    const downloadLinks = document.getElementById('downloadLinks');

    // Initialize
    updateQueueDisplay();
    updateDownloadAllButton();
    updateDownloadCompletedButton();

    // Add to queue form
    addToQueueForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) {
            showStatus(translations[currentLanguage].invalid_url, 'error');
            return;
        }

        if (!url.includes('soundcloud.com')) {
            showStatus(translations[currentLanguage].invalid_url, 'error');
            return;
        }

        // Check for duplicates
        if (downloadQueue.some(item => item.url === url)) {
            showStatus(translations[currentLanguage].duplicate_url, 'error');
            return;
        }

        // Show loading state
        showStatus(translations[currentLanguage].loading_info, 'info');
        
        // Get track/playlist info first - with longer timeout for large playlists
        let trackInfo = null;
        try {
            // Set longer timeout for playlists
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
            
            // Show loading message for metadata
            if (url.includes('/sets/')) {
                showStatus(translations[currentLanguage].loading_metadata, 'info');
            }
            
            const infoResponse = await fetch('/api/track-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (infoResponse.ok) {
                trackInfo = await infoResponse.json();
                console.log('Received track info:', trackInfo);
            } else {
                console.error('Track info request failed:', infoResponse.status, infoResponse.statusText);
                const errorText = await infoResponse.text();
                console.error('Error response:', errorText);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                showStatus('⏱️ Timeout - Playlist zu groß. Versuche es mit einer kleineren Playlist.', 'error');
                return;
            }
            console.error('Could not fetch track info:', error);
            
            // Show error details for debugging
            if (error.message) {
                console.error('Error details:', error.message);
            }
        }

        // Handle error responses
        if (!trackInfo) {
            // If we couldn't get track info, still allow the user to add the URL
            // Maybe it will work during download
            const queueItem = {
                id: ++queueIdCounter,
                url: url,
                status: 'pending',
                title: null,
                artist: null,
                songTitle: null,
                duration: null,
                filename: null,
                error: null,
                playlistName: null
            };

            downloadQueue.push(queueItem);
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
            
            urlInput.value = '';
            showStatus('⚠️ URL hinzugefügt (Metadaten konnten nicht geladen werden)', 'info');
            return;
        }

        // Handle playlist vs single track
        if (trackInfo && trackInfo.isPlaylist) {
            // Handle playlist - optimized for large playlists
            showStatus(translations[currentLanguage].playlist_detected, 'info');
            
            let addedCount = 0;
            let skippedCount = 0;
            const totalTracks = trackInfo.tracks.length;
            
            // For very large playlists, process in chunks to avoid UI freezing
            const chunkSize = 100; // Increased chunk size for better performance
            const chunks = [];
            for (let i = 0; i < trackInfo.tracks.length; i += chunkSize) {
                chunks.push(trackInfo.tracks.slice(i, i + chunkSize));
            }
            
            for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                const chunk = chunks[chunkIndex];
                
                for (let i = 0; i < chunk.length; i++) {
                    const track = chunk[i];
                    
                    // Check for duplicates
                    if (!downloadQueue.some(item => item.url === track.url)) {
                        const queueItem = {
                            id: ++queueIdCounter,
                            url: track.url,
                            status: 'pending',
                            title: track.fullTitle,
                            artist: track.uploader,
                            songTitle: track.title,
                            duration: null,
                            filename: null,
                            error: null,
                            playlistName: trackInfo.playlistTitle
                        };
                        
                        downloadQueue.push(queueItem);
                        addedCount++;
                    } else {
                        skippedCount++;
                    }
                }
                
                // Update progress after each chunk
                const processedTracks = Math.min((chunkIndex + 1) * chunkSize, totalTracks);
                showStatus(`${translations[currentLanguage].playlist_loading} (${processedTracks} ${translations[currentLanguage].playlist_progress} ${totalTracks})`, 'info');
                
                // Update UI less frequently for very large playlists
                const shouldUpdateUI = chunkIndex % 3 === 0 || chunkIndex === chunks.length - 1;
                if (shouldUpdateUI) {
                    saveQueue();
                    updateQueueDisplay();
                    updateDownloadAllButton();
                    updateDownloadCompletedButton();
                    
                    // Small delay to let UI update, but only for very large playlists
                    if (chunkIndex < chunks.length - 1 && totalTracks > 200) {
                        await new Promise(resolve => setTimeout(resolve, 50)); // Reduced delay
                    }
                }
            }
            
            // Final UI update
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
            
            urlInput.value = '';
            
            // Show success message
            let message = `✅ ${addedCount} ${translations[currentLanguage].playlist_added}`;
            if (skippedCount > 0) {
                message += ` (${skippedCount} bereits in der Warteschlange)`;
            }
            if (trackInfo.playlistTitle) {
                message += ` - "${trackInfo.playlistTitle}"`;
            }
            if (totalTracks >= 100) {
                message += ` (Große Playlist - ${totalTracks} Tracks)`;
            }
            showStatus(message, 'success');
            
        } else {
            // Handle single track (existing logic)
            const queueItem = {
                id: ++queueIdCounter,
                url: url,
                status: 'pending',
                title: trackInfo ? trackInfo.fullTitle : null,
                artist: trackInfo ? trackInfo.uploader : null,
                songTitle: trackInfo ? trackInfo.title : null,
                duration: trackInfo ? trackInfo.duration : null,
                filename: null,
                error: null,
                playlistName: null // Explicitly set to null for single tracks
            };

            downloadQueue.push(queueItem);
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
            
            urlInput.value = '';
            const trackName = trackInfo ? trackInfo.fullTitle : 'Track';
            showStatus(`✅ "${trackName}" ${translations[currentLanguage].added_to_queue}`, 'success');
        }
    });

    // Download all button
    downloadAllBtn.addEventListener('click', async function() {
        const pendingItems = downloadQueue.filter(item => item.status === 'pending');
        if (pendingItems.length === 0) return;

        setDownloadAllLoading(true);
        hideStatus();

        for (const item of pendingItems) {
            await downloadSingleItem(item);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between downloads
        }

        setDownloadAllLoading(false);
        showStatus(`✅ ${translations[currentLanguage].all_downloads_complete}`, 'success');
        updateDownloadCompletedButton();
    });

    // Clear queue button
    clearQueueBtn.addEventListener('click', function() {
        if (confirm(translations[currentLanguage].clear_queue_confirm)) {
            downloadQueue = [];
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
            downloadLinks.innerHTML = '';
            showStatus(translations[currentLanguage].queue_cleared, 'info');
        }
    });

    // Download single item with progress
    async function downloadSingleItem(item) {
        item.status = 'downloading';
        item.progress = 0;
        item.progressMessage = 'Starte Download...';
        updateQueueDisplay();

        try {
            const encodedUrl = encodeURIComponent(item.url);
            const eventSource = new EventSource(`/api/download-progress/${encodedUrl}`);

            eventSource.onmessage = function(event) {
                const data = JSON.parse(event.data);
                
                if (data.progress !== undefined) {
                    item.progress = data.progress;
                    item.progressMessage = data.message;
                    updateQueueDisplay();
                }

                if (data.success !== undefined) {
                    eventSource.close();
                    
                    if (data.success) {
                        item.status = 'completed';
                        item.title = data.title;
                        item.filename = data.filename;
                        item.progress = 100;
                        item.progressMessage = 'Abgeschlossen!';
                        addDownloadLink(data.filename, data.title);
                    } else {
                        item.status = 'error';
                        item.error = data.error;
                        item.progress = 0;
                        item.progressMessage = 'Fehler beim Download';
                    }
                    
                    saveQueue();
                    updateQueueDisplay();
                    updateDownloadAllButton();
                    updateDownloadCompletedButton();
                }
            };

            eventSource.onerror = function() {
                eventSource.close();
                item.status = 'error';
                item.error = 'Verbindungsfehler';
                item.progress = 0;
                item.progressMessage = 'Verbindung unterbrochen';
                saveQueue();
                updateQueueDisplay();
                updateDownloadAllButton();
                updateDownloadCompletedButton();
            };

        } catch (error) {
            item.status = 'error';
            item.error = 'Netzwerkfehler';
            item.progress = 0;
            item.progressMessage = 'Fehler beim Download';
            saveQueue();
            updateQueueDisplay();
            updateDownloadAllButton();
            updateDownloadCompletedButton();
        }
    }

    // Remove item from queue
    function removeFromQueue(itemId) {
        downloadQueue = downloadQueue.filter(item => item.id !== itemId);
        saveQueue();
        updateQueueDisplay();
        updateDownloadAllButton();
        updateDownloadCompletedButton();
    }

    // Update queue display
    function updateQueueDisplay() {
        queueCount.textContent = downloadQueue.length;

        if (downloadQueue.length === 0) {
            queueList.innerHTML = `<div class="empty-queue">${translations[currentLanguage].empty_queue}</div>`;
            return;
        }

        queueList.innerHTML = downloadQueue.map(item => `
            <div class="queue-item ${item.status}" data-id="${item.id}">
                <div class="queue-item-info">
                    ${(item.title && item.title !== 'NA' && item.title !== 'null') || (item.fullTitle && item.fullTitle !== 'NA' && item.fullTitle !== 'null') ? `
                        <div class="queue-item-title">${item.title || item.fullTitle}</div>
                        ${item.playlistName && item.playlistName !== 'NA' && item.playlistName !== 'null' ? `<div class="queue-item-playlist">📋 ${item.playlistName}</div>` : ''}
                        <div class="queue-item-url">${item.url}</div>
                    ` : `
                        <div class="queue-item-url">${item.url}</div>
                    `}
                    <div class="queue-item-status ${item.status}">
                        ${getStatusText(item)}
                    </div>
                    ${item.status === 'downloading' && item.progress !== undefined ? `
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${item.progress}%"></div>
                        </div>
                        <div class="progress-text">${item.progress}% - ${item.progressMessage || ''}</div>
                    ` : ''}
                </div>
                <div class="queue-item-actions">
                    ${item.status === 'pending' ? `
                        <button class="download-single-btn" onclick="downloadSingle(${item.id})">
                            ${translations[currentLanguage].download}
                        </button>
                    ` : ''}
                    <button class="remove-btn" onclick="removeItem(${item.id})">
                        ${translations[currentLanguage].remove}
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get status text
    function getStatusText(item) {
        const t = translations[currentLanguage];
        switch (item.status) {
            case 'pending':
                return t.status_pending;
            case 'downloading':
                return item.progressMessage || t.status_downloading;
            case 'completed':
                return `${t.status_completed} ${item.title}`;
            case 'error':
                return `${t.status_error} ${item.error}`;
            default:
                return t.status_unknown;
        }
    }

    // Update download all button
    function updateDownloadAllButton() {
        const pendingCount = downloadQueue.filter(item => item.status === 'pending').length;
        downloadAllBtn.disabled = pendingCount === 0;
        const t = translations[currentLanguage];
        downloadAllText.textContent = pendingCount > 0 ? `${t.download_all} (${pendingCount})` : t.download_all;
    }

    // Set download all loading state
    function setDownloadAllLoading(loading) {
        downloadAllBtn.disabled = loading;
        if (loading) {
            downloadAllText.textContent = translations[currentLanguage].downloading_progress;
            downloadAllSpinner.classList.remove('hidden');
        } else {
            downloadAllSpinner.classList.add('hidden');
            updateDownloadAllButton();
        }
    }

    // Show status message
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.classList.add('hidden');
        }, 5000);
    }

    // Hide status
    function hideStatus() {
        status.classList.add('hidden');
    }

    // Add download link
    function addDownloadLink(filename, title) {
        const linkElement = document.createElement('a');
        linkElement.href = `/api/download/${filename}`;
        linkElement.download = `${title}.mp3`;
        linkElement.className = 'download-link';
        linkElement.textContent = `📥 ${title}.mp3`;
        downloadLinks.appendChild(linkElement);
    }

    // Download completed files button
    downloadCompletedBtn.addEventListener('click', function() {
        const completedItems = downloadQueue.filter(item => item.status === 'completed' && item.filename);
        
        completedItems.forEach(item => {
            const link = document.createElement('a');
            link.href = `/api/download/${item.filename}`;
            link.download = `${item.title}.mp3`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        showStatus(`${completedItems.length} ${translations[currentLanguage].files_downloading}`, 'success');
    });

    // Update download completed button
    function updateDownloadCompletedButton() {
        const completedCount = downloadQueue.filter(item => item.status === 'completed').length;
        downloadCompletedBtn.disabled = completedCount === 0;
        const t = translations[currentLanguage];
        downloadCompletedText.textContent = completedCount > 0 ? `${t.download_completed} (${completedCount})` : t.download_completed;
    }

    // Save queue to localStorage
    function saveQueue() {
        localStorage.setItem('downloadQueue', JSON.stringify(downloadQueue));
        localStorage.setItem('queueIdCounter', queueIdCounter.toString());
    }

    // Global functions for onclick handlers
    window.downloadSingle = async function(itemId) {
        const item = downloadQueue.find(i => i.id === itemId);
        if (item) {
            await downloadSingleItem(item);
        }
    };

    window.removeItem = function(itemId) {
        removeFromQueue(itemId);
    };
});