-- Blabmarket CRM Database Schema
-- PostgreSQL 15+ Compatible

-- Create database (run this separately if needed)
-- CREATE DATABASE blabmarket_crm;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS customer_interactions CASCADE;
DROP TABLE IF EXISTS workflow_executions CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS sales_opportunities CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. ROLES TABLE
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    phone VARCHAR(20),
    profile_picture VARCHAR(500),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMERS TABLE
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Türkiye',
    postal_code VARCHAR(20),
    tax_number VARCHAR(50),
    website VARCHAR(255),
    customer_type VARCHAR(20) DEFAULT 'prospect' CHECK (customer_type IN ('prospect', 'active', 'inactive')),
    segment VARCHAR(20) DEFAULT 'small' CHECK (segment IN ('small', 'medium', 'large')),
    industry VARCHAR(100),
    annual_revenue DECIMAL(15,2),
    employee_count INTEGER,
    -- Credit Management Fields
    credit_limit DECIMAL(12,2) DEFAULT 50000.00,
    available_credit DECIMAL(12,2) DEFAULT 50000.00,
    total_outstanding DECIMAL(12,2) DEFAULT 0.00,
    last_payment_date DATE,
    payment_terms INTEGER DEFAULT 30, -- days
    credit_status VARCHAR(20) DEFAULT 'good' CHECK (credit_status IN ('good', 'warning', 'exceeded', 'blocked')),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCT CATEGORIES TABLE
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES product_categories(id),
    description TEXT,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost_price DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    minimum_stock_level INTEGER DEFAULT 0,
    maximum_stock_level INTEGER,
    unit VARCHAR(50) DEFAULT 'adet',
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    is_medical BOOLEAN DEFAULT false,
    requires_import_license BOOLEAN DEFAULT false,
    expiry_date DATE,
    manufacturer VARCHAR(255),
    supplier_id UUID,
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUPPLIERS TABLE
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    tax_number VARCHAR(50),
    payment_terms INTEGER DEFAULT 30,
    supplier_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add supplier reference to products
ALTER TABLE products ADD CONSTRAINT fk_products_supplier 
FOREIGN KEY (supplier_id) REFERENCES suppliers(id);

-- 7. SALES OPPORTUNITIES TABLE
CREATE TABLE sales_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_value DECIMAL(12,2) DEFAULT 0,
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    status VARCHAR(20) DEFAULT 'prospect' CHECK (status IN ('prospect', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
    stage VARCHAR(50),
    assigned_to UUID NOT NULL REFERENCES users(id),
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason TEXT,
    competitor VARCHAR(255),
    source VARCHAR(100),
    next_action TEXT,
    next_action_date DATE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. PURCHASE ORDERS TABLE
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    total_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. INVOICES TABLE
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    sales_opportunity_id UUID REFERENCES sales_opportunities(id),
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'TRY',
    payment_method VARCHAR(50),
    bank_account VARCHAR(100),
    notes TEXT,
    terms_and_conditions TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. INVOICE ITEMS TABLE
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    line_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10a. PAYMENTS TABLE
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    payment_number VARCHAR(100) UNIQUE NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer' CHECK (payment_method IN ('cash', 'bank_transfer', 'credit_card', 'check', 'other')),
    currency VARCHAR(10) DEFAULT 'TRY',
    exchange_rate DECIMAL(8,4) DEFAULT 1.0000,
    reference_number VARCHAR(255),
    bank_account VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. TASKS TABLE
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    assigned_to UUID NOT NULL REFERENCES users(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    customer_id UUID REFERENCES customers(id),
    sales_opportunity_id UUID REFERENCES sales_opportunities(id),
    due_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    completed_at TIMESTAMP,
    completion_notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. TASK COMMENTS TABLE
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. CUSTOMER INTERACTIONS TABLE
CREATE TABLE customer_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    user_id UUID NOT NULL REFERENCES users(id),
    interaction_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    notes TEXT NOT NULL,
    interaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    follow_up_date DATE,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. WORKFLOWS TABLE
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_conditions JSONB,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. WORKFLOW EXECUTIONS TABLE
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id),
    trigger_data JSONB,
    execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'running', 'completed', 'failed')),
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    data JSONB,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);
CREATE INDEX idx_customers_created_by ON customers(created_by);
CREATE INDEX idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX idx_customers_credit_status ON customers(credit_status);
CREATE INDEX idx_customers_credit_limit ON customers(credit_limit);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_stock_quantity ON products(stock_quantity);

CREATE INDEX idx_sales_opportunities_customer_id ON sales_opportunities(customer_id);
CREATE INDEX idx_sales_opportunities_assigned_to ON sales_opportunities(assigned_to);
CREATE INDEX idx_sales_opportunities_status ON sales_opportunities(status);
CREATE INDEX idx_sales_opportunities_expected_close_date ON sales_opportunities(expected_close_date);

CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_customer_id ON tasks(customer_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- UPDATE TRIGGERS for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_opportunities_updated_at BEFORE UPDATE ON sales_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE users IS 'System users with authentication data';
COMMENT ON TABLE customers IS 'Customer/client companies and contacts';
COMMENT ON TABLE products IS 'Product catalog with inventory management';
COMMENT ON TABLE sales_opportunities IS 'Sales pipeline and opportunity tracking';
COMMENT ON TABLE invoices IS 'Customer invoices and billing';
COMMENT ON TABLE tasks IS 'Task management and assignment';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE audit_logs IS 'Audit trail for data changes';
COMMENT ON TABLE payments IS 'Customer payment records for credit limit management';

-- CREDIT LIMIT MANAGEMENT FUNCTIONS AND TRIGGERS

-- Function to update customer credit limits
CREATE OR REPLACE FUNCTION update_customer_credit_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- When a new invoice is created or updated
    IF TG_TABLE_NAME = 'invoices' THEN
        IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.total_amount != NEW.total_amount) THEN
            -- Recalculate total outstanding for the customer
            UPDATE customers
            SET
                total_outstanding = (
                    SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                    FROM invoices
                    WHERE customer_id = NEW.customer_id
                    AND status NOT IN ('cancelled', 'refunded')
                ),
                available_credit = credit_limit - (
                    SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                    FROM invoices
                    WHERE customer_id = NEW.customer_id
                    AND status NOT IN ('cancelled', 'refunded')
                ),
                credit_status = CASE
                    WHEN (credit_limit - (
                        SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                        FROM invoices
                        WHERE customer_id = NEW.customer_id
                        AND status NOT IN ('cancelled', 'refunded')
                    )) < 0 THEN 'exceeded'
                    WHEN (credit_limit - (
                        SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                        FROM invoices
                        WHERE customer_id = NEW.customer_id
                        AND status NOT IN ('cancelled', 'refunded')
                    )) < (credit_limit * 0.1) THEN 'warning'
                    ELSE 'good'
                END
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
    
    -- When a payment is made
    IF TG_TABLE_NAME = 'payments' THEN
        IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.amount != NEW.amount) THEN
            -- Update invoice paid amount
            UPDATE invoices
            SET
                paid_amount = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM payments
                    WHERE invoice_id = NEW.invoice_id AND status = 'completed'
                ),
                status = CASE
                    WHEN (
                        SELECT COALESCE(SUM(amount), 0)
                        FROM payments
                        WHERE invoice_id = NEW.invoice_id AND status = 'completed'
                    ) >= total_amount THEN 'paid'
                    ELSE status
                END,
                paid_date = CASE
                    WHEN (
                        SELECT COALESCE(SUM(amount), 0)
                        FROM payments
                        WHERE invoice_id = NEW.invoice_id AND status = 'completed'
                    ) >= total_amount THEN NEW.payment_date
                    ELSE paid_date
                END
            WHERE id = NEW.invoice_id;
            
            -- Update customer credit information
            UPDATE customers
            SET
                total_outstanding = (
                    SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                    FROM invoices
                    WHERE customer_id = NEW.customer_id
                    AND status NOT IN ('cancelled', 'refunded')
                ),
                available_credit = credit_limit - (
                    SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                    FROM invoices
                    WHERE customer_id = NEW.customer_id
                    AND status NOT IN ('cancelled', 'refunded')
                ),
                last_payment_date = NEW.payment_date,
                credit_status = CASE
                    WHEN (credit_limit - (
                        SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                        FROM invoices
                        WHERE customer_id = NEW.customer_id
                        AND status NOT IN ('cancelled', 'refunded')
                    )) < 0 THEN 'exceeded'
                    WHEN (credit_limit - (
                        SELECT COALESCE(SUM(total_amount - paid_amount), 0)
                        FROM invoices
                        WHERE customer_id = NEW.customer_id
                        AND status NOT IN ('cancelled', 'refunded')
                    )) < (credit_limit * 0.1) THEN 'warning'
                    ELSE 'good'
                END
            WHERE id = NEW.customer_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for credit limit management
CREATE TRIGGER trigger_invoice_credit_update
    AFTER INSERT OR UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_credit_limit();

CREATE TRIGGER trigger_payment_credit_update
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_credit_limit();

-- Function to check credit limit before creating sales opportunities
CREATE OR REPLACE FUNCTION check_credit_limit_for_sales()
RETURNS TRIGGER AS $$
DECLARE
    customer_available_credit DECIMAL(12,2);
BEGIN
    -- Get customer's available credit
    SELECT available_credit INTO customer_available_credit
    FROM customers
    WHERE id = NEW.customer_id;
    
    -- Check if estimated value exceeds available credit
    IF NEW.estimated_value > customer_available_credit THEN
        RAISE WARNING 'Sales opportunity amount (%) exceeds customer available credit (%)',
            NEW.estimated_value, customer_available_credit;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for sales opportunity credit check
CREATE TRIGGER trigger_sales_credit_check
    BEFORE INSERT OR UPDATE ON sales_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION check_credit_limit_for_sales();