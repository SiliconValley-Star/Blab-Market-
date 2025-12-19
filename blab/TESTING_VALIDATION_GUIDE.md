# 🧪 Blabmarket CRM - Test ve Validation Rehberi

Bu rehber, Blabmarket CRM sisteminin tüm modüllerinin test edilmesi ve doğrulanması için kapsamlı bir kılavuz sunar.

---

## 📋 İçindekiler

- [🎯 Test Stratejisi](#-test-stratejisi)
- [🔍 Manuel Test Senaryoları](#-manuel-test-senaryoları)
- [✅ Validation Checklist](#-validation-checklist)
- [🛠️ Otomatik Test Setup](#️-otomatik-test-setup)
- [📊 Performance Testing](#-performance-testing)
- [🔒 Security Testing](#-security-testing)
- [📱 Cross-Browser Testing](#-cross-browser-testing)
- [♿ Accessibility Testing](#-accessibility-testing)
- [📝 Test Raporlama](#-test-raporlama)

---

## 🎯 Test Stratejisi

### 🔄 Test Piramidi

```
                    E2E Tests (10%)
                 ┌─────────────────┐
                 │  User Journeys  │
                 │  Integration    │
                 └─────────────────┘
              Integration Tests (30%)
         ┌─────────────────────────────┐
         │    API Testing              │
         │    Component Integration    │
         │    Database Operations      │
         └─────────────────────────────┘
        Unit Tests (60%)
  ┌─────────────────────────────────────┐
  │  Individual Functions               │
  │  Components                         │
  │  Services                           │
  │  Utils                              │
  └─────────────────────────────────────┘
```

### 🔧 Test Türleri

#### **1. Unit Tests**
- **Backend:** Controllers, Services, Utils
- **Frontend:** Components, Hooks, Utils
- **Coverage:** %80+

#### **2. Integration Tests**
- **API Endpoints:** CRUD operasyonları
- **Database:** Veri tutarlılığı
- **Component Integration:** Props ve state akışı

#### **3. End-to-End Tests**
- **User Journeys:** Login → Dashboard → CRUD → Logout
- **Cross-module:** Müşteri → Satış → Fatura akışı
- **Role-based:** Her kullanıcı rolü için test senaryoları

---

## 🔍 Manuel Test Senaryoları

### 🔐 Authentication & Authorization

#### **Scenario 1: Kullanıcı Girişi**
```
✅ Test Adımları:
1. http://localhost:3000 adresine git
2. Login sayfasının yüklendiğini doğrula
3. Demo kullanıcı kartlarının görüntülendiğini kontrol et
4. Admin kullanıcısına tıkla
5. Form alanlarının otomatik doldurulduğunu kontrol et
6. "Giriş Yap" butonuna tıkla
7. Dashboard'a yönlendirildiğini doğrula
8. Üst menüde kullanıcı bilgilerinin göründüğünü kontrol et

🎯 Beklenen Sonuç:
- Başarılı giriş
- Dashboard yüklendi
- Kullanıcı bilgileri görüntülendi
```

#### **Scenario 2: Rol Tabanlı Erişim**
```
✅ Test Adımları:
1. Farklı roller ile giriş yap (Admin, Sales, Finance, Import/Export, Support)
2. Her rol için menü öğelerinin farklı olduğunu kontrol et
3. Yetkisiz sayfaya erişim deneme
4. 403/401 hata mesajlarını kontrol et

🎯 Beklenen Sonuç:
- Her rol sadece yetkili sayfaları görür
- Yetkisiz erişimlerde hata mesajı
```

### 👥 Müşteri Yönetimi

#### **Scenario 3: Müşteri CRUD İşlemleri**
```
✅ Test Adımları:
1. Müşteriler menüsüne git
2. "Yeni Müşteri" butonuna tıkla
3. Formu doldur:
   - Şirket Adı: "Test Hospital"
   - E-posta: "test@hospital.com"
   - Telefon: "+90 555 123 4567"
   - Şehir: "Istanbul"
   - Müşteri Türü: "Hastane"
4. "Kaydet" butonuna tıkla
5. Başarı mesajını kontrol et
6. Müşteri listesinde yeni müşteriyi görüntüle
7. Düzenle butonuna tıkla
8. Bilgileri güncelle
9. Silme işlemini test et

🎯 Beklenen Sonuç:
- CRUD işlemleri başarılı
- Doğrulama mesajları çalışıyor
- Liste güncellenmiş
```

#### **Scenario 4: Müşteri Arama ve Filtreleme**
```
✅ Test Adımları:
1. Müşteriler sayfasında arama kutusunu kullan
2. "Hospital" ile ara
3. Sonuçları kontrol et
4. Şehir filtresini kullan
5. Müşteri türü filtresini test et
6. Filtreleri temizle

🎯 Beklenen Sonuç:
- Arama sonuçları doğru
- Filtreler çalışıyor
- Sonuçlar gerçek zamanlı güncelleniyor
```

### 📦 Ürün Yönetimi

#### **Scenario 5: Ürün Yönetimi**
```
✅ Test Adımları:
1. Ürünler menüsüne git
2. Ürün listesini kontrol et
3. "Yeni Ürün" oluştur:
   - Ad: "Test MR Cihazı"
   - Kod: "TMR-001"
   - Kategori: "Tıbbi Görüntüleme"
   - Stok: 10
   - Alış Fiyatı: 50000
   - Satış Fiyatı: 75000
4. Stok hareketlerini kontrol et
5. Düşük stok uyarılarını test et

🎯 Beklenen Sonuç:
- Ürün başarıyla oluşturuldu
- Stok takibi çalışıyor
- Uyarılar aktif
```

### 💰 Satış Yönetimi

#### **Scenario 6: Satış Pipeline**
```
✅ Test Adımları:
1. Satış menüsüne git
2. "Yeni Fırsat" oluştur
3. Pipeline görünümünü kontrol et
4. Drag & drop ile aşama değiştir
5. Fırsat detaylarını düzenle
6. Kapatma işlemini test et

🎯 Beklenen Sonuç:
- Fırsat oluşturuldu
- Pipeline güncellenmiş
- Aşama değişimleri kaydedildi
```

### 💳 Finans Modülü

#### **Scenario 7: Fatura İşlemleri**
```
✅ Test Adımları:
1. Finans menüsüne git
2. "Yeni Fatura" oluştur
3. Müşteri seç
4. Ürün/hizmet ekle
5. Vergi hesaplamalarını kontrol et
6. Faturayı kaydet
7. PDF export test et
8. Ödeme durumu güncelle

🎯 Beklenen Sonuç:
- Fatura oluşturuldu
- Hesaplamalar doğru
- PDF export çalışıyor
```

### ⚡ Otomasyon Sistemi

#### **Scenario 8: E-posta Otomasyonu**
```
✅ Test Adımları:
1. Otomasyon menüsüne git
2. E-posta şablonlarını incele
3. Test e-postası gönder
4. İş akışlarını kontrol et
5. Tetikleyici durumları test et
6. Çalıştırma geçmişini görüntüle

🎯 Beklenen Sonuç:
- Test e-postası gönderildi
- İş akışları aktif
- Geçmiş kayıtları mevcut
```

### 📊 Raporlama

#### **Scenario 9: Rapor Oluşturma**
```
✅ Test Adımları:
1. Raporlar menüsüne git
2. Hazır raporları görüntüle
3. Özel rapor oluştur
4. Filtreler uygula
5. Export işlevlerini test et
6. Dashboard widget'larını kontrol et

🎯 Beklenen Sonuç:
- Raporlar doğru verilerle yüklendi
- Export işlemleri çalışıyor
- Widget'lar güncel
```

---

## ✅ Validation Checklist

### 🎨 UI/UX Validation

#### **Responsive Design**
- [ ] **Mobile** (320px - 767px)
  - [ ] Menü hamburger icon çalışıyor
  - [ ] Alt navigasyon görünüyor
  - [ ] Formlar düzgün görüntüleniyor
  - [ ] Tablolar horizontal scroll yapıyor

- [ ] **Tablet** (768px - 1023px)
  - [ ] Sidebar collapsible çalışıyor
  - [ ] Grid layout düzgün
  - [ ] Modal boyutları uygun

- [ ] **Desktop** (1024px+)
  - [ ] Full sidebar görünümü
  - [ ] Tüm widget'lar yerinde
  - [ ] Grafikler düzgün ölçeklendi

#### **Accessibility**
- [ ] **Keyboard Navigation**
  - [ ] Tab sırası mantıklı
  - [ ] Enter ve Space tuşları çalışıyor
  - [ ] Escape ile modal kapanıyor
  - [ ] Focus indicator görünür

- [ ] **Screen Reader**
  - [ ] Alt text'ler mevcut
  - [ ] ARIA labels tanımlı
  - [ ] Form labels doğru bağlantılı
  - [ ] Heading yapısı hierarşik

- [ ] **Color Contrast**
  - [ ] WCAG AA standartlarını karşılıyor
  - [ ] High contrast mode desteği
  - [ ] Color-blind friendly

#### **Performance**
- [ ] **Load Times**
  - [ ] Initial load < 3 saniye
  - [ ] Route değişimi < 1 saniye
  - [ ] Image lazy loading çalışıyor
  - [ ] API response < 500ms

- [ ] **Memory Usage**
  - [ ] Memory leak yok
  - [ ] Bundle size optimize
  - [ ] Unused code temizlenmiş

### 🔒 Security Validation

#### **Authentication & Authorization**
- [ ] **Login Security**
  - [ ] Password hashing (bcrypt)
  - [ ] JWT token expiration
  - [ ] Rate limiting aktif
  - [ ] CSRF koruması

- [ ] **API Security**
  - [ ] Input validation
  - [ ] SQL injection koruması
  - [ ] XSS koruması
  - [ ] Role-based access control

#### **Data Protection**
- [ ] **Sensitive Data**
  - [ ] Şifreler hashed
  - [ ] PII verileri korunmuş
  - [ ] Audit log aktif
  - [ ] GDPR compliance

### 🗄️ Database Validation

#### **Data Integrity**
- [ ] **Referential Integrity**
  - [ ] Foreign key constraints
  - [ ] Cascade deletes
  - [ ] Orphan records yok
  - [ ] Data consistency

- [ ] **Performance**
  - [ ] Index optimization
  - [ ] Query performance
  - [ ] Connection pooling
  - [ ] Backup strategy

### 📱 Cross-Platform Testing

#### **Browser Compatibility**
- [ ] **Chrome** (Latest)
- [ ] **Firefox** (Latest)
- [ ] **Safari** (Latest)
- [ ] **Edge** (Latest)
- [ ] **Mobile Chrome**
- [ ] **Mobile Safari**

#### **Operating Systems**
- [ ] **Windows 10/11**
- [ ] **macOS Monterey+**
- [ ] **Ubuntu 20.04+**
- [ ] **iOS 14+**
- [ ] **Android 10+**

---

## 🛠️ Otomatik Test Setup

### 📋 Backend Testing

#### **Jest Configuration**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/src/tests/setup.ts"],
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.{ts,js}",
      "!src/tests/**",
      "!src/**/*.d.ts"
    ]
  }
}
```

#### **Test Commands**
```bash
# Unit testleri çalıştır
npm run test

# Coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch

# CI/CD için
npm run test:ci
```

### 🎨 Frontend Testing

#### **Vitest Configuration**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

#### **Test Commands**
```bash
# Frontend testleri
npm run test

# Coverage
npm run test:coverage

# UI modda çalıştır
npm run test:ui
```

---

## 📊 Performance Testing

### 🚀 Load Testing

#### **Artillery.js Setup**
```yaml
# artillery.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "API Load Test"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "admin@blabmarket.com"
            password: "admin123"
      - get:
          url: "/api/customers"
      - get:
          url: "/api/products"
      - get:
          url: "/api/sales"
```

#### **Performance Commands**
```bash
# Load testing
artillery run artillery.yml

# Report generation
artillery report artillery-report.json
```

### 📈 Monitoring

#### **Key Metrics**
- **Response Time:** < 200ms average
- **Throughput:** > 100 RPS
- **Error Rate:** < 1%
- **CPU Usage:** < 80%
- **Memory Usage:** < 512MB
- **Database Connections:** < 50

---

## 🔒 Security Testing

### 🛡️ OWASP Testing

#### **Security Checklist**
- [ ] **SQL Injection**
  - [ ] Parameterized queries kullanımı
  - [ ] Input validation
  - [ ] Error handling

- [ ] **XSS (Cross-Site Scripting)**
  - [ ] Input sanitization
  - [ ] Output encoding
  - [ ] CSP headers

- [ ] **CSRF (Cross-Site Request Forgery)**
  - [ ] CSRF tokens
  - [ ] SameSite cookies
  - [ ] Origin validation

- [ ] **Authentication Vulnerabilities**
  - [ ] Strong password policy
  - [ ] Account lockout
  - [ ] Session management

#### **Security Tools**
```bash
# OWASP ZAP automated scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# npm security audit
npm audit

# Dependency vulnerability check
npm audit fix
```

---

## 📱 Cross-Browser Testing

### 🌐 Browser Matrix

| Browser | Version | Status |
|---------|---------|---------|
| Chrome | Latest | ✅ Primary |
| Firefox | Latest | ✅ Secondary |
| Safari | Latest | ✅ Secondary |
| Edge | Latest | ✅ Secondary |
| Mobile Chrome | Latest | ✅ Primary Mobile |
| Mobile Safari | Latest | ✅ Primary Mobile |

### 🧪 Testing Strategy

#### **Manual Testing**
1. **Core Functionality:** Her browserde temel akışları test et
2. **Visual Regression:** Screenshot karşılaştırma
3. **Performance:** Browser-specific metrikler
4. **Mobile Specific:** Touch interactions, viewport

#### **Automated Testing**
```javascript
// Playwright cross-browser testing
const { test, expect } = require('@playwright/test');

test('cross-browser login test', async ({ page, browserName }) => {
  await page.goto('http://localhost:3000');
  
  // Browser-specific optimizations
  if (browserName === 'webkit') {
    await page.waitForTimeout(1000); // Safari needs extra time
  }
  
  await page.fill('[data-testid="email"]', 'admin@blabmarket.com');
  await page.fill('[data-testid="password"]', 'admin123');
  await page.click('[data-testid="login-button"]');
  
  await expect(page).toHaveURL(/.*dashboard/);
});
```

---

## ♿ Accessibility Testing

### 🎯 WCAG 2.1 Compliance

#### **Level AA Requirements**
- [ ] **Perceivable**
  - [ ] Text alternatives for images
  - [ ] Captions for videos
  - [ ] Color contrast 4.5:1
  - [ ] Resizable text up to 200%

- [ ] **Operable**
  - [ ] Keyboard accessible
  - [ ] No seizure-inducing content
  - [ ] Enough time to read
  - [ ] Navigation assistance

- [ ] **Understandable**
  - [ ] Readable text
  - [ ] Predictable functionality
  - [ ] Input assistance
  - [ ] Error identification

- [ ] **Robust**
  - [ ] Compatible with assistive technologies
  - [ ] Valid HTML
  - [ ] Future-proof markup

#### **Testing Tools**
```bash
# axe-core accessibility testing
npm install --save-dev @axe-core/react

# Lighthouse accessibility audit
lighthouse http://localhost:3000 --only-categories=accessibility

# Manual testing with screen reader
# macOS: VoiceOver
# Windows: NVDA
# Chrome: ChromeVox
```

---

## 📝 Test Raporlama

### 📊 Test Metrics

#### **Coverage Requirements**
- **Backend Unit Tests:** %85+
- **Frontend Unit Tests:** %80+
- **Integration Tests:** %70+
- **E2E Tests:** Critical paths

#### **Quality Gates**
- All tests passing
- No critical security vulnerabilities
- Performance benchmarks met
- Accessibility compliance
- Browser compatibility confirmed

### 📋 Test Report Template

```markdown
# Test Execution Report

## Summary
- **Date:** 2025-09-24
- **Version:** 1.0.0
- **Environment:** Production-like
- **Tester:** QA Team

## Test Results
- **Total Tests:** 145
- **Passed:** 142
- **Failed:** 3
- **Skipped:** 0
- **Success Rate:** 97.9%

## Coverage
- **Backend:** 87%
- **Frontend:** 82%
- **Overall:** 84.5%

## Performance
- **Load Test:** ✅ Passed
- **Response Time:** 156ms avg
- **Error Rate:** 0.2%

## Security
- **Vulnerabilities:** 0 Critical, 2 Medium
- **OWASP:** ✅ Passed
- **Penetration Test:** ✅ Passed

## Browser Compatibility
- **Chrome:** ✅ Passed
- **Firefox:** ✅ Passed
- **Safari:** ⚠️ Minor issues
- **Edge:** ✅ Passed

## Accessibility
- **WCAG 2.1 AA:** ✅ Compliant
- **Screen Reader:** ✅ Compatible
- **Keyboard Navigation:** ✅ Working

## Issues Found
1. **Safari date picker styling** - Cosmetic
2. **Mobile menu animation** - Performance
3. **PDF export timeout** - Fixed

## Recommendations
1. Optimize mobile animations
2. Implement date picker polyfill
3. Increase PDF timeout limit

## Sign-off
- **QA Lead:** ✅ Approved
- **Tech Lead:** ✅ Approved
- **Product Owner:** ✅ Approved
```

---

## 🎯 Final Validation Steps

### ✅ Pre-Production Checklist

#### **Functionality**
- [ ] All CRUD operations working
- [ ] User authentication functional
- [ ] Role-based permissions correct
- [ ] Data validation active
- [ ] Error handling proper

#### **Performance**
- [ ] Page load times acceptable
- [ ] API response times optimal
- [ ] Database queries optimized
- [ ] Memory usage reasonable
- [ ] No memory leaks detected

#### **Security**
- [ ] All security scans passed
- [ ] Sensitive data protected
- [ ] Input validation comprehensive
- [ ] Authorization working correctly
- [ ] HTTPS enforced

#### **User Experience**
- [ ] Responsive design working
- [ ] Cross-browser compatibility
- [ ] Accessibility compliant
- [ ] Error messages helpful
- [ ] Loading states present

#### **Deployment Ready**
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Monitoring configured
- [ ] Backup systems active
- [ ] Documentation complete

---

**🎉 Tüm testler başarılı olduğunda, sistem production ortamında kullanıma hazır!**

*Son güncelleme: 2025-09-24*