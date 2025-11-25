# 📚 Blabmarket CRM - Kullanıcı Rehberi

Bu rehber, Blabmarket CRM sisteminin tüm özelliklerini detaylı olarak açıklar ve farklı kullanıcı rolleri için adım adım kılavuzlar sunar.

---

## 🎯 İçindekiler

- [🚀 Hızlı Başlangıç](#-hızlı-başlangıç)
- [👥 Kullanıcı Rolleri ve Yetkiler](#-kullanıcı-rolleri-ve-yetkiler)
- [🏠 Dashboard Kullanımı](#-dashboard-kullanımı)
- [📱 Modül Rehberleri](#-modül-rehberleri)
- [⚙️ Sistem Ayarları](#️-sistem-ayarları)
- [🔍 Arama ve Filtreleme](#-arama-ve-filtreleme)
- [📊 Raporlama](#-raporlama)
- [💡 İpuçları ve Püf Noktaları](#-i̇puçları-ve-püf-noktaları)

---

## 🚀 Hızlı Başlangıç

### 1️⃣ Sisteme Giriş

1. **Web tarayıcınızda** `http://localhost:3000` adresine gidin
2. **Giriş sayfasında** demo kullanıcı bilgilerinizi girin
3. **"Giriş Yap"** butonuna tıklayın
4. **Dashboard** sayfasına yönlendirileceksiniz

### 2️⃣ İlk Adımlar

**Yeni kullanıcılar için önerilen sıra:**
- 📊 Dashboard'u inceleyin
- 👥 Müşteri listesini gözden geçirin  
- 📦 Ürün kataloğunu keşfedin
- 💰 Satış fırsatlarını görüntüleyin
- ⚙️ Profil ayarlarınızı güncelleyin

---

## 👥 Kullanıcı Rolleri ve Yetkiler

### 🔐 **YÖNETİCİ (Admin)**
**E-posta:** admin@blabmarket.com **Şifre:** admin123

#### ✅ Erişim Yetkileri:
- Tüm modüllere **tam erişim**
- Kullanıcı hesapları **oluşturma/düzenleme**
- Sistem ayarları **yönetimi**
- Tüm verilere **okuma/yazma** yetkisi
- Gelişmiş raporlama **araçları**

#### 📋 Ana Görevler:
- Sistem kullanıcılarını yönet
- Genel sistem ayarlarını yapılandır
- Tüm departmanları koordine et
- Stratejik raporları hazırla

---

### 💼 **SATIŞ EKİBİ**
**E-posta:** sales@blabmarket.com **Şifre:** sales123

#### ✅ Erişim Yetkileri:
- **Müşteri Yönetimi** - Tam erişim
- **Satış Yönetimi** - Tam erişim
- **Ürün Kataloğu** - Sadece görüntüleme
- **Temel Raporlar** - Sadece görüntüleme
- **Görev Yönetimi** - Kendi görevleri

#### 📋 Ana Görevler:
- Yeni müşteri kayıtları oluştur
- Satış fırsatlarını takip et
- Müşteri etkileşimlerini kaydet
- Satış teklifleri hazırla
- Pipeline'ı güncel tut

#### 🛠️ Kullanım Adımları:

**Yeni Müşteri Ekleme:**
```
1. Sol menüden "Müşteriler" seçin
2. "Yeni Müşteri" butonuna tıklayın
3. Zorunlu alanları doldurun:
   - Şirket Adı
   - İletişim Kişisi
   - E-posta
   - Telefon
   - Şehir
4. Müşteri türünü seçin
5. "Kaydet" butonuna tıklayın
```

**Satış Fırsatı Oluşturma:**
```
1. "Satış" menüsünden "Yeni Fırsat" seçin
2. Müşteriyi seçin
3. Ürünleri ekleyin
4. Tahmini tutarı girin
5. Kapanış tarihini belirleyin
6. Durum ve önceliği ayarlayın
7. Kaydedin
```

---

### 💰 **FİNANS EKİBİ**
**E-posta:** finance@blabmarket.com **Şifre:** finance123

#### ✅ Erişim Yetkileri:
- **Finans Modülü** - Tam erişim
- **Fatura Yönetimi** - Tam erişim
- **Mali Raporlar** - Tam erişim
- **Müşteri Bilgileri** - Sınırlı erişim
- **Ödeme Takibi** - Tam erişim

#### 📋 Ana Görevler:
- Fatura oluşturma ve yönetimi
- Ödeme durumlarını takip etme
- Mali raporları hazırlama
- Bütçe analizleri yapma
- Müşteri kredibilitesi değerlendirme

#### 🛠️ Kullanım Adımları:

**Fatura Oluşturma:**
```
1. "Finans" menüsünden "Yeni Fatura" seçin
2. Müşteriyi seçin
3. Fatura detaylarını girin:
   - Fatura numarası (otomatik)
   - Fatura tarihi
   - Vade tarihi
4. Ürün/hizmet kalemlerini ekleyin
5. Vergi hesaplamalarını kontrol edin
6. Faturayı kaydedin
7. PDF olarak indirin/gönderin
```

**Ödeme Takibi:**
```
1. "Finans" → "Ödemeler" sayfasına gidin
2. Ödeme durumunu filtreleyin
3. Vadesi yaklaşan faturaları görün
4. Ödeme alındığında durumu güncelleyin
5. Gecikme raporlarını inceleyin
```

---

### 🌍 **İTHALAT/İHRACAT EKİBİ**
**E-posta:** import@blabmarket.com **Şifre:** import123

#### ✅ Erişim Yetkileri:
- **Ürün Yönetimi** - Tam erişim
- **Stok Takibi** - Tam erişim
- **Tedarikçi Yönetimi** - Tam erişim
- **Satın Alma** - Tam erişim
- **İthalat/İhracat İşlemleri** - Tam erişim

#### 📋 Ana Görevler:
- Yeni ürün kayıtları oluşturma
- Stok seviyelerini izleme
- Tedarikçi ilişkileri yönetme
- Satın alma siparişleri verme
- İthalat/ihracat süreçlerini koordine etme

#### 🛠️ Kullanım Adımları:

**Yeni Ürün Ekleme:**
```
1. "Ürünler" menüsünden "Yeni Ürün" seçin
2. Ürün bilgilerini girin:
   - Ürün adı
   - Ürün kodu (sistem otomatik verebilir)
   - Kategori
   - Birim
   - Alış fiyatı
   - Satış fiyatı
3. Stok bilgilerini girin
4. Tedarikçi bilgisini ekleyin
5. Ürün fotoğraflarını yükleyin
6. Kaydedin
```

**Stok Takibi:**
```
1. "Ürünler" → "Stok Durumu" sayfasına gidin
2. Düşük stok uyarılarını kontrol edin
3. Kritik seviyedeki ürünleri not edin
4. Yeniden sipariş gerekenleri belirleyin
5. Satın alma sürecini başlatın
```

---

### 🎧 **DESTEK EKİBİ**
**E-posta:** support@blabmarket.com **Şifre:** support123

#### ✅ Erişim Yetkileri:
- **Müşteri Bilgileri** - Sınırlı erişim
- **Görev Yönetimi** - Tam erişim
- **Destek Talepleri** - Tam erişim
- **Temel Raporlar** - Sadece görüntüleme

#### 📋 Ana Görevler:
- Müşteri şikayetlerini kaydetme
- Destek taleplerini yönetme
- Teknik problemleri çözme
- Müşteri memnuniyetini takip etme

#### 🛠️ Kullanım Adımları:

**Destek Talebi Oluşturma:**
```
1. "Görevler" menüsünden "Yeni Görev" seçin
2. Görev türünü "Destek Talebi" seçin
3. Müşteriyi belirleyin
4. Problem tanımını detaylı yazın
5. Öncelik seviyesini belirleyin
6. Kendine veya ekip üyesine ata
7. Kaydedin ve takip edin
```

---

## 🏠 Dashboard Kullanımı

### 📊 Widget Türleri

**Her kullanıcı rolü için özelleştirilmiş widget'lar:**

#### 1️⃣ **KPI Kartları**
- Toplam müşteri sayısı
- Aylık satış hedefi
- Aktif fırsatlar
- Bekleyen ödemeler

#### 2️⃣ **Grafikler**
- Satış trend analizi
- Müşteri büyüme oranı
- Ürün kategorisi dağılımı
- Gelir projeksiyonları

#### 3️⃣ **Görev Listesi**
- Bugün yapılacaklar
- Yaklaşan deadlinelar
- Atanan görevler
- Tamamlama oranı

#### 4️⃣ **Hızlı Erişim**
- Son eklenen müşteriler
- Son satış fırsatları
- Kritik stok seviyeleri
- Bekleyen onaylar

### ⚙️ Widget Özelleştirme

```
1. Dashboard'da sağ üst köşedeki "⚙️" simgesine tıklayın
2. "Widget Ayarları" seçin
3. Görmek istediğiniz widget'ları seçin
4. Sürükle-bırak ile sıralamayı değiştirin
5. "Kaydet" butonuna tıklayın
```

---

## 📱 Modül Rehberleri

### 👥 Müşteri Yönetimi Detaylı Rehberi

#### ✅ Müşteri Profili Oluşturma

**Zorunlu Alanlar:**
- Şirket/Kişi Adı
- E-posta Adresi  
- Telefon Numarası
- Şehir/Konum

**Opsiyonel Alanlar:**
- Web sitesi
- Vergi numarası
- Sektör bilgisi
- Not alanı

#### 📞 Etkileşim Geçmişi

**Etkileşim türleri:**
- **Telefon Araması** - Arama detayları ve notlar
- **E-posta** - Gönderilen/alınan e-postalar
- **Toplantı** - Yüz yüze veya online toplantılar
- **Demo** - Ürün demonstrasyonları
- **Destek** - Teknik destek talepleri

**Etkileşim ekleme:**
```
1. Müşteri detay sayfasında "Etkileşim Ekle" butonuna tıklayın
2. Etkileşim türünü seçin
3. Tarih ve saati belirleyin
4. Katılımcıları ekleyin
5. Detayları yazın
6. Kaydedin
```

#### 🏷️ Müşteri Segmentasyonu

**Otomatik Segmentler:**
- **VIP Müşteriler** - Yüksek değerli müşteriler
- **Aktif Müşteriler** - Son 30 günde etkileşim
- **Potansiyel Müşteriler** - Henüz satış yapılmamış
- **Risk Altındaki Müşteriler** - Uzun süredir pasif

**Manuel Etiketleme:**
```
1. Müşteri sayfasında "Etiketler" bölümünü bulun
2. "+" butonuna tıklayın
3. Mevcut etiketlerden seçin veya yeni oluşturun
4. Renk ve açıklama ekleyin
5. Kaydedin
```

---

### 📦 Ürün ve Stok Yönetimi

#### 📋 Ürün Kategorileri

**Tıbbi Ekipman Kategorileri:**
- **Görüntüleme Sistemleri** (MR, CT, Ultrason)
- **Laboratuvar Ekipmanları** (Analizörler, Mikroskoplar)
- **Cerrahi Aletler** (Ameliyathane ekipmanları)
- **Hasta Bakım** (Hasta yatakları, monitörler)
- **Sarf Malzemeleri** (Eldiven, maske, enjektör)

#### 📊 Stok Yönetimi

**Stok Seviye Tanımları:**
- **Kritik Seviye** - Acil sipariş gerekli (Kırmızı)
- **Düşük Seviye** - Yakında sipariş gerekebilir (Sarı)  
- **Normal Seviye** - Yeterli stok mevcut (Yeşil)
- **Fazla Seviye** - Fazla stok var (Mavi)

**Stok Hareket Türleri:**
- **Giriş** - Satın alma, üretim, devir
- **Çıkış** - Satış, fire, devir
- **Sayım Düzeltmesi** - Fiziki sayım farklılıkları

#### 🔔 Otomatik Uyarılar

**Sistem otomatik uyarı gönderir:**
- Stok kritik seviyeye düştüğünde
- Son kullanma tarihi yaklaştığında
- Fazla stok biriktiğinde
- Hareket olmayan ürünler için

---

### 💰 Satış Yönetimi

#### 🎯 Satış Pipeline Aşamaları

**Standart Pipeline:**
1. **Potansiyel** - İlk temas kuruldu
2. **Kalifiye** - İhtiyaç belirlendi  
3. **Teklif** - Resmi teklif sunuldu
4. **Müzakere** - Fiyat/şartlar görüşülüyor
5. **Kapanış** - Sözleşme imzalandı
6. **Kaybedildi** - Fırsat kaybedildi

#### 📈 Fırsat Yönetimi

**Fırsat değerlendirme kriterleri:**
- **Bütçe** - Müşterinin bütçesi var mı?
- **Yetki** - Karar verici ile temasta mı?
- **İhtiyaç** - Gerçek bir ihtiyaç var mı?  
- **Zaman** - Satın alma zamanlaması uygun mu?

#### 🎯 Satış Hedefleri

**Hedef türleri:**
- **Aylık Satış Hedefi** - Para birimi bazında
- **Müşteri Sayısı Hedefi** - Yeni müşteri kazanma
- **Ürün Mix Hedefi** - Belirli ürün kategorileri
- **Aktivite Hedefi** - Arama, toplantı sayıları

---

### 🏭 Tedarikçi ve Satın Alma

#### 🤝 Tedarikçi Değerlendirme

**Değerlendirme kriterleri:**
- **Kalite** - Ürün/hizmet kalitesi (1-5 puan)
- **Teslimat** - Zamanında teslimat oranı
- **Fiyat** - Rekabetçi fiyat seviyesi
- **İletişim** - İletişim kalitesi ve hızı
- **Esneklik** - Özel taleplere uyum

#### 📋 Satın Alma Süreci

**Adım adım süreç:**
```
1. İhtiyaç Belirleme
   - Stok seviyeleri kontrol edilir
   - İhtiyaç listesi hazırlanır

2. Tedarikçi Karşılaştırması  
   - En az 3 tedarikçiden fiyat alınır
   - Kalite ve teslimat süreleri karşılaştırılır

3. Sipariş Oluşturma
   - En uygun tedarikçi seçilir
   - Sipariş formu hazırlanır
   - Onay sürecine gönderilir

4. Takip ve Teslimat
   - Sipariş durumu takip edilir
   - Teslimat kontrolü yapılır
   - Fatura mutabakatı yapılır

5. Değerlendirme
   - Tedarikçi performansı değerlendirilir
   - Sorunlar kayıt altına alınır
```

---

### 💳 Finans Yönetimi

#### 📄 Fatura İşlemleri

**Fatura türleri:**
- **Satış Faturası** - Müşteriye kesilir
- **Satın Alma Faturası** - Tedarikçiden gelir
- **İade Faturası** - İade işlemleri için
- **Düzeltme Faturası** - Hata düzeltmeleri

#### 💰 Ödeme Takibi

**Ödeme durumları:**
- **Ödenmemiş** - Henüz ödeme yapılmamış
- **Kısmi Ödenmemiş** - Kısmen ödenmiş
- **Ödenmiş** - Tam ödenmiş
- **Vadesi Geçmiş** - Vade geçmiş, ödenmemiş

#### 📊 Mali Raporlar

**Hazır raporlar:**
- **Gelir-Gider Raporu** - Dönemlik P&L
- **Müşteri Yaşlandırma** - Alacak yaşlandırma
- **Tedarikçi Yaşlandırma** - Borç yaşlandırma
- **Nakit Akış** - Nakit giriş-çıkış projeksiyonu

---

## ⚙️ Sistem Ayarları

### 👤 Profil Ayarları

**Güncelleyebileceğiniz bilgiler:**
- Ad Soyad
- E-posta adresi
- Telefon numarası
- Şifre değişikliği
- Profil fotoğrafı
- Bildirim tercihleri

### 🔔 Bildirim Ayarları

**Bildirim türleri:**
- **E-posta Bildirimleri**
  - Yeni görev atamaları
  - Deadline yaklaşanlar
  - Sistem güncellemeleri

- **Tarayıcı Bildirimleri**
  - Anlık mesajlar
  - Önemli uyarılar
  - Sistem durumu

- **SMS Bildirimleri** (Opsiyonel)
  - Kritik uyarılar
  - Güvenlik bildirimleri

---

## 🔍 Arama ve Filtreleme

### 🔎 Global Arama

**Arama kapsamı:**
- Tüm müşteri kayıtları
- Ürün kataloğu
- Satış fırsatları  
- Faturalar ve ödemeler
- Görevler ve notlar

**Arama ipuçları:**
```
- "Ahmet Yılmaz" → İsim ile arama
- "05555555555" → Telefon numarası
- "MR cihazı" → Ürün adı
- "@hastane" → E-posta domain
- "#vip" → Etiket arama
```

### 🏷️ Gelişmiş Filtreleme

**Müşteri filtreleri:**
- Şehir/Bölge
- Müşteri türü
- Son etkileşim tarihi
- Toplam satış tutarı
- Etiketler

**Ürün filtreleri:**
- Kategori
- Fiyat aralığı
- Stok durumu  
- Tedarikçi
- Son güncelleme tarihi

**Satış filtreleri:**
- Pipeline aşaması
- Satış temsilcisi
- Tutar aralığı
- Kapanış tarihi
- Öncelik seviyesi

---

## 📊 Raporlama

### 📈 Standart Raporlar

#### 💼 Satış Raporları
- **Satış Performansı** - Dönemlik satış analizi
- **Pipeline Raporu** - Aktif fırsatlar durumu
- **Satış Temsilcisi Performansı** - Kişisel performans
- **Ürün Satış Analizi** - En çok satan ürünler

#### 👥 Müşteri Raporları  
- **Müşteri Analizi** - Müşteri segmentasyonu
- **Müşteri Yaşam Döngüsü** - LTV analizi
- **Etkileşim Raporu** - İletişim geçmişi
- **Memnuniyet Analizi** - Geri bildirim raporu

#### 💰 Finans Raporları
- **Gelir-Gider** - P&L raporu
- **Nakit Akış** - Cash flow projeksiyonu  
- **Alacak-Borç** - Yaşlandırma raporları
- **Karlılık Analizi** - Ürün/müşteri karlılığı

### 🎨 Özel Rapor Oluşturma

**Rapor oluşturma adımları:**
```
1. Raporlar menüsünden "Özel Rapor" seçin
2. Veri kaynağını seçin (Müşteri, Satış, vs.)
3. Görüntülenecek alanları seçin
4. Filtre kriterlerini belirleyin
5. Sıralama seçeneklerini ayarlayın
6. Grafik türünü seçin (varsa)
7. "Rapor Oluştur" butonuna tıklayın
8. PDF/Excel olarak export edin
```

### 📧 Otomatik Rapor Gönderimi

**Raporları otomatik gönderme:**
```
1. Hazırladığınız raporda "Otomatik Gönderim" seçin
2. Gönderim sıklığını belirleyin:
   - Günlük
   - Haftalık  
   - Aylık
   - Çeyreklik
3. Alıcıları ekleyin
4. Gönderim zamanını seçin
5. Aktif hale getirin
```

---

## 💡 İpuçları ve Püf Noktaları

### ⌨️ Klavye Kısayolları

**Genel Kısayollar:**
- `Ctrl + K` → Global arama açar
- `Ctrl + N` → Yeni kayıt oluşturur
- `Ctrl + S` → Mevcut formu kaydeder
- `Ctrl + E` → Düzenleme moduna geçer
- `Esc` → Modal/popup'ları kapatır

**Navigasyon:**
- `Alt + 1` → Dashboard
- `Alt + 2` → Müşteriler  
- `Alt + 3` → Ürünler
- `Alt + 4` → Satış
- `Alt + 5` → Finans

### 🎯 Verimlilik İpuçları

#### ✅ Günlük Rutin Önerileri

**Sabah Rutini (9:00-9:30):**
```
1. Dashboard'u kontrol edin
2. Bugünkü görev listesini gözden geçirin  
3. Kritik bildirimleri okuyun
4. Öncelikli müşteri follow-up'larını not edin
```

**Öğlen Kontrolü (12:00-12:15):**
```
1. Sabah yapılan işleri işaretleyin
2. Bekleyen onayları kontrol edin
3. Yeni gelen talepleri değerlendirin
4. Öğleden sonra planını güncelleyin
```

**Akşam Rutini (17:30-18:00):**
```
1. Günün tamamlanan işlerini kaydedin
2. Yarına kalan görevleri not edin
3. Önemli etkileşimleri müşteri kayıtlarına ekleyin
4. Raporları güncelleyin
```

#### 🔄 Otomasyon İpuçları

**E-posta Şablonları:**
- Sık kullanılan e-posta metinlerini şablon olarak kaydedin
- Müşteri segmentine göre farklı şablonlar hazırlayın
- Kişiselleştirme değişkenlerini kullanın

**Görev Otomasyonu:**
- Tekrarlayan görevler için otomatik hatırlatmalar kurun
- Pipeline aşama geçişlerinde otomatik görev atamaları yapın
- Deadline yaklaşan işler için e-posta bildirimleri aktif edin

#### 📱 Mobil Kullanım İpuçları

**Mobil Cihazlarda:**
- Alt navigasyon menüsünü kullanın
- Swipe hareketleri ile hızlı navigasyon yapın
- Önemli bilgileri offline görüntüleme için favorilere ekleyin
- Konum servisleri ile müşteri ziyaretlerini otomatik kaydedin

### ⚠️ Yaygın Hatalar ve Çözümleri

#### ❌ "Veri Kaydedilemedi" Hatası
**Çözüm:**
```
1. İnternet bağlantınızı kontrol edin
2. Zorunlu alanların dolu olduğunu kontrol edin  
3. Sayfa yenileyin ve tekrar deneyin
4. Sorun devam ederse destek ekibine başvurun
```

#### ❌ "Erişim Reddedildi" Hatası
**Çözüm:**
```
1. Kullanıcı rolünüzün yetkileri kontrol edin
2. Session süreniz dolmuş olabilir - tekrar giriş yapın
3. Yöneticinizden ek yetki talep edin
```

#### ❌ Slow Loading / Yavaş Yükleme
**Çözüm:**
```
1. Tarayıcı cache'ini temizleyin
2. Gereksiz browser tab'larını kapatın
3. Büyük rapor ve listelerde sayfalama kullanın
4. Filtreleri dar tutun
```

### 🛡️ Güvenlik İpuçları

**Şifre Güvenliği:**
- Güçlü şifreler kullanın (min. 8 karakter)
- Düzenli olarak şifrenizi değiştirin
- Şifrenizi kimseyle paylaşmayın
- Güvenli olmayan ağlarda sisteme giriş yapmayın

**Veri Güvenliği:**
- Müşteri bilgilerini yetkisiz kişilerle paylaşmayın
- Ekranınızı başkaları göremeyecek şekilde konumlandırın  
- İş bitiminde mutlaka çıkış yapın
- Şüpheli aktiviteleri hemen bildirin

---

## 📞 Destek ve Yardım

### 🆘 Teknik Destek

**Destek kanalları:**
- 📧 **E-posta:** support@blabmarket.com
- 📞 **Telefon:** +90 XXX XXX XX XX  
- 💬 **Canlı Destek:** Sistem içi mesajlaşma
- 🎓 **Eğitim Talebi:** Birebir eğitim seansları

**Destek saatleri:**
- **Hafta içi:** 09:00 - 18:00
- **Hafta sonu:** 10:00 - 16:00 (Acil durumlar)
- **7/24 Kritik Destek:** Önemli sistem arızaları

### 📚 Ek Kaynaklar

- 📹 **Video Eğitimleri:** Sistem tanıtım videoları
- 📋 **PDF Kılavuzlar:** Detaylı kullanım kılavuzları
- ❓ **SSS:** Sık sorulan sorular
- 🎯 **Best Practices:** En iyi uygulama örnekleri

---

**✨ Bu rehber sürekli güncellenmektedir. Önerilerinizi support@blabmarket.com adresine gönderebilirsiniz.**

*Son güncelleme: 2025-09-24*