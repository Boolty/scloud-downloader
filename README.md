# 🎵 SoundCloud MP3 Downloader

Ein modernes Web-Interface zum Herunterladen von SoundCloud-Tracks als MP3-Dateien mit authentischem SoundCloud-Design.

![SoundCloud Downloader](https://img.shields.io/badge/SoundCloud-Downloader-FF5500?style=for-the-badge&logo=soundcloud&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🎨 **Authentisches SoundCloud Design**
- **Original SoundCloud-Farbschema** mit charakteristischem Orange (#FF5500)
- **Light & Dark Mode** - genau wie das echte SoundCloud
- **SoundCloud-Typografie** und authentische UI-Elemente
- **Responsive Design** für alle Geräte

### 🎵 **Download-Features**
- **Warteschlangen-System** - Mehrere URLs sammeln und verwalten
- **Live-Fortschrittsbalken** mit SoundCloud-Waveform-Animation
- **Batch-Downloads** - Alle URLs auf einmal herunterladen
- **Einzelne Downloads** für spezifische Tracks
- **Automatische MP3-Konvertierung** mit hoher Qualität

### 🚀 **Technische Highlights**
- **Docker-basiert** - Einfache Installation und Deployment
- **Real-time Progress** mit Server-Sent Events (SSE)
- **Responsive Web-Interface** mit modernem JavaScript
- **Automatische Dateibereinigung** nach Downloads
- **Persistent Queue** - Warteschlange bleibt erhalten

## 🛠️ Installation & Start

### Mit Docker (Empfohlen)

```bash
# Repository klonen
git clone https://github.com/Boolty/scloud-downloader.git
cd scloud-downloader

# Mit Docker Compose starten
docker-compose up --build

# Oder im Hintergrund
docker-compose up --build -d
```

### Lokal (Ohne Docker)

```bash
# Dependencies installieren
npm install

# yt-dlp installieren (macOS)
brew install yt-dlp

# yt-dlp installieren (Ubuntu/Debian)
sudo apt install yt-dlp

# Server starten
npm start
```

## 🌐 Verwendung

1. **Browser öffnen**: Gehe zu `http://localhost:4554`
2. **URLs hinzufügen**: SoundCloud-Links in das Eingabefeld kopieren
3. **Warteschlange aufbauen**: Mehrere URLs zur Liste hinzufügen
4. **Downloads starten**: 
   - **"Alle herunterladen"** - Alle URLs nacheinander
   - **"Download"** - Einzelne URLs sofort
   - **"Fertige downloaden"** - Bereits konvertierte Dateien
5. **Dark Mode**: Toggle-Button oben rechts im Header

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
