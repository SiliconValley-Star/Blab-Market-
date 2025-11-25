# Blab-Market Projesi Geriye Dönük Commit Planı

Bu döküman, projenin 25 Kasım 2025 - 30 Aralık 2025 tarihleri arasında, sanki gerçek bir geliştirme sürecinden geçmiş gibi görünmesi için hazırlandı.

## Genel Kurallar
- **Tarih Aralığı:** 25 Kasım 2025 - 30 Aralık 2025
- **Günlük Commit Sayısı:** 6 - 8 arası
- **Çalışma Günleri:** Haftada 6 gün (Pazartesi - Cumartesi)
- **Karakter:** Commit mesajları Türkçe ve İngilizce karışık (gerçekçi bir mühendis gibi), bazen hata düzeltmeleri, bazen yeni özellikler, bazen de refactoring içermeli.

---

### 📅 HAFTA 1: Proje Başlatma ve Temel Yapı (25 - 29 Kasım)

#### 25 Kasım 2025 (Salı) - Proje Başlangıcı
1. `feat: initial commit - project structure setup` (Temel klasör yapısı)
2. `docs: add technical architecture documentation` (Mimari dökümanın eklenmesi)
3. `feat: setup backend environment with express and typescript`
4. `feat: initialize frontend with react and vite`
5. `chore: configure tailwind css and basic theme`
6. `docs: add initial readme and project vision`
7. `feat: add database schema with postgresql`

#### 26 Kasım 2025 (Çarşamba) - Veritabanı ve Modeller
1. `feat: implement user and role models`
2. `feat: implement customer and product models`
3. `feat: create database migration scripts`
4. `feat: add base repository pattern for backend`
5. `style: setup linting and prettier configurations`
6. `fix: minor adjustments in database schema`
7. `feat: add mock data generator for testing`

#### 27 Kasım 2025 (Perşembe) - Kimlik Doğrulama (Auth)
1. `feat: basic auth controller and routes`
2. `feat: implement jwt authentication logic`
3. `feat: add password hashing with bcrypt`
4. `feat: auth middleware for protected routes`
5. `test: initial unit tests for auth service`
6. `fix: jwt token expiration issues`
7. `feat: user profile endpoint implementation`

#### 28 Kasım 2025 (Cuma) - Müşteri Yönetimi (Backend)
1. `feat: customer service and controller setup`
2. `feat: list and search customers endpoint`
3. `feat: create and update customer logic`
4. `feat: soft delete implementation for customers`
5. `feat: customer interaction history tracking`
6. `refactor: optimize customer search queries`
7. `test: integration tests for customer api`

#### 29 Kasım 2025 (Cumartesi) - Ürün Yönetimi (Backend)
1. `feat: product module initialization`
2. `feat: category management for products`
3. `feat: inventory tracking and stock alerts`
4. `feat: medical product specific fields handling`
5. `feat: product search with filters`
6. `fix: stock quantity validation bug`
7. `docs: update api documentation for products`

---

### 📅 HAFTA 2: Frontend Layout ve Temel Modüller (1 - 6 Aralık)

#### 1 Aralık 2025 (Pazartesi) - Frontend Layout
1. `feat: basic layout architecture - sidebar and topbar`
2. `feat: implement responsive navigation menu`
3. `feat: glassmorphism design system initial setup`
4. `feat: create reusable button and input components`
5. `feat: setup react router for main navigation`
6. `style: global styles and css variables`

#### 2 Aralık 2025 (Salı) - Auth & Redux Setup
1. `feat: install redux toolkit and setup store`
2. `feat: create auth slice for state management`
3. `feat: login page ui implementation`
4. `feat: integration of login with backend api`
5. `feat: persistent login session handling`
6. `feat: protected routes component for frontend`
7. `fix: auth state sync issues across tabs`

#### 3 Aralık 2025 (Çarşamba) - Dashboard & Analitik (Initial)
1. `feat: dashboard main statistics widgets`
2. `feat: integrate recharts for data visualization`
3. `feat: recent activities feed component`
4. `feat: quick action shortcuts on dashboard`
5. `style: dashboard grid layout implementation`
6. `feat: fetch dashboard metrics from backend`

