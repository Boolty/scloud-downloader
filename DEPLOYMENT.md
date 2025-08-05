# 🚀 Deployment Guide

Anleitung zum Deployen des SoundCloud MP3 Downloaders auf verschiedenen Plattformen.

## 📋 Voraussetzungen

- Docker & Docker Compose installiert
- Git installiert
- Grundkenntnisse in Terminal/Command Line

## 🐳 Docker Deployment (Empfohlen)

### Lokales Development

```bash
# Repository klonen
git clone https://github.com/yourusername/scloud-downloader.git
cd scloud-downloader

# Container im Development Mode starten
docker-compose up --build

# Oder im Hintergrund
docker-compose up --build -d

# Logs anschauen
docker-compose logs -f

# Container stoppen
docker-compose down
```

### Production Deployment

```bash
# Environment auf Production setzen
export NODE_ENV=production

# Container für Production bauen und starten
docker-compose -f docker-compose.yml up --build -d

# Health Check
docker-compose ps
```

## 🌐 VPS/Server Deployment

### 1. Server vorbereiten

```bash
# Updates installieren
sudo apt update && sudo apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose installieren
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Neustart für Gruppenmitgliedschaft
sudo reboot
```

### 2. Projekt deployen

```bash
# Repository klonen
git clone https://github.com/yourusername/scloud-downloader.git
cd scloud-downloader

# Port für öffentlichen Zugriff ändern (optional)
nano docker-compose.yml
# Ändere: "4554:3000" zu "80:3000" für Port 80

# Starten
docker-compose up --build -d

# Firewall konfigurieren (Ubuntu/Debian)
sudo ufw allow 4554/tcp  # oder 80/tcp
sudo ufw enable
```

### 3. Reverse Proxy mit Nginx (Optional)

```bash
# Nginx installieren
sudo apt install nginx -y

# Nginx Konfiguration erstellen
sudo nano /etc/nginx/sites-available/scloud-downloader
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Deine Domain

    location / {
        proxy_pass http://localhost:4554;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Konfiguration aktivieren
sudo ln -s /etc/nginx/sites-available/scloud-downloader /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## ☁️ Cloud Deployment

### Railway

```bash
# Railway CLI installieren
npm install -g @railway/cli

# In Railway einloggen
railway login

# Projekt erstellen
railway init
railway add

# Environment Variables setzen
railway variables set NODE_ENV=production
railway variables set PORT=3000

# Deployen
railway up
```

### Heroku

```bash
# Heroku CLI installieren
# https://devcenter.heroku.com/articles/heroku-cli

# Einloggen
heroku login

# App erstellen
heroku create your-app-name

# Container Registry nutzen
heroku container:login
heroku container:push web
heroku container:release web

# Öffnen
heroku open
```

### DigitalOcean App Platform

1. GitHub Repository mit DigitalOcean verbinden
2. App erstellen mit folgenden Einstellungen:
   - **Source**: GitHub Repository
   - **Branch**: main
   - **Build Command**: `docker build -t app .`
   - **Run Command**: `docker run -p 8080:3000 app`
   - **Port**: 3000

## 🔧 Konfiguration

### Environment Variables

```bash
# .env Datei erstellen
PORT=4554
NODE_ENV=production
```

### Docker Compose Anpassungen

```yaml
# docker-compose.yml
version: '3.8'
services:
  scloud-downloader:
    build: .
    ports:
      - "${PORT:-4554}:3000"  # Port von Environment Variable
    environment:
      - NODE_ENV=${NODE_ENV:-production}
    volumes:
      - ./downloads:/app/downloads
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G          # Memory Limit anpassen
        reservations:
          memory: 512M
```

## 📊 Monitoring & Logs

### Docker Logs

```bash
# Logs anschauen
docker-compose logs -f

# Nur Fehler
docker-compose logs --tail=50 | grep ERROR

# Container Status
docker-compose ps
```

### Health Checks

```bash
# API Health Check
curl http://localhost:4554/api/health

# Container Health
docker-compose exec scloud-downloader curl http://localhost:3000/api/health
```

## 🔄 Updates

```bash
# Code Updates holen
git pull origin main

# Container neu bauen und starten
docker-compose down
docker-compose up --build -d

# Alte Images aufräumen
docker system prune -a
```

## 🛠️ Troubleshooting

### Häufige Probleme

**Port bereits belegt:**
```bash
# Verwendete Ports prüfen
sudo netstat -tlnp | grep :4554

# Port in docker-compose.yml ändern
sed -i 's/4554:3000/8080:3000/g' docker-compose.yml
```

**Memory Issues:**
```bash
# Memory Usage prüfen
docker stats

# Memory Limit in docker-compose.yml erhöhen
memory: 2G
```

**Permission Denied:**
```bash
# Docker ohne sudo nutzen
sudo usermod -aG docker $USER
# Dann ausloggen und wieder einloggen
```

## 🔒 Sicherheit

### Firewall Konfiguration

```bash
# Ubuntu/Debian
sudo ufw allow ssh
sudo ufw allow 4554/tcp
sudo ufw --force enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=4554/tcp
sudo firewall-cmd --reload
```

### SSL/HTTPS mit Let's Encrypt

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# SSL Zertifikat erstellen
sudo certbot --nginx -d your-domain.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

## 📈 Performance Optimierung

### Docker Optimierungen

```dockerfile
# Multi-stage build für kleinere Images
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Nginx Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

**🚀 Happy Deploying!**