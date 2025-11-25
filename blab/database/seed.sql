-- Blabmarket CRM Demo Data Seed
-- Run this after schema.sql to populate demo data

-- Clear existing data (for development)
TRUNCATE TABLE audit_logs, notifications, workflow_executions, workflows,
customer_interactions, task_comments, payments, tasks, invoice_items, invoices,
sales_opportunities, purchase_orders, products, product_categories,
suppliers, customers, users, roles RESTART IDENTITY CASCADE;

-- 1. INSERT ROLES
INSERT INTO roles (name, display_name, permissions, description) VALUES
('admin', 'Yönetici', '{
  "users": ["create", "read", "update", "delete"],
  "customers": ["create", "read", "update", "delete"],
  "products": ["create", "read", "update", "delete"],
  "sales": ["create", "read", "update", "delete"],
  "finance": ["create", "read", "update", "delete"],
  "procurement": ["create", "read", "update", "delete"],
  "tasks": ["create", "read", "update", "delete"],
  "reports": ["create", "read", "update", "delete"],
  "settings": ["create", "read", "update", "delete"]
}', 'Sistem yöneticisi - tüm modüllere erişim'),

('sales_team', 'Satış Ekibi', '{
  "customers": ["create", "read", "update"],
  "sales": ["create", "read", "update"],
  "tasks": ["create", "read", "update"],
  "reports": ["read"],
  "products": ["read"]
}', 'Satış temsilcileri ve satış yöneticileri'),

('finance_team', 'Finans Ekibi', '{
  "finance": ["create", "read", "update"],
  "customers": ["read"],
  "invoices": ["create", "read", "update"],
  "reports": ["read"],
  "tasks": ["read", "update"]
}', 'Mali işler ve muhasebe uzmanları'),

('import_export_team', 'İthalat/İhracat Ekibi', '{
  "products": ["create", "read", "update"],
  "procurement": ["create", "read", "update"],
  "suppliers": ["create", "read", "update"],
  "reports": ["read"],
  "tasks": ["create", "read", "update"]
}', 'İthalat, ihracat ve satın alma uzmanları'),

('support_team', 'Destek Ekibi', '{
  "customers": ["read", "update"],
  "tasks": ["create", "read", "update"],
  "reports": ["read"],
  "interactions": ["create", "read", "update"]
}', 'Müşteri hizmetleri ve destek ekibi');

-- 2. INSERT USERS (passwords are hashed for admin123, satis123, etc.)
INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, phone, is_active, email_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@blabmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6UP9lJlSiu', 'Admin', 'User', 1, '+90 212 555 01 01', true, true),
('00000000-0000-0000-0000-000000000002', 'satis@blabmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6UP9lJlSiu', 'Ahmet', 'Yılmaz', 2, '+90 212 555 01 02', true, true),
('00000000-0000-0000-0000-000000000003', 'finans@blabmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6UP9lJlSiu', 'Fatma', 'Demir', 3, '+90 212 555 01 03', true, true),
('00000000-0000-0000-0000-000000000004', 'ithalat@blabmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6UP9lJlSiu', 'Mehmet', 'Kaya', 4, '+90 212 555 01 04', true, true),
('00000000-0000-0000-0000-000000000005', 'destek@blabmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6UP9lJlSiu', 'Ayşe', 'Özkan', 5, '+90 212 555 01 05', true, true);

-- 3. INSERT PRODUCT CATEGORIES
INSERT INTO product_categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Medikal Cihazlar', 'Hastanelerde kullanılan tıbbi cihazlar'),
('11111111-1111-1111-1111-111111111112', 'Sarf Malzemeleri', 'Tek kullanımlık tıbbi sarf malzemeleri'),
('11111111-1111-1111-1111-111111111113', 'İlaçlar', 'Reçeteli ve reçetesiz ilaçlar'),
('11111111-1111-1111-1111-111111111114', 'Dezenfektan & Hijyen', 'Temizlik ve hijyen ürünleri'),
('11111111-1111-1111-1111-111111111115', 'Ortopedik Ürünler', 'Ortopedik destekler ve protezler');