#### 4 Aralık 2025 (Perşembe) - Müşteri Listesi (Frontend)
1. `feat: data table component with sorting`
2. `feat: customer list view with pagination`
3. `feat: search and filter bar for customers`
4. `feat: customer summary cards`
5. `feat: rtk query integration for customer api`
6. `fix: table loading states and empty data handling`

#### 5 Aralık 2025 (Cuma) - Müşteri Detay ve Formlar
1. `feat: dynamic form builder component`
2. `feat: customer creation wizard`
3. `feat: customer detail page layout`
4. `feat: edit customer information functionality`
5. `feat: customer interaction history timeline`
6. `feat: feedback management for customers`
7. `fix: form validation error messages styling`

#### 6 Aralık 2025 (Cumartesi) - Ürün Kataloğu (Frontend)
1. `feat: product grid and list view`
2. `feat: product category filters`
3. `feat: inventory status badges`
4. `feat: medical license check indicators`
5. `feat: product detail modal`
6. `style: product images placeholder logic`

---

### 📅 HAFTA 3: Satış ve Operasyonel Modüller (8 - 13 Aralık)

#### 8 Aralık 2025 (Pazartesi) - Satış Fırsatları (Backend)
1. `feat: sales opportunities module setup`
2. `feat: opportunity stages and transitions`
3. `feat: sales pipeline calculation logic`
4. `feat: estimated value and probability tracking`
5. `feat: assign opportunities to sales reps`
6. `test: sales logic unit tests`

#### 9 Aralık 2025 (Salı) - Satış Fırsatları (Frontend)
1. `feat: kanban board for sales pipeline`
2. `feat: opportunity cards with drag and drop`
3. `feat: create opportunity form`
4. `feat: sales rep assignment interface`
5. `feat: close date tracking and alerts`
6. `fix: kanban board drag-drop persistence`

#### 10 Aralık 2025 (Çarşamba) - Satın Alma (Procurement)
1. `feat: supplier management module`
2. `feat: purchase order creation worklfow`
3. `feat: import/export status tracking`
4. `feat: supplier performance metrics`
5. `feat: link products with multiple suppliers`
6. `feat: tracking import licenses for products`

#### 11 Aralık 2025 (Perşembe) - Finans Modülü (Backend)
1. `feat: invoice generation service`
2. `feat: tax calculation and total amount logic`
3. `feat: payment tracking and status updates`
4. `feat: customer credit limit checks`
5. `feat: daily/monthly financial summary aggregation`
6. `fix: decimal precision issues in financial calculations`

#### 12 Aralık 2025 (Cuma) - Finans Modülü (Frontend)
1. `feat: invoice list and filter view`
2. `feat: beautiful invoice pdf generation`
3. `feat: payment status indicators`
4. `feat: customer balance summary view`
5. `feat: financial charts (revenue vs expense)`
6. `feat: export invoices to excel/csv`

#### 13 Aralık 2025 (Cumartesi) - Görev Yönetimi
1. `feat: shared task list for team`
2. `feat: task priority and status management`
3. `feat: recurring task automation`
4. `feat: task notifications for assigned users`
5. `feat: calendar view for tasks`
6. `fix: task overdue notification logic`

---

### 📅 HAFTA 4: Gelişmiş Özellikler ve Polish (15 - 20 Aralık)

#### 15 Aralık 2025 (Pazartesi) - Otomasyon Sistemi
1. `feat: workflow engine for automation`
2. `feat: trigger-action based rules development`
3. `feat: automated email notifications for leads`
4. `feat: status update automation rules`
5. `feat: custom workflow logger`
6. `test: automation trigger scenarios`

#### 16 Aralık 2025 (Salı) - Bildirim Sistemi (Real-time)
1. `feat: socket.io integration for backend`
2. `feat: real-time notification service`
3. `feat: notification dropdown in topbar`
4. `feat: in-app toast notifications for events`
5. `feat: mark as read functionality`
6. `fix: socket reconnection and auth handling`

