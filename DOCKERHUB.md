# 🎵 SoundCloud MP3 Downloader

A modern web application to download SoundCloud tracks as MP3 files with an authentic SoundCloud-style interface.

## ✨ Features

### 🎨 **Authentic SoundCloud Design**
- **Original SoundCloud color scheme** with signature Orange (#FF5500)
- **Light & Dark Mode** - just like the real SoundCloud
- **Multi-language** - German 🇩🇪 and English 🇺🇸 support
- **SoundCloud typography** and authentic UI elements
- **Responsive design** for all devices

### 🎵 **Download Features**
- **Queue System** - Collect and manage multiple URLs
- **Automatic Playlist Detection** - Download entire SoundCloud playlists with one click
- **Live Progress Bars** with SoundCloud waveform animations
- **Batch Downloads** - Download all URLs at once
- **Individual Downloads** for specific tracks
- **Automatic MP3 conversion** with high quality
- **Clean filenames** without timestamps
- **Track titles** displayed in queue

### 🚀 **Technical Highlights**
- **Docker-ready** - Easy installation and deployment
- **Real-time progress** with Server-Sent Events (SSE)
- **Responsive web interface** with modern JavaScript
- **Automatic file cleanup** after downloads
- **Persistent queue** - Queue survives restarts

## 🚀 Quick Start

### Ultra-Fast Setup (1 command):
```bash
docker run -d -p 4554:3000 --name scloud-downloader boolty/scloud-downloader:latest
```

**Then open:** http://localhost:4554

### With docker-compose:
```yaml
version: '3.8'
services:
  scloud-downloader:
    image: boolty/scloud-downloader:latest
    container_name: scloud-downloader
    ports:
      - "4554:3000"
    volumes:
      - ./downloads:/app/downloads
    restart: unless-stopped
```

## 🌐 Usage

1. **Open browser**: Go to `http://localhost:4554`
2. **Add URLs**: 
   - **Single tracks**: `https://soundcloud.com/artist/song-name`
   - **Entire playlists**: `https://soundcloud.com/user/sets/playlist-name`
3. **Automatic detection**: System automatically recognizes single tracks vs. playlists
4. **Build queue**: Add multiple URLs to your list
5. **Start downloads**: 
   - **"Download All"** - Process all URLs sequentially
   - **"Download"** - Process individual URLs immediately
   - **"Download Completed"** - Download already converted files

## 🏠 Perfect for

- **Home servers** (Synology, QNAP, Unraid)
- **Raspberry Pi** projects
- **Local development**
- **Docker enthusiasts**

## 🔒 Security & Legal

- **URL validation** - Only SoundCloud links accepted
- **Filename sanitization** against directory traversal
- **Automatic cleanup** prevents storage overflow
- **CORS protection** for API endpoints

⚠️ **Important**: This software is for educational purposes only. Respect copyrights and only download music you have the right to own.

## 📋 System Requirements

- **Docker** & Docker Compose
- **2GB RAM** minimum
- **Network access** to soundcloud.com

## 🐛 Support

- **GitHub**: https://github.com/Boolty/scloud-downloader
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Full README with step-by-step guides

## 🏷️ Tags

`soundcloud` `mp3` `downloader` `docker` `nodejs` `youtube-dl` `yt-dlp` `audio` `music` `playlist` `web-interface` `dark-mode` `german` `english`

---

🚀 **Multi-platform support**: linux/amd64, linux/arm64  
🔄 **Auto-updates**: Automated builds from GitHub  
📦 **Lightweight**: Alpine Linux base (~200MB)