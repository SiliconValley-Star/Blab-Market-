# 🚀 Blabmarket CRM - Deployment Rehberi

Bu rehber, Blabmarket CRM sisteminin farklı ortamlarda nasıl deploy edileceğini adım adım açıklar.

---

## 📋 İçindekiler

- [⚡ Hızlı Başlangıç](#-hızlı-başlangıç)
- [🔧 Gereksinimler](#-gereksinimler)
- [💻 Local Development](#-local-development)
- [🏗️ Production Deployment](#️-production-deployment)
- [🐳 Docker Deployment](#-docker-deployment)
- [☁️ Cloud Deployment](#️-cloud-deployment)
- [🔒 SSL/HTTPS Kurulumu](#-sslhttps-kurulumu)
- [📊 Monitoring ve Logging](#-monitoring-ve-logging)
- [🔄 Backup ve Recovery](#-backup-ve-recovery)
- [🚨 Troubleshooting](#-troubleshooting)

---

## ⚡ Hızlı Başlangıç

### 🎯 Demo Ortamını 5 Dakikada Başlatın

```bash
# Repository'yi klonlayın
git clone <repository-url>
cd blabmarket-crm-demo

# Docker ile tek komutta başlatın
docker-compose up -d

# Tarayıcınızda açın
open http://localhost:3000
```

**Demo Giriş Bilgileri:**
- **Admin:** admin@blabmarket.com / admin123
- **Satış:** sales@blabmarket.com / sales123

---

## 🔧 Gereksinimler

### 💻 Sistem Gereksinimleri

#### **Minimum Gereksinimler:**
```yaml
CPU: 2 core
RAM: 4 GB
Storage: 20 GB
Network: 10 Mbps
```

#### **Önerilen Gereksinimler:**
```yaml
CPU: 4 core
RAM: 8 GB
Storage: 50 GB SSD
Network: 100 Mbps
```

### 🛠️ Yazılım Gereksinimleri

#### **Development Environment:**
- **Node.js** v18.x veya üzeri
- **npm** v8.x veya üzeri
- **PostgreSQL** v14.x veya üzeri
- **Git** v2.x veya üzeri

#### **Production Environment:**
- **Node.js** v18.x (LTS)
- **PM2** v5.x (Process Manager)
- **Nginx** v1.20+ (Reverse Proxy)
- **PostgreSQL** v14.x+ (Database)
- **Redis** v6.x+ (Session Store - Opsiyonel)

#### **Development Tools:**
```bash
# Global paketleri yükleyin
npm install -g pm2 typescript ts-node nodemon

# TypeScript compiler
npm install -g typescript

# Database CLI tools
npm install -g postgres-cli
```

---

## 💻 Local Development

### 🔧 Adım Adım Kurulum

#### 1️⃣ **Repository Klonlama**
```bash
# Projeyi klonlayın
git clone <repository-url>
cd blabmarket-crm-demo

# Branch'leri kontrol edin
git branch -a
git checkout development  # veya istediğiniz branch
```

#### 2️⃣ **Database Kurulumu**
```bash
# PostgreSQL kurulumu (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL kurulumu (macOS)
brew install postgresql
brew services start postgresql

# Database ve user oluşturma
sudo -u postgres psql
```

**PostgreSQL içinde:**
```sql
-- Database oluştur
CREATE DATABASE blabmarket_crm;

-- User oluştur
CREATE USER blabmarket_user WITH PASSWORD 'your_secure_password';

-- Yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE blabmarket_crm TO blabmarket_user;

-- Çıkış
\q
```

#### 3️⃣ **Backend Kurulumu**
```bash
cd backend

# Dependencies yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env
```

**`.env` dosyasını düzenleyin:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blabmarket_crm
DB_USER=blabmarket_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional for demo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

**Database'i başlatın:**
```bash
# Tabloları oluştur ve mock data ekle
npm run db:setup

# Development sunucusunu başlat
npm run dev
```

#### 4️⃣ **Frontend Kurulumu**
```bash
# Yeni terminal açın
cd frontend

# Dependencies yükle
npm install

# Environment dosyasını oluştur
cp .env.example .env.local
```

**`.env.local` dosyasını düzenleyin:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Blabmarket CRM
VITE_APP_VERSION=1.0.0
```

**Development sunucusunu başlatın:**
```bash
npm run dev
```

#### 5️⃣ **Doğrulama**
```bash
# Backend healthcheck
curl http://localhost:5000/api/health

# Frontend erişim
open http://localhost:3000
```

---

## 🏗️ Production Deployment

### 🚀 Production Build

#### 1️⃣ **Backend Production Build**
```bash
cd backend

# Production dependencies
npm ci --only=production

# TypeScript build
npm run build

# PM2 ecosystem dosyası
cp ecosystem.config.example.js ecosystem.config.js
```

**`ecosystem.config.js` düzenleyin:**
```javascript
module.exports = {
  apps: [{
    name: 'blabmarket-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

**PM2 ile başlatın:**
```bash
# PM2'yi başlat
pm2 start ecosystem.config.js --env production

# Otomatik başlatmayı aktif et
pm2 startup
pm2 save
```

#### 2️⃣ **Frontend Production Build**
```bash
cd frontend

# Production build
npm run build

# Build dosyalarını kontrol et
ls -la dist/
```

#### 3️⃣ **Nginx Konfigürasyonu**

**`/etc/nginx/sites-available/blabmarket`:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Frontend static files
    location / {
        root /var/www/blabmarket/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Nginx'i aktif edin:**
```bash
# Site'ı aktif et
sudo ln -s /etc/nginx/sites-available/blabmarket /etc/nginx/sites-enabled/

# Konfigürasyonu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

---

## 🐳 Docker Deployment

### 📦 Docker Container'ları

#### **Docker Compose ile Full Stack**

**`docker-compose.yml`:**
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: blabmarket_db
    environment:
      POSTGRES_DB: blabmarket_crm
      POSTGRES_USER: blabmarket_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  # Redis (Session Store)
  redis:
    image: redis:7-alpine
    container_name: blabmarket_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: blabmarket_api
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: blabmarket_crm
      DB_USER: blabmarket_user
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    ports:
      - "5000:5000"
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://localhost:5000/api
    container_name: blabmarket_web
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: blabmarket_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

**Environment dosyası (`.env`):**
```env
DB_PASSWORD=super_secure_db_password_2024
JWT_SECRET=ultra_super_secret_jwt_key_for_production_2024_make_it_very_long
```

#### **Backend Dockerfile**

**`backend/Dockerfile`:**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S blabmarket -u 1001

# Copy built application
COPY --from=builder --chown=blabmarket:nodejs /app/dist ./dist
COPY --from=builder --chown=blabmarket:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=blabmarket:nodejs /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads && chown blabmarket:nodejs uploads

# Switch to non-root user
USER blabmarket

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "dist/server.js"]
```

#### **Frontend Dockerfile**

**`frontend/Dockerfile`:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build arguments
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### **Deployment Komutları**
```bash
# Environment değişkenlerini ayarlayın
export DB_PASSWORD="your_secure_password"
export JWT_SECRET="your_super_secret_key"

# Build ve başlat
docker-compose up -d --build

# Logları kontrol et
docker-compose logs -f

# Servisleri kontrol et
docker-compose ps

# Database'i initialize et
docker-compose exec backend npm run db:setup
```

---

## ☁️ Cloud Deployment

### 🌩️ AWS Deployment

#### **EC2 Instance Setup**
```bash
# EC2 instance'a bağlan
ssh -i your-key.pem ubuntu@your-ec2-ip

# System güncelle
sudo apt update && sudo apt upgrade -y

# Docker kur
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Docker Compose kur
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Projeyi deploy et
git clone <your-repo>
cd blabmarket-crm-demo
docker-compose up -d --build
```

#### **RDS PostgreSQL Setup**
```bash
# AWS CLI konfigüre et
aws configure

# RDS instance oluştur
aws rds create-db-instance \
    --db-instance-identifier blabmarket-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username blabmarket \
    --master-user-password YourSecurePassword \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxx
```

#### **Application Load Balancer**
```bash
# ALB oluştur
aws elbv2 create-load-balancer \
    --name blabmarket-alb \
    --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
    --security-groups sg-xxxxxxxx

# Target Group oluştur
aws elbv2 create-target-group \
    --name blabmarket-targets \
    --protocol HTTP \
    --port 80 \
    --vpc-id vpc-xxxxxxxx \
    --target-type instance
```

### 🚀 Vercel/Netlify Deployment (Frontend Only)

#### **Frontend-Only Deployment**

**Vercel için `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-api.herokuapp.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://your-backend-api.herokuapp.com/api"
  }
}
```

**Netlify için `netlify.toml`:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  VITE_API_BASE_URL = "https://your-backend-api.herokuapp.com/api"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.herokuapp.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 🔥 Heroku Deployment (Full Stack)

#### **Backend Deployment**
```bash
# Heroku CLI yükle ve login ol
heroku login

# Backend için Heroku app oluştur
cd backend
heroku create blabmarket-api

# PostgreSQL addon ekle
heroku addons:create heroku-postgresql:hobby-dev

# Environment variables ayarla
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_key

# Deploy et
git push heroku main

# Database'i setup et
heroku run npm run db:setup
```

#### **Frontend Deployment**
```bash
# Frontend için Heroku app oluştur
cd frontend
heroku create blabmarket-web

# Buildpack ayarla
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs

# Environment variables
heroku config:set VITE_API_BASE_URL=https://blabmarket-api.herokuapp.com/api

# Deploy et
git push heroku main
```

---

## 🔒 SSL/HTTPS Kurulumu

### 🔐 Let's Encrypt ile Ücretsiz SSL

#### **Certbot Kurulumu**
```bash
# Certbot kur (Ubuntu/Debian)
sudo apt update
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Certbot'u PATH'e ekle
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Nginx için SSL sertifikası al
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenilemeyi test et
sudo certbot renew --dry-run
```

#### **Manual SSL Configuration**

**Nginx SSL Config `/etc/nginx/sites-available/blabmarket`:**
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Rest of configuration...
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring ve Logging

### 📈 Application Monitoring

#### **PM2 Monitoring**
```bash
# PM2 monitoring
pm2 monit

# Process listesi
pm2 list

# Logları görüntüle
pm2 logs

# Restart processes
pm2 restart all

# Memory kullanım raporu
pm2 show blabmarket-api
```

#### **System Monitoring Tools**

**htop kurulumu:**
```bash
sudo apt install htop
htop
```

**Disk kullanımı:**
```bash
df -h
du -sh /var/www/blabmarket
```

**Network monitoring:**
```bash
sudo netstat -tulpn | grep :5000
sudo ss -tulpn | grep :3000
```

### 📋 Centralized Logging

#### **Winston Logger Configuration**

**`backend/src/utils/logger.ts`:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'blabmarket-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

#### **ELK Stack (Elasticsearch, Logstash, Kibana)**

**`docker-compose.elk.yml`:**
```yaml
version: '3.8'

services:
  elasticsearch:
    image: elasticsearch:8.5.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kibana:
    image: kibana:8.5.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  logstash:
    image: logstash:8.5.0
    container_name: logstash
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

---

## 🔄 Backup ve Recovery

### 💾 Database Backup

#### **Automated PostgreSQL Backup Script**

**`scripts/backup_database.sh`:**
```bash
#!/bin/bash

# Configuration
DB_NAME="blabmarket_crm"
DB_USER="blabmarket_user"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/blabmarket_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/database/

echo "Backup completed: $BACKUP_FILE.gz"
```

**Crontab ile otomatik backup:**
```bash
# Crontab düzenle
crontab -e

# Her gece 2:00'da backup al
0 2 * * * /path/to/scripts/backup_database.sh
```

#### **Database Recovery**
```bash
# Backup'tan restore et
gunzip blabmarket_backup_20240101_020000.sql.gz
psql -h localhost -U blabmarket_user -d blabmarket_crm < blabmarket_backup_20240101_020000.sql
```

### 📁 File System Backup

**Application files backup:**
```bash
#!/bin/bash
# Application backup script

APP_DIR="/var/www/blabmarket"
BACKUP_DIR="/var/backups/blabmarket"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/app_backup_$DATE.tar.gz"

mkdir -p $BACKUP_DIR

# Create application backup
tar -czf $BACKUP_FILE -C $APP_DIR .

# Remove old backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +30 -delete

echo "Application backup completed: $BACKUP_FILE"
```

---

## 🚨 Troubleshooting

### ❌ Common Issues & Solutions

#### **Database Connection Issues**

**Problem:** `Connection refused to PostgreSQL`
```bash
# PostgreSQL servisini kontrol et
sudo systemctl status postgresql
sudo systemctl start postgresql

# Port kontrolü
sudo netstat -tulpn | grep 5432

# PostgreSQL loglarını kontrol et
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

**Problem:** `Authentication failed`
```sql
-- PostgreSQL'e bağlan ve kullanıcı şifresini resetle
sudo -u postgres psql
ALTER USER blabmarket_user WITH PASSWORD 'new_password';
\q
```

#### **Memory Issues**

**Problem:** `JavaScript heap out of memory`
```bash
# Node.js memory limitini artır
export NODE_OPTIONS="--max-old-space-size=4096"

# PM2 için memory limiti
pm2 start ecosystem.config.js --max-memory-restart 1G
```

**Problem:** High memory usage
```bash
# Memory kullanımını analiz et
free -h
ps aux --sort=-%mem | head

# Swap ekle
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### **Performance Issues**

**Problem:** Slow API responses
```bash
# Database performance analizi
sudo -u postgres psql blabmarket_crm
EXPLAIN ANALYZE SELECT * FROM customers;

# Slow query log aktif et
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();
```

**Problem:** High CPU usage
```bash
# CPU kullanımını analiz et
top -p $(pgrep node)
htop

# PM2 cluster mode kullan
pm2 start ecosystem.config.js -i max
```

#### **SSL/HTTPS Issues**

**Problem:** SSL certificate errors
```bash
# Sertifika durumunu kontrol et
sudo certbot certificates

# Sertifikayı yenile
sudo certbot renew

# Nginx konfigürasyonunu test et
sudo nginx -t
```

### 🔍 Debug Tools

#### **Application Debug**
```bash
# Backend debug modu
DEBUG=* npm run dev

# Frontend dev tools
npm run dev -- --debug

# Network debugging
curl -v http://localhost:5000/api/health
```

#### **Database Debug**
```sql
-- Active connections
SELECT * FROM pg_stat_activity;

-- Database size
SELECT pg_size_pretty(pg_database_size('blabmarket_crm'));

-- Table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 📞 Getting Help

#### **Support Channels**
- 📧 **Technical Support:** devops@blabmarket.com
- 📞 **Emergency Hotline:** +90 XXX XXX XX XX
- 💬 **Community Forum:** community.blabmarket.com
- 📚 **Documentation:** docs.blabmarket.com

#### **Log Files Locations**
```bash
# Application logs
/var/www/blabmarket/backend/logs/

# Nginx logs
/var/log/nginx/access.log
/var/log/nginx/error.log

# PostgreSQL logs
/var/log/postgresql/

# PM2 logs
~/.pm2/logs/
```

---

## ✅ Deployment Checklist

### 🔍 Pre-deployment Checklist

- [ ] **Environment Variables** configured
- [ ] **Database** connection tested
- [ ] **SSL Certificate** installed and tested
- [ ] **Backup Strategy** implemented
- [ ] **Monitoring** tools configured
- [ ] **Security** headers configured
- [ ] **Performance** testing completed
- [ ] **Load Testing** performed
- [ ] **Documentation** updated

### 🚀 Post-deployment Checklist

- [ ] **Health Checks** passing
- [ ] **SSL/HTTPS** working correctly
- [ ] **Database** migrations successful
- [ ] **Static Assets** serving correctly
- [ ] **API Endpoints** responding
- [ ] **User Authentication** working
- [ ] **Email Notifications** working
- [ ] **Backup Jobs** scheduled
- [ ] **Monitoring Alerts** configured
- [ ] **Performance Metrics** baseline established

---

**🎯 Bu deployment rehberi ile Blabmarket CRM sisteminizi güvenle production ortamında çalıştırabilirsiniz.**

*Son güncelleme: 2025-09-24*