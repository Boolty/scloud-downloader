# 🎵 SoundCloud MP3 Downloader

Ein modernes Web-Interface zum Herunterladen von SoundCloud-Tracks als MP3-Dateien mit authentischem SoundCloud-Design.

![SoundCloud Downloader](https://img.shields.io/badge/SoundCloud-Downloader-FF5500?style=for-the-badge&logo=soundcloud&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🎨 **Authentisches SoundCloud Design**
- **Original SoundCloud-Farbschema** mit charakteristischem Orange (#FF5500)
- **Light & Dark Mode** - genau wie das echte SoundCloud
- **Mehrsprachigkeit** - Deutsch 🇩🇪 und Englisch 🇺🇸 Support
- **SoundCloud-Typografie** und authentische UI-Elemente
- **Responsive Design** für alle Geräte

### 🎵 **Download-Features**
- **Warteschlangen-System** - Mehrere URLs sammeln und verwalten
- **Automatische Playlist-Erkennung** - Ganze SoundCloud-Playlists mit einem Klick
- **Live-Fortschrittsbalken** mit SoundCloud-Waveform-Animation
- **Batch-Downloads** - Alle URLs auf einmal herunterladen
- **Einzelne Downloads** für spezifische Tracks
- **Automatische MP3-Konvertierung** mit hoher Qualität
- **Duplicate-Detection** - Verhindert doppelte Downloads

### 🚀 **Technische Highlights**
- **Docker-basiert** - Einfache Installation und Deployment
- **Real-time Progress** mit Server-Sent Events (SSE)
- **Responsive Web-Interface** mit modernem JavaScript
- **Automatische Dateibereinigung** nach Downloads
- **Persistent Queue** - Warteschlange bleibt erhalten

## 🛠️ Installation & Start

## 🚀 Komplette Installations-Anleitung (Schritt für Schritt)

### 📋 Schritt 0: Voraussetzungen installieren

#### Git installieren (falls nicht vorhanden)

**Windows:**
1. Download von [git-scm.com](https://git-scm.com/download/win)
2. Installer ausführen mit Standardeinstellungen
3. **Git Bash** oder **Command Prompt** öffnen

**macOS:**
```bash
# Mit Homebrew (empfohlen)
brew install git

# Oder Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

#### Docker Desktop installieren

**Windows/macOS:**
1. Download von [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installer ausführen und Docker Desktop starten
3. **Docker Desktop** muss laufen (Symbol in der Taskleiste)

**Linux (Ubuntu/Debian):**
```bash
# Docker installieren
sudo apt update
sudo apt install docker.io docker-compose

# Docker Service starten
sudo systemctl start docker
sudo systemctl enable docker

# User zu docker Gruppe hinzufügen (wichtig!)
sudo usermod -aG docker $USER

# Neustart oder neue Shell öffnen
newgrp docker
```

### 🎯 Schritt 1: Projekt von GitHub herunterladen

**Terminal/Command Prompt öffnen:**
- **Windows:** `Git Bash` oder `cmd` 
- **macOS:** `Terminal` 
- **Linux:** `Terminal`

**Repository klonen:**
```bash
git clone https://github.com/Boolty/scloud-downloader.git
cd scloud-downloader
```

### 🛠️ Schritt 2: Projekt starten

**Docker Container bauen und starten:**
```bash
docker-compose up --build
```

**⏳ Warten bis diese Meldung erscheint:**
```
🎵 SoundCloud Downloader läuft auf http://localhost:3000
📁 Downloads werden in: /app/downloads gespeichert
```

### 🌐 Schritt 3: Im Browser öffnen

**Browser öffnen und eingeben:**
```
http://localhost:4554
```

**✅ Erfolgreich wenn du siehst:**
- Orange SoundCloud Header mit 🎵 SoundCloud MP3 Downloader
- URL-Eingabefeld 
- Language-Toggle (🇩🇪/🇺🇸) und Dark-Mode-Toggle (🌙)

### 🎵 Schritt 4: Erste Verwendung testen

**Einzelnen Track testen:**
1. SoundCloud-Track-URL einfügen: `https://soundcloud.com/artist/song-name`
2. "Zur Liste hinzufügen" klicken
3. "Download" Button klicken
4. MP3-Download startet automatisch

**Ganze Playlist testen:**
1. SoundCloud-Playlist-URL einfügen: `https://soundcloud.com/user/sets/playlist-name`  
2. System erkennt automatisch: "📋 Playlist erkannt - lade Tracks..."
3. Alle Tracks werden zur Warteschlange hinzugefügt
4. "Alle herunterladen" klicken

### 🎉 Fertig!

**Das Projekt läuft erfolgreich wenn:**
- ✅ Website lädt auf http://localhost:4554
- ✅ Track-URLs können hinzugefügt werden  
- ✅ Playlists werden automatisch erkannt
- ✅ Downloads funktionieren
- ✅ MP3-Dateien werden heruntergeladen

---

## 🚀 Schnellstart für Erfahrene (3 Befehle)

```bash
git clone https://github.com/Boolty/scloud-downloader.git
cd scloud-downloader
docker-compose up --build
# Öffne: http://localhost:4554
```

---

## 💻 Alternative: Lokale Installation (Ohne Docker)

**Nur für Entwickler die Docker nicht verwenden möchten**

#### 1. Repository klonen
```bash
git clone https://github.com/Boolty/scloud-downloader.git
cd scloud-downloader
```

#### 2. Dependencies installieren
```bash
npm install
```

#### 3. yt-dlp installieren

**macOS (mit Homebrew):**
```bash
brew install yt-dlp
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install yt-dlp
```

**Windows:**
```bash
# Mit winget
winget install yt-dlp

# Oder manuell von https://github.com/yt-dlp/yt-dlp/releases
```

#### 4. Server starten
```bash
npm start
```

#### 5. Im Browser öffnen
```
http://localhost:3000
```


## 🌐 Verwendung

1. **Browser öffnen**: Gehe zu `http://localhost:4554`
2. **URLs hinzufügen**: 
   - **Einzelne Tracks**: `https://soundcloud.com/artist/song-name`
   - **Ganze Playlists**: `https://soundcloud.com/user/sets/playlist-name`
3. **Automatische Erkennung**: System erkennt automatisch Einzeltracks vs. Playlists
4. **Warteschlange aufbauen**: Mehrere URLs zur Liste hinzufügen
5. **Downloads starten**: 
   - **"Alle herunterladen"** - Alle URLs nacheinander
   - **"Download"** - Einzelne URLs sofort
   - **"Fertige downloaden"** - Bereits konvertierte Dateien
6. **Sprache wechseln**: Flag-Button (🇩🇪/🇺🇸) oben rechts für Deutsch/Englisch
7. **Dark Mode**: Toggle-Button (🌙/☀️) oben rechts im Header

## 📁 Projektstruktur

```
scloud-downloader/
├── public/                 # Frontend-Dateien
│   ├── index.html         # Haupt-HTML-Interface
│   ├── style.css          # SoundCloud-Design CSS
│   └── script.js          # Frontend-JavaScript
├── server.js              # Node.js Backend Server
├── package.json           # Node.js Dependencies
├── Dockerfile            # Docker Container Config
├── docker-compose.yml    # Docker Compose Setup
├── CLAUDE.md            # Claude Code Dokumentation
└── README.md            # Diese Dokumentation
```

## 🎯 API Endpoints

| Endpoint | Method | Beschreibung |
|----------|---------|-------------|
| `/` | GET | Web-Interface laden |
| `/api/download` | POST | Track herunterladen (JSON) |
| `/api/download-progress/:url` | GET | Live-Progress via SSE |
| `/api/download/:filename` | GET | MP3-Datei herunterladen |
| `/api/health` | GET | Server-Status prüfen |

## 🔧 Konfiguration

### Environment Variables

```bash
PORT=4554                 # Server Port (default: 3000)
NODE_ENV=production      # Umgebung
```

### Docker Ports

```yaml
ports:
  - "4554:3000"          # Host:Container Port Mapping
```

## 🎨 Design-Features

### SoundCloud-authentisches Design
- **Orange Header** (#FF5500) wie das Original
- **Flache Buttons** im SoundCloud-Stil
- **Saubere Typografie** mit Lucida Grande
- **Waveform-Animationen** in Fortschrittsbalken

### Dark Mode
- **Dunkler Hintergrund** (#1A1A1A)
- **Erhaltene Orange-Akzente** für Wiedererkennung
- **Optimierte Kontraste** für bessere Lesbarkeit
- **Nahtloser Theme-Wechsel**

## ⚡ Performance

- **Automatische Bereinigung** alter Downloads (1 Stunde)
- **Streaming-Downloads** für große Dateien
- **Resource-Limits** in Docker
- **Effiziente Event-Streams** für Progress-Updates

## 🔒 Sicherheit

- **URL-Validierung** - Nur SoundCloud-Links
- **Filename-Sanitization** gegen Directory Traversal
- **Automatische Cleanup** verhindert Speicher-Overflow
- **CORS-Schutz** für API-Endpoints

## 📋 Systemanforderungen

- **Node.js** 18+ (für lokale Installation)
- **Docker** & Docker Compose (für Container)
- **yt-dlp** (automatisch in Docker installiert)
- **ffmpeg** (automatisch in Docker installiert)

## 🚨 Rechtliche Hinweise

⚠️ **Wichtig**: Diese Software ist nur für Bildungszwecke bestimmt. 

- Respektiere die Urheberrechte
- Lade nur Musik herunter, die du besitzen darfst
- Beachte die SoundCloud Terms of Service
- Der Entwickler übernimmt keine Haftung für Missbrauch

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Changes committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request öffnen

## 🐛 Troubleshooting

### Häufige Probleme

**Port bereits belegt:**
```bash
# Port in docker-compose.yml ändern
ports:
  - "8080:3000"  # Anderen Port verwenden
```

**Download-Fehler:**
- URL prüfen (muss SoundCloud-Link sein)
- Internet-Verbindung testen
- Docker-Container neustarten

**Dark Mode funktioniert nicht:**
- Browser-Cache leeren (Ctrl+F5)
- Container neu bauen (`docker-compose up --build`)

## 📜 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- **yt-dlp** für Download-Funktionalität
- **SoundCloud** für das originale Design-System
- **Docker** für Containerisierung
- **Node.js** & Express für Backend

---

*Hinweis: Dieses Projekt ist nicht offiziell mit SoundCloud verbunden.*
