# Blabmarket CRM - UI/UX Tasarım Dokümanı

## 1. Tasarım Prensipleri

### Ana Tasarım Yaklaşımı
- **Minimalist ve Modern**: Temiz, sade arayüz
- **Kullanıcı Dostu**: İntuitif navigasyon ve iş akışları
- **Responsive**: Tüm cihazlarda optimum görüntüleme
- **Erişilebilir**: WCAG 2.1 AA standartlarına uygun
- **Marka Uyumlu**: Blabmarket renk paletini kullanan

### Renk Paleti
```css
/* Ana Renkler - Blabmarket Brand */
--primary-blue: #1E88E5;     /* Ana mavi - Blabmarket logosu */
--primary-red: #E53935;      /* Ana kırmızı - Blabmarket logosu */
--primary-white: #FFFFFF;    /* Beyaz */

/* Gri Tonları */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;

/* Sistem Renkleri */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;

/* Arka Plan Renkleri */
--bg-primary: #FAFAFA;
--bg-secondary: #FFFFFF;
--bg-sidebar: #1E293B;
```

### Tipografi
```css
/* Font Ailesi */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Font Boyutları */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Ağırlıkları */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 2. Ana Düzen (Layout)

### Genel Sayfa Yapısı
```
┌─────────────────────────────────────────┐
│ Header (TopBar) - 64px                  │
├─────────┬───────────────────────────────┤
│         │                               │
│ Sidebar │ Main Content Area             │
│ 280px   │                               │
│         │                               │
│         │                               │
│         │                               │
│         │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

### Header (TopBar) Bileşenleri
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] CRM Dashboard    [Arama]  [Bildirimler] [Profil] │
└──────────────────────────────────────────────────────────────┘
```

### Sidebar Navigasyon
```
┌─────────────────┐
│ Dashboard       │ 
│ 👥 Müşteriler   │
│ 📦 Ürünler      │
│ 💰 Satış        │
│ 🛒 Satın Alma   │
│ 💳 Finans       │
│ ✅ Görevler     │
│ 📊 Raporlar     │
│ ⚙️ Ayarlar      │
└─────────────────┘
```

## 3. Dashboard Tasarımı

### Ana Dashboard Layout
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Toplam Müşteri  │ Aylık Satış     │ Açık Görevler   │
│ 2,847          │ ₺1,245,890     │ 23             │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────────────────┬───────────────┐
│ Satış Grafiği (Son 12 Ay)          │ Son Aktiviteler│
│                                     │               │
│ ████████████████████████████████    │ • Yeni müşteri│
│                                     │ • Fatura gönder│
│                                     │ • Görev tamamla│
└─────────────────────────────────────┴───────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Hızlı Erişim Butonları                                      │
│ [+ Yeni Müşteri] [+ Satış Fırsatı] [+ Görev] [+ Fatura]   │
└─────────────────────────────────────────────────────────────┘
```

### Kart Bileşeni Tasarımı
```css
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--primary-blue);
}

.card-title {
  font-size: var(--text-sm);
  color: var(--gray-600);
  font-weight: var(--font-medium);
}

.card-value {
  font-size: var(--text-2xl);
  color: var(--gray-900);
  font-weight: var(--font-bold);
  margin-top: 8px;
}
```

## 4. Müşteri Yönetimi Arayüzü

### Müşteri Listesi Sayfası
```
┌─────────────────────────────────────────────────────────────┐
│ Müşteriler                                    [+ Yeni Müşteri]│
├─────────────────────────────────────────────────────────────┤
│ [Arama: müşteri adı...] [Filtre ▼] [Dışa Aktar] [Görünüm ▼]│
├─────────────────────────────────────────────────────────────┤
│ ☑ Şirket Adı      | İletişim      | Segment  | Durum  | İşlem│
│ ☐ ABC Medikal     | ahmet@abc.com | Büyük    | Aktif  | ⋯   │
│ ☐ XYZ İlaç       | info@xyz.com  | Orta     | Aktif  | ⋯   │
│ ☐ DEF Sağlık     | can@def.com   | Küçük    | Pasif  | ⋯   │
└─────────────────────────────────────────────────────────────┘
```

### Müşteri Detay Sayfası
```
┌─────────────────────────────────────────────────────────────┐
│ ← Geri     ABC Medikal Şirketi                    [Düzenle] │
├─────────────────────────────────────────────────────────────┤
│ [Genel Bilgiler] [İletişim Geçmişi] [Satışlar] [Faturalar] │
├─────────────────────────────────────────────────────────────┤
│ Şirket Adı: ABC Medikal                                     │
│ İletişim: Ahmet Yılmaz (ahmet@abc.com)                     │
│ Telefon: +90 212 555 01 02                                 │
│ Adres: İstanbul, Türkiye                                   │
│ Segment: Büyük Müşteri                                     │
│ Kayıt Tarihi: 15.03.2024                                  │
│                                                            │
│ [+ Yeni İletişim] [+ Satış Fırsatı] [+ Görev Ata]        │
└─────────────────────────────────────────────────────────────┘
```

