# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Build and run with Docker (runs on port 4554)
docker-compose up --build

# Stop Docker containers
docker-compose down
```

## Architecture Overview

This is a SoundCloud MP3 downloader web application built with:

- **Backend**: Node.js/Express server that handles SoundCloud URL processing
- **Frontend**: Vanilla HTML/CSS/JavaScript web interface
- **Download Engine**: yt-dlp for extracting and converting audio files
- **Containerization**: Docker and Docker Compose for easy deployment

## Key Components

- `server.js` - Main Express server with download API endpoints
- `public/` - Static web files (HTML, CSS, JS)
- `downloads/` - Temporary storage for downloaded MP3 files
- `Dockerfile` - Container configuration with yt-dlp installation
- `docker-compose.yml` - Multi-container orchestration

## API Endpoints

- `POST /api/download` - Process SoundCloud URL and download track
- `GET /api/download/:filename` - Serve downloaded MP3 file
- `GET /api/health` - Health check endpoint

## Security Notes

- Files are automatically cleaned up after download
- Only SoundCloud URLs are accepted
- Filename sanitization prevents directory traversal
- Resource limits applied in Docker configuration