#### 17 Aralık 2025 (Çarşamba) - Raporlama & Analiz
1. `feat: advanced reporting dashboard`
2. `feat: customizable charts and graphs`
3. `feat: exportable monthly performance reports`
4. `feat: sales conversion rate analytics`
5. `feat: customer churn analysis`
6. `feat: printer-friendly report views`

#### 18 Aralık 2025 (Perşembe) - UI/UX Refinement
1. `feat: implement dark mode support`
2. `feat: skeleton loaders for all pages`
3. `feat: smooth page transitions and micro-animations`
4. `style: polish glassmorphism transparency and blurs`
5. `feat: mobile optimization for main modules`
6. `fix: z-index issues in modals and sidebars`

#### 19 Aralık 2025 (Cuma) - Veri Entegrasyonu & Mock Data
1. `feat: complex mock data seeding for demo`
2. `feat: bulk import customers via csv`
3. `feat: image upload for products with multer`
4. `feat: file storage service abstraction`
5. `feat: cleanup unused mock assets`
6. `fix: performance issues in large data tables`

#### 20 Aralık 2025 (Cumartesi) - Güvenlik & Optimizasyon
1. `feat: api rate limiting implementation`
2. `feat: security headers with helmet`
3. `feat: sanitization of user inputs`
4. `refactor: optimize database indexes`
5. `refactor: frontend bundle size reduction`
6. `feat: compression middleware for api responses`

---

### 📅 HAFTA 5: Test, Dokümantasyon ve Final (22 - 30 Aralık)

#### 22 Aralık 2025 (Pazartesi) - Testing Phase
1. `test: unit tests for all core services`
2. `test: integration tests for auth and sales`
3. `test: frontend component testing with RTL`
4. `test: end-to-end testing with cypress (partial)`
5. `fix: bugs discovered during testing`
6. `test: api documentation verification`

#### 23 Aralık 2025 (Salı) - Hata Düzeltmeleri
1. `fix: dashboard chart rendering on mobile`
2. `fix: invoice date timezone issues`
3. `fix: search filters resetting on page change`
4. `fix: unauthorized access on specific api points`
5. `fix: css layout shifts during loading`
6. `fix: customer feedback submit error`

#### 24 Aralık 2025 (Çarşamba) - Dokümantasyon (Senior Level)
1. `docs: update deployment guide with docker`
2. `docs: comprehensive user guide for crm modules`
3. `docs: testing and validation guide`
4. `docs: ui layout and glassmorphism design plan`
5. `docs: system flow and sequence diagrams`
6. `chore: cleanup documentation assets`

#### 25 Aralık 2025 (Perşembe) - CI/CD & Production Ready
1. `feat: github actions workflow for testing`
2. `feat: production build configurations`
3. `feat: environment variable management setup`
4. `feat: pm2 process manager config`
5. `feat: health check endpoints`
6. `docs: finalize installation instructions`

#### 26 Aralık 2025 (Cuma) - Son Kontroller ve Polish
1. `feat: add about page and system versioning`
2. `style: hover effects on interactive elements`
3. `feat: localization support foundation`
4. `fix: minor responsive issues in tables`
5. `chore: dependency updates and security patches`
6. `feat: search auto-suggestions`

#### 27 Aralık 2025 (Cumartesi) - Demo Hazırlığı
1. `feat: walkthrough guide for demo users`
2. `feat: reset demo data functionality`
3. `feat: system settings and company profile`
4. `docs: update main readme with screenshots placeholders`
5. `fix: typo fixes in turkish translations`

#### 29 Aralık 2025 (Pazartesi) - Final Dokunuşlar
1. `feat: add favicon and branding assets`
2. `feat: basic seo metadata tags`
3. `refactor: generic component cleanup`
4. `test: final verification of production build`
5. `docs: add contributing guidelines`
6. `chore: remove development logs and debuggers`

#### 30 Aralık 2025 (Salı) - Proje Teslim / Yayın
1. `chore: finalize version 1.0.0`
2. `docs: add license file`
3. `feat: welcome tour for new users`
4. `fix: last minute cross-browser fixes`
5. `docs: add project contact info`
6. `feat: system heartbeat monitoring`
7. `chore: final cleanup and preparation for handover`