## 5. Form Tasarımları

### Standart Form Yapısı
```css
.form-container {
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
}

.form-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: 16px;
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: var(--text-base);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.1);
  outline: none;
}
```

### Yeni Müşteri Formu
```
┌─────────────────────────────────────────────────────────────┐
│ Yeni Müşteri Ekle                               [X Kapat]   │
├─────────────────────────────────────────────────────────────┤
│ Şirket Bilgileri                                           │
│ ┌─────────────────────┐ ┌─────────────────────┐           │
│ │ Şirket Adı *        │ │ İletişim Kişisi *   │           │
│ └─────────────────────┘ └─────────────────────┘           │
│                                                            │
│ ┌─────────────────────┐ ┌─────────────────────┐           │
│ │ E-posta *           │ │ Telefon             │           │
│ └─────────────────────┘ └─────────────────────┘           │
│                                                            │
│ İletişim Bilgileri                                         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Adres                                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌─────────────────────┐ ┌─────────────────────┐           │
│ │ Şehir               │ │ Ülke                │           │
│ └─────────────────────┘ └─────────────────────┘           │
│                                                            │
│ Segmentasyon                                               │
│ ┌─────────────────────┐ ┌─────────────────────┐           │
│ │ Müşteri Tipi ▼      │ │ Segment ▼           │           │
│ └─────────────────────┘ └─────────────────────┘           │
│                                                            │
│                          [İptal] [Kaydet]                 │
└─────────────────────────────────────────────────────────────┘
```

## 6. Tablo ve Liste Tasarımları

### Modern Tablo Stilü
```css
.data-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-header {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.table-header th {
  padding: 16px 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  text-align: left;
}

.table-row {
  border-bottom: 1px solid var(--gray-100);
  transition: background-color 0.2s;
}

.table-row:hover {
  background: var(--gray-50);
}

.table-cell {
  padding: 16px 20px;
  font-size: var(--text-sm);
  color: var(--gray-900);
}
```

## 7. Buton Tasarımları

### Buton Türleri
```css
/* Ana Buton */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1565C0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.4);
}

/* İkincil Buton */
.btn-secondary {
  background: white;
  color: var(--primary-blue);
  border: 1px solid var(--primary-blue);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
}

/* Tehlike Butonu */
.btn-danger {
  background: var(--error);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: var(--font-medium);
}

/* Küçük Buton */
.btn-sm {
  padding: 8px 16px;
  font-size: var(--text-sm);
}

/* İkon Butonları */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--gray-100);
  cursor: pointer;
  transition: all 0.2s;
}
```

## 8. Modal ve Popup Tasarımları

### Modal Yapısı
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 24px 32px;
}

.modal-footer {
  padding: 0 32px 32px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

## 9. Responsive Tasarım

### Breakpoint'ler
```css
/* Mobil */
@media (max-width: 640px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 50;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .data-table {
    overflow-x: auto;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }
  
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .stat-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Mobil Navigasyon
```
┌─────────────────────────────────┐
│ ☰ CRM Dashboard    🔍 👤      │  <- Header
├─────────────────────────────────┤
│                                 │
│ Main Content Area               │
│                                 │
│ (Sidebar çekilir menü olarak)   │
│                                 │
└─────────────────────────────────┘
```

## 10. Durum Göstergeleri (Status Indicators)

### Renk Kodlaması
```css
/* Durum Badge'leri */
.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-active {
  background: #E8F5E8;
  color: #2E7D2E;
}

.status-inactive {
  background: #FFF3E0;
  color: #F57F17;
}

.status-pending {
  background: #E3F2FD;
  color: #1565C0;
}

.status-completed {
  background: #E8F5E8;
  color: #2E7D2E;
}

.status-overdue {
  background: #FFEBEE;
  color: #C62828;
}
```

## 11. Loading ve Feedback States

### Loading Spinner
```css
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-200);
  border-top: 2px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Toast Bildirimler
```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.toast-success {
  background: var(--success);
  color: white;
}

.toast-error {
  background: var(--error);
  color: white;
}
```

Bu UI/UX tasarım dokümanı, CRM sisteminin tüm görsel bileşenlerinin tutarlı ve kullanıcı dostu olmasını sağlayacak detaylı bir rehber içermektedir.