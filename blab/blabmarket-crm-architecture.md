# Blabmarket CRM Demo Sistemi - Teknik Mimari Dokümanı

## 1. Sistem Genel Bakış

### Teknoloji Stack'i
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript  
- **Veritabanı**: PostgreSQL 15+
- **Kimlik Doğrulama**: JWT + bcrypt
- **API Dokümantasyonu**: Swagger/OpenAPI
- **State Yönetimi**: Redux Toolkit + RTK Query
- **Form Yönetimi**: React Hook Form + Yup validation
- **Test Framework**: Jest + React Testing Library
- **Build Tools**: Vite (Frontend), NodeJS/npm (Backend)

### Mimari Yaklaşım
Mikroservis benzeri modüler monolit yapı ile başlayıp, gerektiğinde mikroservislere geçiş yapılabilir.

## 2. Proje Yapısı

```
blabmarket-crm/
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # Genel UI bileşenleri
│   │   ├── modules/            # CRM modülleri
│   │   │   ├── customers/      # Müşteri yönetimi
│   │   │   ├── products/       # Ürün yönetimi
│   │   │   ├── sales/          # Satış yönetimi
│   │   │   ├── procurement/    # Satın alma yönetimi
│   │   │   ├── finance/        # Finans yönetimi
│   │   │   ├── tasks/          # Görev yönetimi
│   │   │   ├── reports/        # Raporlama
│   │   │   └── auth/           # Kimlik doğrulama
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── types/              # TypeScript tipleri
│   │   ├── store/              # Redux store
│   │   └── assets/             # Statik dosyalar
│   ├── public/
│   └── package.json
├── backend/                     # Node.js Backend
│   ├── src/
│   │   ├── controllers/        # API kontrolleri
│   │   ├── models/             # Veritabanı modelleri
│   │   ├── routes/             # API rotaları
│   │   ├── middleware/         # Ara yazılımlar
│   │   ├── services/           # İş mantığı servisleri
│   │   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── config/             # Konfigürasyon
│   │   └── migrations/         # Veritabanı migrasyonları
│   └── package.json
├── database/                    # Veritabanı şemaları ve seed'ler
│   ├── schema.sql
│   └── mock-data/
├── docs/                        # Dokümantasyon
└── README.md
```

## 3. Veritabanı Şeması

### Temel Tablolar