-- 4. INSERT SUPPLIERS
INSERT INTO suppliers (id, company_name, contact_person, email, phone, city, country, created_by) VALUES
('22222222-2222-2222-2222-222222222221', 'MediTech Global Ltd.', 'John Smith', 'john@meditech.com', '+44 20 7946 0958', 'London', 'United Kingdom', '00000000-0000-0000-0000-000000000004'),
('22222222-2222-2222-2222-222222222222', 'Türk Medikal A.Ş.', 'Selim Arkan', 'selim@turkmedical.com.tr', '+90 216 555 22 33', 'Istanbul', 'Türkiye', '00000000-0000-0000-0000-000000000004'),
('22222222-2222-2222-2222-222222222223', 'Euro Surgical GmbH', 'Hans Mueller', 'hans@eurosurgical.de', '+49 30 12345678', 'Berlin', 'Germany', '00000000-0000-0000-0000-000000000004'),
('22222222-2222-2222-2222-222222222224', 'Asia Medical Co.', 'Li Wei', 'li.wei@asiamedical.cn', '+86 21 6234 5678', 'Shanghai', 'China', '00000000-0000-0000-0000-000000000004');

-- 5. INSERT PRODUCTS
INSERT INTO products (id, name, sku, category_id, description, unit_price, cost_price, stock_quantity, minimum_stock_level, is_medical, requires_import_license, supplier_id) VALUES
('33333333-3333-3333-3333-333333333331', 'EKG Cihazı Pro 2024', 'EKG-PRO-2024', '11111111-1111-1111-1111-111111111111', 'Profesyonel 12 kanal EKG cihazı', 15000.00, 12000.00, 25, 5, true, true, '22222222-2222-2222-2222-222222222221'),
('33333333-3333-3333-3333-333333333332', 'Dijital Termometre', 'TERMO-DIG-001', '11111111-1111-1111-1111-111111111111', 'Hızlı ölçüm dijital termometre', 85.00, 65.00, 150, 20, true, false, '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', 'Cerrahi Eldiven (Lateks)', 'ELD-LAT-100', '11111111-1111-1111-1111-111111111112', 'Steril lateks cerrahi eldiven - 100 adet', 45.00, 35.00, 5, 50, true, false, '22222222-2222-2222-2222-222222222223'),
('33333333-3333-3333-3333-333333333334', 'Ultrason Cihazı Mobil', 'US-MOB-2024', '11111111-1111-1111-1111-111111111111', 'Taşınabilir ultrason cihazı', 45000.00, 38000.00, 8, 3, true, true, '22222222-2222-2222-2222-222222222221'),
('33333333-3333-3333-3333-333333333335', 'Dezenfektan Spray 500ml', 'DEZ-SPR-500', '11111111-1111-1111-1111-111111111114', 'Alkol bazlı el ve yüzey dezenfektanı', 25.00, 18.00, 200, 50, false, false, '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333336', 'Tansiyon Aleti Dijital', 'TAN-DIG-001', '11111111-1111-1111-1111-111111111111', 'Otomatik dijital tansiyon aleti', 150.00, 120.00, 45, 10, true, false, '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333337', 'Medikal Maske FFP2', 'MASK-FFP2-50', '11111111-1111-1111-1111-111111111112', 'FFP2 standart medikal maske - 50 adet', 75.00, 55.00, 300, 100, true, false, '22222222-2222-2222-2222-222222222223');

