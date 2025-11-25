# 🏢 Blabmarket CRM

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)

**Modern, kapsamlı ve kullanıcı dostu Müşteri İlişkileri Yönetim (CRM) sistemi**

[Özellikler](#-ana-özellikler) • [Kurulum](#-kurulum-ve-çalıştırma) • [Dokümantasyon](#-dokümantasyon) • [Katkıda Bulunma](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Ana Özellikler](#-ana-özellikler)
- [Teknoloji Stack'i](#️-teknoloji-stacki)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Güvenlik](#-güvenlik)
- [Test](#-test)
- [Dağıtım](#-dağıtım)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

---

## 🎯 Proje Hakkında

**Blabmarket CRM**, özellikle tıbbi ürünler ve genel ticaret alanında faaliyet gösteren şirketler için tasarlanmış kapsamlı bir CRM çözümüdür. Sistem, müşteri yönetiminden finansal takibe, stok yönetiminden raporlamaya kadar tüm iş süreçlerini tek platformda birleştirmektedir.

### 🎨 Öne Çıkan Özellikler

- ✨ **Modern UI/UX**: Glassmorphism tasarım ile kullanıcı dostu arayüz
- 🔐 **Güvenli Kimlik Doğrulama**: JWT tabanlı güvenli oturum yönetimi
- 📊 **Gerçek Zamanlı Analitik**: Canlı veri görselleştirme ve raporlama
- 🔔 **Bildirim Sistemi**: WebSocket ile anlık bildirimler
- 📱 **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- 🚀 **Yüksek Performans**: Optimize edilmiş kod ve veritabanı sorguları
- 🛡️ **Rol Tabanlı Erişim**: Detaylı yetkilendirme sistemi

---

## 🌟 Ana Özellikler

### 📊 Dashboard
- Gerçek zamanlı iş metrikleri ve KPI'lar
- İnteraktif grafikler ve görsel analitik
- Hızlı erişim butonları ve widget'lar
- Kişiselleştirilebilir dashboard görünümü
- Satış hunisi ve performans göstergeleri

### 👥 Müşteri Yönetimi
- Kapsamlı müşteri profilleri ve iletişim bilgileri
- İletişim geçmişi ve etkileşim takibi
- Müşteri segmentasyonu (küçük, orta, büyük)
- Kredi limiti ve ödeme takibi
- Müşteri geri bildirim yönetimi
- Müşteri yaşam döngüsü yönetimi

### 📦 Ürün & Stok Yönetimi
- Ürün kataloğu ve kategori yönetimi
- Stok seviyesi takibi ve uyarıları
- Otomatik stok uyarı sistemi
- Tıbbi ürün özel kategorileri
- Ürün fiyat yönetimi
- SKU ve barkod takibi

### 💰 Satış Yönetimi
- Satış fırsatları (opportunities) takibi
- Satış hunisi (pipeline) görünümü
- Teklif hazırlama ve yönetimi
- Satış performans raporları
- Müşteri bazlı satış analizi
- Tahmin ve hedef takibi

### 🛒 Satın Alma & Tedarikçi Yönetimi
- Satın alma siparişleri (PO) yönetimi
- Tedarikçi veri tabanı ve değerlendirme
- İthalat/ihracat süreç takibi
- Fiyat karşılaştırmaları
- Tedarikçi performans analizi
- Sipariş durumu takibi

### 💳 Finans Yönetimi
- Fatura oluşturma ve takibi
- Ödeme durumu kontrolü ve tahsilat
- Mali raporlar ve analizler
- Bakiye ve hesap yönetimi
- Kredi limiti takibi
- Ödeme geçmişi ve raporlama

### ✅ Görev & İş Akışı Yönetimi
- Görev ataması ve takibi
- Öncelik ve durum yönetimi
- Otomatik iş akışları (workflows)
- Hatırlatma sistemleri
- Takım iş birliği araçları
- Görev yorumları ve dosya ekleme

### 📈 Raporlama & Analiz
- Özelleştirilebilir raporlar
- Gelişmiş veri görselleştirme
- Export özelliği (PDF, Excel, CSV)
- Gerçek zamanlı analitik
- Satış, finans ve müşteri raporları
- WhatsApp analitik entegrasyonu

### 🔄 Otomasyon
- İş akışı otomasyonu
- Zaman bazlı tetikleyiciler
- E-posta ve bildirim otomasyonu
- Durum güncelleme otomasyonları
- Özel kural tanımlama

---

## 🏗️ Teknoloji Stack'i

### Frontend
- **Framework**: React 18.2+ with TypeScript
- **Styling**: Tailwind CSS 3.3+
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router DOM 6.15+
- **Forms**: React Hook Form + Yup Validation
- **UI Components**: Custom components + Heroicons
- **Charts**: Recharts 2.7+
- **PDF Export**: jsPDF + html2canvas
- **Build Tool**: Vite 4.4+
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.1+
- **Database**: PostgreSQL 15+
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Joi + express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Real-time**: Socket.io 4.8+
- **Email**: Nodemailer
- **File Upload**: Multer
- **API Docs**: Swagger/OpenAPI

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript
- **Testing**: Jest + React Testing Library
- **Version Control**: Git
- **Process Manager**: PM2 (Production)

---

## 🚀 Kurulum ve Çalıştırma

### 📋 Ön Gereksinimler

Aşağıdaki yazılımların sisteminizde yüklü olması gerekmektedir:

- **Node.js** 18.0.0 veya üzeri
- **npm** 8.0.0 veya üzeri (veya yarn)
- **PostgreSQL** 15.0 veya üzeri
- **Git** 2.0 veya üzeri

### 🔧 Kurulum Adımları

#### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/blabmarket-crm.git
cd blabmarket-crm/blab
```

#### 2. Veritabanı Kurulumu

PostgreSQL veritabanınızı oluşturun:

```bash
# PostgreSQL'e bağlanın
sudo -u postgres psql

# Veritabanı ve kullanıcı oluşturun
CREATE DATABASE blabmarket_crm;
CREATE USER blabmarket_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE blabmarket_crm TO blabmarket_user;
\q
```

Şema ve seed verilerini yükleyin:

```bash
cd database
psql -U blabmarket_user -d blabmarket_crm -f schema.sql
psql -U blabmarket_user -d blabmarket_crm -f seed.sql
```

#### 3. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env
```

`.env` dosyasını düzenleyin:

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
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Backend'i başlatın:

```bash
# Development modunda çalıştır
npm run dev

# Veya production build
npm run build
npm start
```

Backend şu adreste çalışacak: `http://localhost:3001`

#### 4. Frontend Kurulumu

Yeni bir terminal penceresi açın:

```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Blabmarket CRM
VITE_APP_VERSION=1.0.0
```

Frontend'i başlatın:

```bash
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

### ✅ Doğrulama

Kurulumun başarılı olduğunu kontrol edin:

```bash
# Backend health check
curl http://localhost:3001/health

# Frontend'i tarayıcıda açın
open http://localhost:5173
```

### 🐳 Docker ile Hızlı Başlangıç

Docker kullanarak hızlıca başlatmak için:

```bash
# Docker Compose ile tüm servisleri başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs -f
```

---

## 👤 Demo Kullanıcıları

Sistemi test etmek için aşağıdaki demo hesaplarını kullanabilirsiniz:

| Rol | E-posta | Şifre | Yetkiler |
|-----|---------|-------|----------|
| 🔧 **Admin** | admin@blabmarket.com | admin123 | Tüm modüllere tam erişim |
| 💼 **Satış Ekibi** | satis@blabmarket.com | satis123 | Müşteri, Satış, Görev |
| 🌍 **İthalat/İhracat** | ithalat@blabmarket.com | ithalat123 | Ürün, Tedarikçi, Stok |
| 💰 **Finans Ekibi** | finans@blabmarket.com | finans123 | Finans, Fatura, Ödeme |
| 🎧 **Müşteri Destek** | destek@blabmarket.com | destek123 | Müşteri, Görev, Bildirim |

---

## 📁 Proje Yapısı

```
blabmarket-crm/
├── backend/                      # Node.js Backend API
│   ├── src/
│   │   ├── routes/              # API route tanımları
│   │   │   ├── authRoutes.ts
│   │   │   ├── customersRoutes.ts
│   │   │   ├── productsRoutes.ts
│   │   │   ├── salesRoutes.ts
│   │   │   ├── financeRoutes.ts
│   │   │   ├── tasksRoutes.ts
│   │   │   └── ...
│   │   ├── middleware/          # Express middleware'ler
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── services/            # İş mantığı servisleri
│   │   │   ├── automationService.ts
│   │   │   ├── eventService.ts
│   │   │   └── dataSyncService.ts
│   │   ├── data/                # Mock data
│   │   └── server.ts            # Ana server dosyası
│   ├── dist/                    # Compiled JavaScript
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Genel UI bileşenleri
│   │   │   ├── layout/         # Layout bileşenleri
│   │   │   └── ui/             # UI bileşenleri
│   │   ├── modules/            # CRM modül sayfaları
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── finance/
│   │   │   ├── tasks/
│   │   │   └── ...
│   │   ├── store/              # Redux store
│   │   │   └── slices/         # Redux slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── App.tsx             # Ana uygulama bileşeni
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Statik dosyalar
│   ├── package.json
│   └── vite.config.ts
│
├── database/                     # Veritabanı dosyaları
│   ├── schema.sql              # Veritabanı şeması
│   └── seed.sql                # Seed verileri
│
├── mock-data/                   # Mock JSON verileri
│   ├── customers.json
│   ├── products.json
│   ├── sales.json
│   └── ...
│
├── docs/                        # Dokümantasyon
│   ├── DEPLOYMENT_GUIDE.md
│   ├── blabmarket-crm-architecture.md
│   └── ...
│
└── README.md                    # Bu dosya
```

---

## 🔄 API Dokümantasyonu

### Base URL
```
Development: http://localhost:3001/api
Production: https://api.blabmarket.com/api
```

### Authentication Endpoints

```http
POST   /api/auth/login          # Kullanıcı girişi
POST   /api/auth/logout         # Kullanıcı çıkışı
GET    /api/auth/me             # Mevcut kullanıcı bilgisi
POST   /api/auth/refresh-token  # Token yenileme
```

### Customer Endpoints

```http
GET    /api/customers           # Müşteri listesi
POST   /api/customers           # Yeni müşteri oluştur
GET    /api/customers/:id       # Müşteri detayı
PUT    /api/customers/:id       # Müşteri güncelle
DELETE /api/customers/:id       # Müşteri sil
GET    /api/customers/:id/interactions  # İletişim geçmişi
```

### Product Endpoints

```http
GET    /api/products            # Ürün listesi
POST   /api/products            # Yeni ürün oluştur
GET    /api/products/:id       # Ürün detayı
PUT    /api/products/:id       # Ürün güncelle
DELETE /api/products/:id       # Ürün sil
GET    /api/products/low-stock  # Düşük stok uyarıları
```

### Sales Endpoints

```http
GET    /api/sales/opportunities      # Satış fırsatları
POST   /api/sales/opportunities      # Yeni fırsat oluştur
GET    /api/sales/opportunities/:id  # Fırsat detayı
PUT    /api/sales/opportunities/:id  # Fırsat güncelle
GET    /api/sales/pipeline           # Satış hunisi
```

### Finance Endpoints

```http
GET    /api/finance/invoices         # Fatura listesi
POST   /api/finance/invoices         # Yeni fatura oluştur
GET    /api/finance/invoices/:id     # Fatura detayı
PUT    /api/finance/invoices/:id     # Fatura güncelle
POST   /api/finance/payments         # Ödeme kaydet
```

### Diğer Endpoints

- `/api/tasks` - Görev yönetimi
- `/api/suppliers` - Tedarikçi yönetimi
- `/api/reports` - Raporlar
- `/api/analytics` - Analitik veriler
- `/api/automation` - Otomasyon kuralları
- `/api/export` - Veri export

### API Response Formatı

```typescript
// Başarılı Response
{
  "success": true,
  "data": { ... },
  "message": "İşlem başarılı"
}

// Hata Response
{
  "success": false,
  "error": "Hata mesajı",
  "errors": ["Detaylı hata 1", "Detaylı hata 2"]
}

// Pagination ile Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Swagger/OpenAPI dokümantasyonu**: `http://localhost:3001/api-docs` (Development)

---

## 🔐 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- ✅ **Password Hashing**: bcrypt ile şifre hashleme (12 salt rounds)
- ✅ **Role-Based Access Control (RBAC)**: Rol tabanlı yetkilendirme
- ✅ **SQL Injection Protection**: Parameterized queries
- ✅ **XSS Protection**: Input sanitization ve validation
- ✅ **CSRF Protection**: Token tabanlı koruma
- ✅ **Rate Limiting**: API istek limitleri
- ✅ **Helmet.js**: HTTP güvenlik başlıkları
- ✅ **CORS Configuration**: Cross-origin kaynak paylaşımı kontrolü
- ✅ **Environment Variables**: Hassas bilgilerin güvenli saklanması

### Güvenlik Best Practices

1. **Production ortamında**:
   - Güçlü JWT_SECRET kullanın
   - HTTPS kullanın
   - Rate limiting'i aktif edin
   - Düzenli güvenlik güncellemeleri yapın

2. **Veritabanı**:
   - Güçlü şifreler kullanın
   - Minimum yetki prensibi (principle of least privilege)
   - Düzenli backup alın

3. **Kod Güvenliği**:
   - Dependency'leri düzenli güncelleyin
   - Güvenlik açıklarını tarayın (`npm audit`)
   - Kod incelemesi yapın

---

## 🧪 Test

### Test Komutları

```bash
# Backend testleri
cd backend
npm test                 # Tüm testleri çalıştır
npm run test:watch       # Watch modunda test

# Frontend testleri
cd frontend
npm test                 # Tüm testleri çalıştır
npm run test:watch       # Watch modunda test
```

### Test Coverage

- ✅ Unit testler (Jest)
- ✅ Integration testler (Supertest)
- ✅ Component testleri (React Testing Library)
- ✅ API endpoint testleri
- ✅ Form validation testleri

---

## 🌐 Dağıtım

### Development

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production Build

```bash
# Backend build
cd backend
npm run build
npm start

# Frontend build
cd frontend
npm run build
npm run preview
```

### Docker Deployment

```bash
# Tüm servisleri Docker ile başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

Detaylı deployment bilgileri için [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) dosyasına bakın.

---

## 📈 Performans Optimizasyonları

- ⚡ **Lazy Loading**: Route bazlı kod bölme
- ⚡ **Code Splitting**: Dinamik import'lar
- ⚡ **Database Indexing**: Optimize edilmiş sorgular
- ⚡ **Query Optimization**: Efficient database queries
- ⚡ **Caching Strategies**: Response caching
- ⚡ **Bundle Optimization**: Vite build optimizasyonları
- ⚡ **Image Optimization**: Optimize edilmiş görseller

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Projeye katkıda bulunmak için:

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/AmazingFeature`)
3. **Commit** yapın (`git commit -m 'feat: Add some AmazingFeature'`)
4. **Push** yapın (`git push origin feature/AmazingFeature`)
5. **Pull Request** oluşturun

### Commit Mesaj Formatı

Proje [Conventional Commits](https://www.conventionalcommits.org/) standardını kullanmaktadır:

```
feat: yeni özellik ekleme
fix: hata düzeltme
docs: dokümantasyon güncellemesi
style: kod formatı değişiklikleri
refactor: kod iyileştirmeleri
test: test ekleme/düzenleme
chore: build süreçleri veya yardımcı araçlar
```

### Kod Standartları

- TypeScript strict mode aktif
- ESLint kurallarına uyum
- Prettier ile kod formatlama
- Component'ler için TypeScript tipleri
- Açıklayıcı değişken ve fonksiyon isimleri

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 📞 İletişim

- **Proje Sahibi**: Blabmarket
- **E-posta**: info@blabmarket.com
- **Website**: https://www.blabmarket.com
- **GitHub Issues**: [Issues sayfasından](https://github.com/yourusername/blabmarket-crm/issues) sorularınızı iletebilirsiniz

---

## 🎉 Teşekkürler

Bu CRM sisteminin geliştirilmesinde emeği geçen tüm geliştiricilere, test ekibine ve katkıda bulunanlara teşekkürler!

### Özel Teşekkürler

- React ve TypeScript topluluğu
- Tüm açık kaynak kütüphane geliştiricileri
- Projeye katkıda bulunan herkese

---

## 📌 Notlar

- ⚠️ **Demo Sürümü**: Bu bir demo sürümüdür ve production kullanımı için ek güvenlik ve performans optimizasyonları gerekebilir.
- 🔄 **Aktif Geliştirme**: Proje aktif olarak geliştirilmektedir. Yeni özellikler ve düzeltmeler düzenli olarak eklenmektedir.
- 📚 **Dokümantasyon**: Detaylı dokümantasyon için `docs/` klasörüne bakın.

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ by Blabmarket Team

</div>