#### users
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
first_name (VARCHAR)
last_name (VARCHAR)
role_id (INT, FK)
is_active (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### roles
```sql
id (INT, PK)
name (VARCHAR) -- admin, sales_team, import_export_team, finance_team, support_team
permissions (JSONB) -- Yetki tanımları
created_at (TIMESTAMP)
```

#### customers
```sql
id (UUID, PK)
company_name (VARCHAR)
contact_person (VARCHAR)
email (VARCHAR)
phone (VARCHAR)
address (TEXT)
city (VARCHAR)
country (VARCHAR)
customer_type (VARCHAR) -- prospect, active, inactive
segment (VARCHAR) -- small, medium, large
created_by (UUID, FK)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### products
```sql
id (UUID, PK)
name (VARCHAR)
sku (VARCHAR, UNIQUE)
category_id (UUID, FK)
description (TEXT)
unit_price (DECIMAL)
stock_quantity (INT)
minimum_stock_level (INT)
is_medical (BOOLEAN)
requires_import_license (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### sales_opportunities
```sql
id (UUID, PK)
customer_id (UUID, FK)
title (VARCHAR)
description (TEXT)
estimated_value (DECIMAL)
probability (INT) -- 0-100
status (VARCHAR) -- prospect, qualified, proposal, negotiation, won, lost
assigned_to (UUID, FK)
expected_close_date (DATE)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### invoices
```sql
id (UUID, PK)
customer_id (UUID, FK)
invoice_number (VARCHAR, UNIQUE)
total_amount (DECIMAL)
tax_amount (DECIMAL)
status (VARCHAR) -- draft, sent, paid, overdue, cancelled
due_date (DATE)
paid_date (DATE)
created_by (UUID, FK)
created_at (TIMESTAMP)
```

#### tasks
```sql
id (UUID, PK)
title (VARCHAR)
description (TEXT)
assigned_to (UUID, FK)
assigned_by (UUID, FK)
priority (VARCHAR) -- low, medium, high, urgent
status (VARCHAR) -- todo, in_progress, completed, cancelled
due_date (DATE)
completed_at (TIMESTAMP)
created_at (TIMESTAMP)
```

## 4. API Yapısı

### REST API Endpoints

#### Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
GET /api/auth/me
```

#### Customers
```
GET /api/customers
POST /api/customers
GET /api/customers/:id
PUT /api/customers/:id
DELETE /api/customers/:id
GET /api/customers/:id/interactions
POST /api/customers/:id/feedback
```

#### Products
```
GET /api/products
POST /api/products
GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id
GET /api/products/low-stock
POST /api/products/:id/stock-adjustment
```

#### Sales
```
GET /api/sales/opportunities
POST /api/sales/opportunities
GET /api/sales/opportunities/:id
PUT /api/sales/opportunities/:id
DELETE /api/sales/opportunities/:id
POST /api/sales/quotes
GET /api/sales/pipeline
```

#### Reports
```
GET /api/reports/sales-summary
GET /api/reports/customer-feedback
GET /api/reports/inventory-status
GET /api/reports/financial-overview
POST /api/reports/custom
```

### API Response Standardı
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 5. Frontend Bileşen Mimarisi

### Ana Bileşenler

#### Layout Bileşenleri
- `Sidebar` - Sol menü navigasyon
- `TopBar` - Üst başlık ve kullanıcı menüsü
- `MainLayout` - Ana sayfa düzeni
- `ModuleLayout` - Modül bazlı düzen

#### UI Bileşenleri
- `DataTable` - Veri tablosu (filtreleme, sıralama, pagination)
- `FormBuilder` - Dinamik form oluşturucu
- `Modal` - Modal pencereler
- `Charts` - Grafik ve analiz bileşenleri
- `FileUpload` - Dosya yükleme
- `DatePicker` - Tarih seçici
- `SearchInput` - Arama kutusu

### State Yönetimi

#### Redux Slice'lar
```typescript
// store/slices/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// store/slices/customersSlice.ts
interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  filters: CustomerFilters;
  loading: boolean;
}
```

## 6. Rol Tabanlı Yetkilendirme

### Roller ve Yetkiler

#### Admin Rolü
```javascript
permissions: {
  users: ['create', 'read', 'update', 'delete'],
  customers: ['create', 'read', 'update', 'delete'],
  products: ['create', 'read', 'update', 'delete'],
  sales: ['create', 'read', 'update', 'delete'],
  finance: ['create', 'read', 'update', 'delete'],
  reports: ['create', 'read', 'update', 'delete'],
  settings: ['create', 'read', 'update', 'delete']
}
```

#### Satış Ekibi Rolü
```javascript
permissions: {
  customers: ['create', 'read', 'update'],
  sales: ['create', 'read', 'update'],
  tasks: ['create', 'read', 'update'],
  reports: ['read'] // Sadece satış raporları
}
```

### Yetki Kontrolü Middleware'i
```typescript
const checkPermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.user.role.permissions;
    if (userPermissions[resource]?.includes(action)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};
```

## 7. Otomasyon Sistemi

### İş Akışı Motoru
```typescript
interface WorkflowTrigger {
  type: 'time_based' | 'event_based';
  condition: string;
}

interface WorkflowAction {
  type: 'email' | 'sms' | 'task_creation' | 'status_update';
  parameters: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  isActive: boolean;
}
```

### Bildirim Sistemi
- E-posta şablonları (NodeMailer + Handlebars)
- SMS entegrasyonu (Twilio API)
- In-app bildirimler (WebSocket)

## 8. Mock Veri Yapısı

### Demo Kullanıcıları
```javascript
mockUsers = [
  {
    email: "admin@blabmarket.com",
    role: "admin",
    password: "admin123"
  },
  {
    email: "satis@blabmarket.com", 
    role: "sales_team",
    password: "satis123"
  },
  {
    email: "finans@blabmarket.com",
    role: "finance_team", 
    password: "finans123"
  },
  {
    email: "ithalat@blabmarket.com",
    role: "import_export_team",
    password: "ithalat123"
  },
  {
    email: "destek@blabmarket.com",
    role: "support_team",
    password: "destek123"
  }
];
```

### Örnek Veri Setleri
- 50+ müşteri profili (farklı sektörlerden)
- 100+ ürün (tıbbi ve genel ürünler)
- 30+ satış fırsatı (farklı aşamalarda)
- 25+ fatura (farklı statülerde)
- 40+ görev (çeşitli kullanıcılara atanmış)

## 9. Performans ve Güvenlik

### Güvenlik Önlemleri
- JWT token expiration (15dk access, 7gün refresh)
- Password hashing (bcrypt, salt rounds: 12)
- SQL injection koruması (parameterized queries)
- XSS koruması (input sanitization)
- CORS yapılandırması
- Rate limiting (express-rate-limit)

### Performans Optimizasyonları
- Database indexleme
- API response caching (Redis - opsiyonel)
- Frontend lazy loading
- Image optimization
- Bundle splitting (Vite)

## 10. Dağıtım Stratejisi

### Development Environment
```bash
# Frontend dev server
cd frontend && npm run dev # localhost:5173

# Backend dev server  
cd backend && npm run dev # localhost:3000

# Database
PostgreSQL on localhost:5432
```

### Production Ready Features
- Environment variables (.env files)
- Docker containerization hazırlıkları
- PM2 process manager
- HTTPS SSL sertifikası desteği
- Database backup stratejisi

## 11. Test Stratejisi

### Backend Testleri
- Unit testler (Jest)
- Integration testleri (Supertest)
- API endpoint testleri

### Frontend Testleri  
- Component testleri (React Testing Library)
- E2E testleri (Cypress - opsiyonel)
- Form validation testleri

## 12. Geliştirme Süreci

### Branch Stratejisi
- `main` - Production ready kod
- `develop` - Development branch
- `feature/*` - Özellik geliştirme
- `hotfix/*` - Acil düzeltmeler

### Commit Convention
```
feat: yeni özellik ekleme
fix: hata düzeltme
docs: dokümantasyon güncellemesi
style: kod formatı değişiklikleri
refactor: kod iyileştirmeleri
test: test ekleme/düzenleme
```

Bu mimari doküman, Blabmarket CRM demo sisteminin tüm teknik detaylarını kapsamaktadır ve geliştirim sürecinde rehber olarak kullanılabilir.