-- 6. INSERT CUSTOMERS WITH CREDIT LIMITS
INSERT INTO customers (id, company_name, contact_person, email, phone, address, city, customer_type, segment, credit_limit, available_credit, total_outstanding, last_payment_date, payment_terms, credit_status, created_by, assigned_to) VALUES
('44444444-4444-4444-4444-444444444441', 'ABC Medikal Şirketi', 'Dr. Ahmet Yılmaz', 'ahmet@abc-medikal.com', '+90 212 555 11 22', 'Atatürk Cad. No:15/A Şişli', 'İstanbul', 'active', 'large', 100000.00, 94100.00, 5900.00, '2024-01-10', 30, 'good', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('44444444-4444-4444-4444-444444444442', 'XYZ İlaç Dağıtım', 'Fatma Demir', 'info@xyz-ilac.com', '+90 216 555 33 44', 'Bağdat Cad. No:125 Kadıköy', 'İstanbul', 'active', 'medium', 75000.00, 75000.00, 0.00, '2024-01-20', 45, 'good', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('44444444-4444-4444-4444-444444444443', 'DEF Sağlık Hizmetleri', 'Can Özkan', 'can@def-saglik.com', '+90 312 555 55 66', 'Kızılay Cad. No:78 Çankaya', 'Ankara', 'prospect', 'small', 25000.00, 25000.00, 0.00, NULL, 30, 'good', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('44444444-4444-4444-4444-444444444444', 'GHI Medical Equipment', 'Elif Kaya', 'elif@ghi-medical.com', '+90 232 555 77 88', 'Konak Meydanı No:33 Konak', 'İzmir', 'active', 'large', 120000.00, 102300.00, 17700.00, '2024-01-05', 60, 'warning', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002'),
('44444444-4444-4444-4444-444444444445', 'JKL Eczane Zinciri', 'Mehmet Şahin', 'mehmet@jkl-eczane.com', '+90 224 555 99 00', 'Osmangazi Cad. No:42 Osmangazi', 'Bursa', 'inactive', 'medium', 50000.00, 50000.00, 0.00, '2023-12-15', 30, 'good', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005');

-- 7. INSERT SALES OPPORTUNITIES
INSERT INTO sales_opportunities (id, customer_id, title, description, estimated_value, probability, status, assigned_to, expected_close_date, created_by) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'EKG Cihazı Satışı', 'ABC Medikal için 5 adet EKG cihazı satış fırsatı', 75000.00, 80, 'proposal', '00000000-0000-0000-0000-000000000002', '2024-03-15', '00000000-0000-0000-0000-000000000002'),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', 'Medikal Malzeme Paketi', 'XYZ İlaç için aylık medikal malzeme tedariki', 12000.00, 60, 'qualified', '00000000-0000-0000-0000-000000000002', '2024-03-01', '00000000-0000-0000-0000-000000000002'),
('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', 'Temel Medikal Set', 'DEF Sağlık için temel medikal cihaz seti', 25000.00, 40, 'prospect', '00000000-0000-0000-0000-000000000002', '2024-04-01', '00000000-0000-0000-0000-000000000002'),
('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444444', 'Ultrason Cihazı', 'GHI Medical için ultrason cihazı satışı', 45000.00, 90, 'negotiation', '00000000-0000-0000-0000-000000000002', '2024-02-28', '00000000-0000-0000-0000-000000000002');

-- 8. INSERT INVOICES
INSERT INTO invoices (id, invoice_number, customer_id, sales_opportunity_id, invoice_date, due_date, status, subtotal, tax_amount, total_amount, paid_amount, created_by) VALUES
('66666666-6666-6666-6666-666666666661', 'INV-2024-001', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555552', '2024-01-15', '2024-02-15', 'paid', 10000.00, 1800.00, 11800.00, 11800.00, '00000000-0000-0000-0000-000000000003'),
('66666666-6666-6666-6666-666666666662', 'INV-2024-002', '44444444-4444-4444-4444-444444444441', NULL, '2024-01-20', '2024-02-20', 'sent', 5000.00, 900.00, 5900.00, 0.00, '00000000-0000-0000-0000-000000000003'),
('66666666-6666-6666-6666-666666666663', 'INV-2024-003', '44444444-4444-4444-4444-444444444444', NULL, '2024-01-25', '2024-02-25', 'overdue', 15000.00, 2700.00, 17700.00, 0.00, '00000000-0000-0000-0000-000000000003');

-- 9. INSERT INVOICE ITEMS
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, line_total) VALUES
('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333332', 'Dijital Termometre', 50, 85.00, 4250.00),
('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333333', 'Cerrahi Eldiven (Lateks)', 100, 45.00, 4500.00),
('66666666-6666-6666-6666-666666666661', '33333333-3333-3333-3333-333333333335', 'Dezenfektan Spray', 50, 25.00, 1250.00),

('66666666-6666-6666-6666-666666666662', '33333333-3333-3333-3333-333333333336', 'Tansiyon Aleti Dijital', 20, 150.00, 3000.00),
('66666666-6666-6666-6666-666666666662', '33333333-3333-3333-3333-333333333337', 'Medikal Maske FFP2', 25, 75.00, 1875.00),

('66666666-6666-6666-6666-666666666663', '33333333-3333-3333-3333-333333333331', 'EKG Cihazı Pro 2024', 1, 15000.00, 15000.00);

-- 10. INSERT PAYMENTS
INSERT INTO payments (id, invoice_id, customer_id, payment_number, payment_date, amount, payment_method, reference_number, notes, status, created_by) VALUES
('88888888-8888-8888-8888-888888888881', '66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444442', 'PAY-2024-001', '2024-01-20', 11800.00, 'bank_transfer', 'TR001234567890123456789012', 'Fatura INV-2024-001 tam ödeme', 'completed', '00000000-0000-0000-0000-000000000003'),
('88888888-8888-8888-8888-888888888882', '66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444441', 'PAY-2024-002', '2024-01-25', 2950.00, 'bank_transfer', 'TR001234567890123456789013', 'Fatura INV-2024-002 kısmi ödeme (50%)', 'completed', '00000000-0000-0000-0000-000000000003');

-- 11. INSERT TASKS
INSERT INTO tasks (id, title, description, priority, status, assigned_to, assigned_by, customer_id, due_date) VALUES
('77777777-7777-7777-7777-777777777771', 'ABC Medikal ile görüşme ayarla', 'EKG cihazı teklifimiz için yüz yüze görüşme ayarlanması gerekiyor', 'high', 'todo', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444441', '2024-02-20'),
('77777777-7777-7777-7777-777777777772', 'Stok sayımı gerçekleştir', 'Cerrahi eldiven stoklarının fiziksel sayımı yapılacak', 'medium', 'in_progress', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', NULL, '2024-02-25'),
('77777777-7777-7777-7777-777777777773', 'Overdue fatura takibi', 'GHI Medical overdue fatura için ödeme takibi yapılacak', 'urgent', 'todo', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', '2024-02-18'),
('77777777-7777-7777-7777-777777777774', 'XYZ İlaç müşteri memnuniyet anketi', 'Müşteri memnuniyet anketi düzenlenmesi', 'low', 'completed', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444442', '2024-02-10'),
('77777777-7777-7777-7777-777777777775', 'Yeni tedarikçi değerlendirmesi', 'Asia Medical Co. için tedarikçi değerlendirme raporu hazırlanacak', 'medium', 'in_progress', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', NULL, '2024-03-01');

-- 12. INSERT CUSTOMER INTERACTIONS
INSERT INTO customer_interactions (customer_id, user_id, interaction_type, subject, notes, sentiment) VALUES
('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0000-000000000002', 'phone_call', 'EKG Cihazı Teknik Detaylar', 'Müşteri EKG cihazının teknik özelliklerini sordu. Detaylı bilgi verildi. Teklif hazırlanması talep edildi.', 'positive'),
('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0000-000000000002', 'email', 'Aylık Sipariş Planı', 'Müşteri ile aylık sipariş planı görüşüldü. Stok durumu bilgisi paylaşıldı.', 'positive'),
('44444444-4444-4444-4444-444444444443', '00000000-0000-0000-0000-000000000005', 'meeting', 'İlk Görüşme', 'Potansiyel müşteri ile tanışma toplantısı gerçekleştirildi. İhtiyaçlar dinlendi.', 'neutral'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000003', 'phone_call', 'Ödeme Hatırlatması', 'Overdue fatura için ödeme hatırlatması yapıldı. Müşteri 1 hafta süre istedi.', 'negative'),
('44444444-4444-4444-4444-444444444445', '00000000-0000-0000-0000-000000000005', 'email', 'Hizmet Şikayeti', 'Müşteri geç teslimat konusunda şikayette bulundu. Özür dilendi ve çözüm önerildi.', 'negative');

-- 13. INSERT NOTIFICATIONS
INSERT INTO notifications (user_id, title, message, type) VALUES
('00000000-0000-0000-0000-000000000002', 'Yeni Satış Fırsatı', 'ABC Medikal için yeni bir satış fırsatı oluşturuldu', 'info'),
('00000000-0000-0000-0000-000000000003', 'Ödenmeyen Fatura', 'GHI Medical faturası vadesi geçmiş durumda', 'warning'),
('00000000-0000-0000-0000-000000000004', 'Düşük Stok Uyarısı', 'Cerrahi Eldiven stoğu minimum seviyenin altında', 'warning'),
('00000000-0000-0000-0000-000000000001', 'Yeni Kullanıcı Kaydı', 'Sisteme yeni bir kullanıcı kaydı tamamlandı', 'success'),
('00000000-0000-0000-0000-000000000005', 'Görev Ataması', 'Size yeni bir görev atandı: Müşteri memnuniyet anketi', 'info'),
('00000000-0000-0000-0000-000000000003', 'Kredi Limiti Uyarısı', 'GHI Medical Equipment kredi limiti %85 doluluk oranında', 'warning'),
('00000000-0000-0000-0000-000000000002', 'Ödeme Alındı', 'XYZ İlaç Dağıtım firmasından 11.800 TL ödeme alındı', 'success');

-- 14. INSERT TASK COMMENTS
INSERT INTO task_comments (task_id, user_id, comment) VALUES
('77777777-7777-7777-7777-777777777772', '00000000-0000-0000-0000-000000000004', 'Stok sayımına başlandı. Eldiven stoklarında eksiklik tespit edildi.'),
('77777777-7777-7777-7777-777777777773', '00000000-0000-0000-0000-000000000003', 'Müşteri ile iletişime geçildi. Ödeme için 1 hafta süre talep ettiler.'),
('77777777-7777-7777-7777-777777777774', '00000000-0000-0000-0000-000000000005', 'Anket tamamlandı. Müşteri memnuniyeti %8.5/10 olarak ölçüldü.');

-- Update sequences to prevent conflicts
SELECT setval('roles_id_seq', 5, true);

-- Success message
SELECT 'Demo data successfully inserted!' as message;