# Blabmarket CRM Demo Sistemi

Modern, kapsamlı ve kullanıcı dostu bir Müşteri İlişkileri Yönetim (CRM) sistemi demo sürümü.

## 🎯 Proje Özeti

Blabmarket CRM, özellikle tıbbi ürünler ve genel ticaret alanında faaliyet gösteren şirketler için tasarlanmış kapsamlı bir CRM çözümüdür. Sistem, müşteri yönetiminden finansal takibe, stok yönetiminden raporlamaya kadar tüm iş süreçlerini tek platformda birleştirmektedir.

## 🏗️ Teknoloji Stack'i

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Veritabanı**: PostgreSQL 15+
- **State Yönetimi**: Redux Toolkit + RTK Query
- **Kimlik Doğrulama**: JWT + bcrypt
- **Form Yönetimi**: React Hook Form + Yup
- **Build Tools**: Vite (Frontend), npm (Backend)

## 🌟 Ana Özellikler

### 📊 Dashboard
- Gerçek zamanlı iş metrikleri
- Görsel analitik ve grafikler
- Hızlı erişim butonları
- Kişiselleştirilebilir widget'lar

### 👥 Müşteri Yönetimi
- Kapsamlı müşteri profilleri
- İletişim geçmişi takibi
- Müşteri segmentasyonu
- Geri bildirim yönetimi

### 📦 Ürün & Stok Yönetimi
- Ürün kataloğu yönetimi
- Stok seviyesi takibi
- Otomatik stok uyarıları
- Tıbbi ürün özel kategorileri

### 💰 Satış Yönetimi
- Satış fırsatları takibi
- Satış hunisi (pipeline) görünümü
- Teklif hazırlama ve yönetimi
- Satış performans raporları

### 🛒 Satın Alma & Tedarikçi Yönetimi
- Satın alma siparişleri
- Tedarikçi veri tabanı
- İthalat/ihracat süreç takibi
- Fiyat karşılaştırmaları

### 💳 Finans Yönetimi
- Fatura oluşturma ve takibi
- Ödeme durumu kontrolü
- Mali raporlar
- Bakiye ve hesap yönetimi

### ✅ Görev & İş Akışı Yönetimi
- Görev ataması ve takibi
- Otomatik iş akışları
- Hatırlatma sistemleri
- Takım iş birliği araçları

### 📈 Raporlama & Analiz
- Özelleştirilebilir raporlar
- Veri görselleştirme
- Export özelliği (PDF, Excel)
- Gerçek zamanlı analitik

## 👤 Kullanıcı Rolleri

### 🔧 Admin
- Sistem ayarları ve kullanıcı yönetimi
- Tüm modüllere tam erişim
- Yetki ve rol düzenleme

### 💼 Satış Ekibi
- Müşteri ilişkileri yönetimi
- Satış fırsatları takibi
- Teklif hazırlama

### 🌍 İthalat/İhracat Ekibi
- Ürün ve stok yönetimi
- Tedarikçi ilişkileri
- İthalat/ihracat süreçleri

### 💰 Finans Ekibi
- Fatura ve ödeme yönetimi
- Mali raporlar
- Bütçe takibi

### 🎧 Müşteri Destek Ekibi
- Müşteri şikayetleri
- Destek talepleri
- Müşteri memnuniyeti

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler
- Node.js 18+ 
- PostgreSQL 15+
- npm veya yarn

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone https://github.com/blabmarket/crm-demo.git
cd blabmarket-crm
```

2. **Backend kurulumu**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run migrate
npm run seed
npm run dev
```

3. **Frontend kurulumu**
```bash
cd frontend
npm install
cp .env.example .env
# .env dosyasını düzenleyin
npm run dev
```

4. **Demo verileriyle sistemi başlatın**
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Demo Kullanıcıları

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@blabmarket.com | admin123 |
| Satış | satis@blabmarket.com | satis123 |
| Finans | finans@blabmarket.com | finans123 |
| İthalat/İhracat | ithalat@blabmarket.com | ithalat123 |
| Destek | destek@blabmarket.com | destek123 |

## 📁 Proje Yapısı

```
blabmarket-crm/
├── frontend/                 # React Frontend Uygulaması
│   ├── src/
│   │   ├── components/      # Genel UI bileşenleri
│   │   ├── modules/         # CRM modül bileşenleri
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Redux store
│   │   └── utils/           # Yardımcı fonksiyonlar
│   └── public/              # Statik dosyalar
├── backend/                  # Node.js Backend API
│   ├── src/
│   │   ├── controllers/     # API kontrolleri
│   │   ├── models/          # Veritabanı modelleri
│   │   ├── routes/          # API rotaları
│   │   ├── middleware/      # Ara yazılımlar
│   │   └── services/        # İş mantığı servisleri
│   └── migrations/          # DB migration dosyaları
├── database/                 # DB şemaları ve seed veriler
├── docs/                     # Proje dokümantasyonu
└── README.md
```

## 🔐 Güvenlik Özellikleri

- JWT tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü
- Şifre hashleme (bcrypt)
- SQL injection koruması
- XSS ve CSRF koruması
- Rate limiting

## 📱 Responsive Tasarım

- Mobil uyumlu arayüz
- Tablet optimizasyonu
- Esnek grid sistem
- Touch-friendly kullanım

## 🔄 API Dokümantasyonu

- Swagger/OpenAPI entegrasyonu
- RESTful API tasarımı
- Standardize edilmiş response formatları
- Kapsamlı error handling

## 📊 Test Coverage

- Unit testler (Jest)
- Integration testler
- Component testleri (React Testing Library)
- API endpoint testleri

## 🌐 Dağıtım

### Development
```bash
npm run dev:all
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Desteği
```bash
docker-compose up -d
```

## 📈 Performans

- Lazy loading
- Code splitting
- Database indexleme
- Query optimizasyonu
- Caching stratejileri

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit'leyin (`git commit -m 'Add some AmazingFeature'`)
4. Push'layın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: Blabmarket
- **E-posta**: info@blabmarket.com
- **Website**: https://www.blabmarket.com

## 🎉 Teşekkürler

Bu CRM sisteminin geliştirilmesinde emeği geçen tüm geliştiricilere ve test ekibine teşekkürler.

---

**Not**: Bu bir demo sürümüdür ve production kullanımı için ek güvenlik ve performans optimizasyonları gerekebilir.