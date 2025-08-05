# 📚 GitHub Setup Anleitung

So lädst du das SoundCloud MP3 Downloader Projekt auf GitHub hoch.

## 🚀 Schritt-für-Schritt Anleitung

### 1. GitHub Repository erstellen

1. **GitHub öffnen**: Gehe zu [github.com](https://github.com)
2. **Einloggen** in dein GitHub-Konto
3. **Neues Repository**: Klicke auf das grüne "New" oder "+" Icon
4. **Repository konfigurieren**:
   - **Repository Name**: `scloud-downloader` (oder einen anderen Namen)
   - **Description**: `🎵 Modern SoundCloud MP3 Downloader with authentic design`
   - **Visibility**: `Public` (empfohlen) oder `Private`
   - **NICHT** "Initialize with README" ankreuzen (wir haben schon eine)
   - **NICHT** .gitignore oder License hinzufügen (haben wir schon)
5. **Repository erstellen**: Klicke "Create repository"

### 2. Terminal/Command Line öffnen

```bash
# In das Projektverzeichnis wechseln
cd /Users/alala/Desktop/Scloud
```

### 3. Git Repository initialisieren

```bash
# Git Repository initialisieren
git init

# Alle Dateien zur Staging Area hinzufügen
git add .

# Ersten Commit erstellen
git commit -m "🎵 Initial commit: SoundCloud MP3 Downloader with authentic design

✨ Features:
- Authentic SoundCloud design (Light & Dark Mode)
- Queue management system
- Real-time progress bars with waveform animation
- Docker containerization
- Batch downloads
- Responsive web interface

🚀 Tech Stack:
- Node.js/Express backend
- Vanilla JavaScript frontend
- yt-dlp for downloads
- Docker & Docker Compose
- Server-Sent Events for progress"
```

### 4. GitHub Remote hinzufügen

```bash
# GitHub Repository als Remote hinzufügen
# WICHTIG: Ersetze 'yourusername' mit deinem GitHub-Benutzernamen!
git remote add origin https://github.com/yourusername/scloud-downloader.git

# Oder mit SSH (wenn SSH Keys konfiguriert):
# git remote add origin git@github.com:yourusername/scloud-downloader.git
```

### 5. Code zu GitHub pushen

```bash
# Main Branch umbenennen (falls nötig)
git branch -M main

# Code zu GitHub hochladen
git push -u origin main
```

## 📝 Weitere Commits hinzufügen

Wenn du später Änderungen machst:

```bash
# Änderungen anschauen
git status

# Alle Änderungen hinzufügen
git add .

# Commit mit Beschreibung
git commit -m "✨ Feature: Neue Funktionalität hinzugefügt"

# Zu GitHub pushen
git push
```

## 🏷️ Release erstellen (Optional)

1. **Releases Tab**: Auf GitHub zu deinem Repository → "Releases"
2. **Create a new release**: Klicken
3. **Tag version**: `v1.0.0`
4. **Release title**: `🎵 SoundCloud MP3 Downloader v1.0.0`
5. **Description**:

```markdown
## 🎉 Erste stabile Version!

### ✨ Features
- 🎨 Authentisches SoundCloud Design (Light & Dark Mode)
- 📋 Warteschlangen-Management für mehrere URLs
- 📊 Live-Fortschrittsbalken mit Waveform-Animation
- 🚀 Docker-Container für einfache Installation
- 📥 Batch-Downloads und einzelne Downloads
- 📱 Responsive Web-Interface

### 🛠️ Installation
```bash
docker-compose up --build
```

### 🌐 Verwendung
Öffne http://localhost:4554 und füge SoundCloud-URLs hinzu!

⚠️ **Nur für Bildungszwecke - Respektiere Urheberrechte!**
```

6. **Publish release**: Klicken

## 📄 README anpassen

Vergiss nicht, in der `README.md` die GitHub-URL zu aktualisieren:

```bash
# README.md bearbeiten
nano README.md

# Suche nach 'yourusername' und ersetze es mit deinem echten GitHub-Namen
# Beispiel: https://github.com/maxmustermann/scloud-downloader.git
```

## 🎯 GitHub Features aktivieren

### Issues Template

Erstelle `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Melde einen Bug
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Bug Beschreibung
Kurze Beschreibung des Problems

## 🔄 Schritte zum Reproduzieren
1. Gehe zu '...'
2. Klicke auf '...'
3. Scrolle runter zu '...'
4. Fehler erscheint

## ✅ Erwartetes Verhalten
Was sollte passieren?

## 📱 Environment
- OS: [z.B. macOS, Windows, Linux]
- Browser: [z.B. Chrome, Firefox, Safari]
- Version: [z.B. v1.0.0]
```

### GitHub Actions (CI/CD)

Erstelle `.github/workflows/docker.yml`:

```yaml
name: Docker Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker Image
      run: docker build -t scloud-downloader .
    
    - name: Test Docker Container
      run: |
        docker run -d -p 3000:3000 --name test-container scloud-downloader
        sleep 10
        curl -f http://localhost:3000/api/health || exit 1
        docker stop test-container
```

## 🔧 Troubleshooting

### "Permission denied" Fehler

```bash
# SSH Key für GitHub erstellen (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "your-email@example.com"

# SSH Key zu GitHub hinzufügen
cat ~/.ssh/id_ed25519.pub
# Kopiere den Output und füge ihn in GitHub Settings > SSH Keys hinzu
```

### "Repository not found" Fehler

```bash
# Remote URL prüfen
git remote -v

# Korrekte URL setzen (mit deinem GitHub-Namen!)
git remote set-url origin https://github.com/DEIN-USERNAME/scloud-downloader.git
```

### Große Dateien

Falls Git sich über große Dateien beschwert:

```bash
# Git LFS installieren
git lfs install

# Große Dateien tracken
git lfs track "*.mp3"
git lfs track "*.wav"

# .gitattributes committen
git add .gitattributes
git commit -m "🔧 Add Git LFS tracking"
```

## 🎉 Fertig!

Dein Repository ist jetzt auf GitHub verfügbar unter:
`https://github.com/yourusername/scloud-downloader`

### Nächste Schritte:
1. **README.md** mit korrekten GitHub-URLs aktualisieren
2. **Repository Description** auf GitHub hinzufügen
3. **Topics/Tags** hinzufügen: `soundcloud`, `downloader`, `docker`, `nodejs`
4. **Star** dein eigenes Projekt! ⭐

---

**🚀 Happy Coding!**