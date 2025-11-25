# Blabmarket CRM Sistem Akış Diyagramı

## Ana Sistem Akışı

```mermaid
graph TD
    A[Kullanıcı Girişi] --> B{Kimlik Doğrulama}
    B -->|Başarılı| C[Rol Belirleme]
    B -->|Başarısız| A
    
    C --> D{Kullanıcı Rolü}
    D -->|Admin| E[Admin Dashboard]
    D -->|Satış Ekibi| F[Satış Dashboard]
    D -->|İthalat/İhracat| G[İthalat/İhracat Dashboard]
    D -->|Finans| H[Finans Dashboard]
    D -->|Destek| I[Destek Dashboard]
    
    E --> J[Tüm Modüller Erişimi]
    F --> K[Müşteri & Satış Modülleri]
    G --> L[Ürün & Tedarikçi Modülleri]
    H --> M[Finans & Fatura Modülleri]
    I --> N[Müşteri Destek Modülleri]
```

## CRM Modülleri İlişki Diyagramı

```mermaid
graph LR
    A[Müşteri Yönetimi] --> B[Satış Yönetimi]
    B --> C[Fatura Yönetimi]
    C --> D[Finans Takibi]
    
    E[Ürün Yönetimi] --> B
    E --> F[Stok Yönetimi]
    F --> G[Satın Alma]
    G --> H[Tedarikçi Yönetimi]
    
    B --> I[Görev Yönetimi]
    A --> I
    I --> J[İş Akışları]
    J --> K[Otomasyon]
    
    A --> L[Raporlama]
    B --> L
    C --> L
    E --> L
    F --> L
    G --> L
```

## Müşteri Yaşam Döngüsü

```mermaid
sequenceDiagram
    participant S as Satış Temsilcisi
    participant CRM as CRM Sistemi
    participant C as Müşteri
    participant F as Finans
    
    S->>CRM: Potansiyel müşteri kaydı
    CRM->>S: Müşteri ID oluştur
    S->>CRM: İletişim geçmişi kaydet
    S->>CRM: Satış fırsatı oluştur
    CRM->>S: Görev ataması yap
    S->>C: Teklif sunumu
    C->>S: Teklif onayı
    S->>CRM: Satış tamamlandı işaretle
    CRM->>F: Fatura oluşturma bildirimi
    F->>CRM: Fatura kaydet
    F->>C: Fatura gönder
    C->>F: Ödeme yap
    F->>CRM: Ödeme kaydı güncelle
```

## İş Akışı Otomasyon Örnekleri

### Satış Fırsatı Takibi

```mermaid
flowchart TD
    A[Yeni Satış Fırsatı] --> B{Son İletişim > 7 gün?}
    B -->|Evet| C[Otomatik E-posta Gönder]
    B -->|Hayır| D[Bekle]
    C --> E[Görev Ataması Oluştur]
    E --> F[Satış Temsilcisine Bildirim]
    D --> G{Son İletişim > 14 gün?}
    G -->|Evet| H[Yöneticiye Escalation]
    G -->|Hayır| D
```

### Stok Uyarı Sistemi

```mermaid
flowchart TD
    A[Günlük Stok Kontrolü] --> B{Stok < Minimum Seviye?}
    B -->|Evet| C[Satın Alma Ekibine Bildirim]
    B -->|Hayır| D[Devam Et]
    C --> E[Otomatik Satın Alma Önerisi]
    E --> F[Tedarikçi İletişimi]
```

## Veritabanı İlişki Diyagramı

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email
        varchar password_hash
        varchar first_name
        varchar last_name
        int role_id FK
        boolean is_active
        timestamp created_at
    }
    
    ROLES {
        int id PK
        varchar name
        jsonb permissions
        timestamp created_at
    }
    
    CUSTOMERS {
        uuid id PK
        varchar company_name
        varchar contact_person
        varchar email
        varchar phone
        text address
        varchar customer_type
        varchar segment
        uuid created_by FK
        timestamp created_at
    }
    
    PRODUCTS {
        uuid id PK
        varchar name
        varchar sku
        uuid category_id FK
        text description
        decimal unit_price
        int stock_quantity
        boolean is_medical
        timestamp created_at
    }
    
    SALES_OPPORTUNITIES {
        uuid id PK
        uuid customer_id FK
        varchar title
        text description
        decimal estimated_value
        int probability
        varchar status
        uuid assigned_to FK
        date expected_close_date
        timestamp created_at
    }
    
    INVOICES {
        uuid id PK
        uuid customer_id FK
        varchar invoice_number
        decimal total_amount
        decimal tax_amount
        varchar status
        date due_date
        date paid_date
        uuid created_by FK
        timestamp created_at
    }
    
    TASKS {
        uuid id PK
        varchar title
        text description
        uuid assigned_to FK
        uuid assigned_by FK
        varchar priority
        varchar status
        date due_date
        timestamp created_at
    }
    
    USERS ||--|| ROLES : has
    CUSTOMERS ||--o{ SALES_OPPORTUNITIES : has
    CUSTOMERS ||--o{ INVOICES : receives
    USERS ||--o{ SALES_OPPORTUNITIES : manages
    USERS ||--o{ TASKS : assigned
    USERS ||--o{ CUSTOMERS : created_by
    USERS ||--o{ INVOICES : created_by
```

## API İstek Akış Örnekleri

### Müşteri Oluşturma İşlemi

```mermaid
sequenceDiagram
    participant U as Frontend User
    participant F as React Frontend
    participant A as Express API
    participant D as PostgreSQL
    participant R as Redux Store
    
    U->>F: Müşteri formu doldur
    F->>F: Form validation (Yup)
    F->>A: POST /api/customers
    A->>A: JWT token doğrulama
    A->>A: Yetki kontrolü
    A->>D: INSERT customer query
    D->>A: Customer ID return
    A->>F: Success response
    F->>R: Update customers state
    R->>F: Re-render customer list
    F->>U: Success message display
```

### Satış Raporu Oluşturma

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    participant E as Email Service
    
    U->>F: Rapor parametreleri seç
    F->>A: POST /api/reports/sales-summary
    A->>D: Complex sales query
    D->>A: Aggregated data
    A->>A: Chart data formatting
    A->>F: JSON response
    F->>F: Chart rendering (Chart.js)
    F->>U: Visual rapor göster
    
    alt Email raporu istenirse
        U->>F: Email gönder butonuna tıkla
        F->>A: POST /api/reports/email
        A->>E: PDF oluştur ve email gönder
        E->>U: Email bildirimi
    end
```

## Güvenlik Akış Diyagramı

```mermaid
graph TD
    A[API İsteği] --> B{JWT Token Var mı?}
    B -->|Hayır| C[401 Unauthorized]
    B -->|Evet| D{Token Geçerli mi?}
    D -->|Hayır| E[401 Token Expired]
    D -->|Evet| F{Kullanıcı Aktif mi?}
    F -->|Hayır| G[403 User Inactive]
    F -->|Evet| H{Yetki Kontrolü}
    H -->|Yetkisiz| I[403 Insufficient Permissions]
    H -->|Yetkili| J[İşlem Devam Eder]
    
    E --> K[Refresh Token Kullan]
    K --> L{Refresh Token Geçerli?}
    L -->|Evet| M[Yeni Access Token]
    L -->|Hayır| N[Yeniden Giriş İste]
```

Bu diyagramlar sistemin tüm akışlarını ve modüller arası ilişkileri net bir şekilde göstermektedir. Geliştirme süreci boyunca bu akışlara uygun şekilde kod yazılacaktır.