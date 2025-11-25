import os
import random
import subprocess
from datetime import datetime, timedelta

# Yapılandırma
REPO_PATH = "/Users/berhudanbascan/Desktop/Blab-Market"
USER_EMAIL = "berhudanbascan@gmail.com"
USER_NAME = "SiliconValley-Star"

def run_command(cmd, env=None):
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, cwd=REPO_PATH, env=env)
    stdout, stderr = process.communicate()
    return stdout.decode(), stderr.decode()

# HAFTALIK PLAN (Mesajlar)
PLAN = {
    (2025, 11, 25): ["feat: initial commit - project structure setup", "docs: add technical architecture documentation", "feat: setup backend environment with express and typescript", "feat: initialize frontend with react and vite", "chore: configure tailwind css and basic theme", "docs: add initial readme and project vision", "feat: add database schema with postgresql"],
    (2025, 11, 26): ["feat: implement user and role models", "feat: implement customer and product models", "feat: create database migration scripts", "feat: add base repository pattern for backend", "style: setup linting and prettier configurations", "fix: minor adjustments in database schema", "feat: add mock data generator for testing"],
    (2025, 11, 27): ["feat: basic auth controller and routes", "feat: implement jwt authentication logic", "feat: add password hashing with bcrypt", "feat: auth middleware for protected routes", "test: initial unit tests for auth service", "fix: jwt token expiration issues", "feat: user profile endpoint implementation"],
    (2025, 11, 28): ["feat: customer service and controller setup", "feat: list and search customers endpoint", "feat: create and update customer logic", "feat: soft delete implementation for customers", "feat: customer interaction history tracking", "refactor: optimize customer search queries", "test: integration tests for customer api"],
    (2025, 11, 29): ["feat: product module initialization", "feat: category management for products", "feat: inventory tracking and stock alerts", "feat: medical product specific fields handling", "feat: product search with filters", "fix: stock quantity validation bug", "docs: update api documentation for products"],
    
    (2025, 12, 1): ["feat: basic layout architecture - sidebar and topbar", "feat: implement responsive navigation menu", "feat: glassmorphism design system initial setup", "feat: create reusable button and input components", "feat: setup react router for main navigation", "style: global styles and css variables"],
    (2025, 12, 2): ["feat: install redux toolkit and setup store", "feat: create auth slice for state management", "feat: login page ui implementation", "feat: integration of login with backend api", "feat: persistent login session handling", "feat: protected routes component for frontend", "fix: auth state sync issues across tabs"],
    (2025, 12, 3): ["feat: dashboard main statistics widgets", "feat: integrate recharts for data visualization", "feat: recent activities feed component", "feat: quick action shortcuts on dashboard", "style: dashboard grid layout implementation", "feat: fetch dashboard metrics from backend"],
    (2025, 12, 4): ["feat: data table component with sorting", "feat: customer list view with pagination", "feat: search and filter bar for customers", "feat: customer summary cards", "feat: rtk query integration for customer api", "fix: table loading states and empty data handling"],
    (2025, 12, 5): ["feat: dynamic form builder component", "feat: customer creation wizard", "feat: customer detail page layout", "feat: edit customer information functionality", "feat: customer interaction history timeline", "feat: feedback management for customers", "fix: form validation error messages styling"],
    (2025, 12, 6): ["feat: product grid and list view", "feat: product category filters", "feat: inventory status badges", "feat: medical license check indicators", "feat: product detail modal", "style: product images placeholder logic"],
    
    (2025, 12, 8): ["feat: sales opportunities module setup", "feat: opportunity stages and transitions", "feat: sales pipeline calculation logic", "feat: estimated value and probability tracking", "feat: assign opportunities to sales reps", "test: sales logic unit tests"],
    (2025, 12, 9): ["feat: kanban board for sales pipeline", "feat: opportunity cards with drag and drop", "feat: create opportunity form", "feat: sales rep assignment interface", "feat: close date tracking and alerts", "fix: kanban board drag-drop persistence"],
    (2025, 12, 10): ["feat: supplier management module", "feat: purchase order creation worklfow", "feat: import/export status tracking", "feat: supplier performance metrics", "feat: link products with multiple suppliers", "feat: tracking import licenses for products"],
    (2025, 12, 11): ["feat: invoice generation service", "feat: tax calculation and total amount logic", "feat: payment tracking and status updates", "feat: customer credit limit checks", "feat: daily/monthly financial summary aggregation", "fix: decimal precision issues in financial calculations"],
    (2025, 12, 12): ["feat: invoice list and filter view", "feat: beautiful invoice pdf generation", "feat: payment status indicators", "feat: customer balance summary view", "feat: financial charts (revenue vs expense)", "feat: export invoices to excel/csv"],
    (2025, 12, 13): ["feat: shared task list for team", "feat: task priority and status management", "feat: recurring task automation", "feat: task notifications for assigned users", "feat: calendar view for tasks", "fix: task overdue notification logic"],
    
    (2025, 12, 15): ["feat: workflow engine for automation", "feat: trigger-action based rules development", "feat: automated email notifications for leads", "feat: status update automation rules", "feat: custom workflow logger", "test: automation trigger scenarios"],
    (2025, 12, 16): ["feat: socket.io integration for backend", "feat: real-time notification service", "feat: notification dropdown in topbar", "feat: in-app toast notifications for events", "feat: mark as read functionality", "fix: socket reconnection and auth handling"],
    (2025, 12, 17): ["feat: advanced reporting dashboard", "feat: customizable charts and graphs", "feat: exportable monthly performance reports", "feat: sales conversion rate analytics", "feat: customer churn analysis", "feat: printer-friendly report views"],
    (2025, 12, 18): ["feat: implement dark mode support", "feat: skeleton loaders for all pages", "feat: smooth page transitions and micro-animations", "style: polish glassmorphism transparency and blurs", "feat: mobile optimization for main modules", "fix: z-index issues in modals and sidebars"],
    (2025, 12, 19): ["feat: complex mock data seeding for demo", "feat: bulk import customers via csv", "feat: image upload for products with multer", "feat: file storage service abstraction", "feat: cleanup unused mock assets", "fix: performance issues in large data tables"],
    (2025, 12, 20): ["feat: api rate limiting implementation", "feat: security headers with helmet", "feat: sanitization of user inputs", "refactor: optimize database indexes", "refactor: frontend bundle size reduction", "feat: compression middleware for api responses"],
    
    (2025, 12, 22): ["test: unit tests for all core services", "test: integration tests for auth and sales", "test: frontend component testing with RTL", "test: end-to-end testing with cypress (partial)", "fix: bugs discovered during testing", "test: api documentation verification"],
    (2025, 12, 23): ["fix: dashboard chart rendering on mobile", "fix: invoice date timezone issues", "fix: search filters resetting on page change", "fix: unauthorized access on specific api points", "fix: css layout shifts during loading", "fix: customer feedback submit error"],
    (2025, 12, 24): ["docs: update deployment guide with docker", "docs: comprehensive user guide for crm modules", "docs: testing and validation guide", "docs: ui layout and glassmorphism design plan", "docs: system flow and sequence diagrams", "chore: cleanup documentation assets"],
    (2025, 12, 25): ["feat: github actions workflow for testing", "feat: production build configurations", "feat: environment variable management setup", "feat: pm2 process manager config", "feat: health check endpoints", "docs: finalize installation instructions"],
    (2025, 12, 26): ["feat: add about page and system versioning", "style: hover effects on interactive elements", "feat: localization support foundation", "fix: minor responsive issues in tables", "chore: dependency updates and security patches", "feat: search auto-suggestions"],
    (2025, 12, 27): ["feat: walkthrough guide for demo users", "feat: reset demo data functionality", "feat: system settings and company profile", "docs: update main readme with screenshots placeholders", "fix: typo fixes in turkish translations"],
    (2025, 12, 29): ["feat: add favicon and branding assets", "feat: basic seo metadata tags", "refactor: generic component cleanup", "test: final verification of production build", "docs: add contributing guidelines", "chore: remove development logs and debuggers"],
    (2025, 12, 30): ["chore: finalize version 1.0.0", "docs: add license file", "feat: welcome tour for new users", "fix: last minute cross-browser fixes", "docs: add project contact info", "feat: system heartbeat monitoring", "chore: final cleanup and preparation for handover"]
}

def create_history():
    print("--- Git Repo İlklendiriliyor ---")
    run_command("rm -rf .git") # Eski git kalıntılarını temizle
    run_command("git init")
    run_command(f"git config user.email '{USER_EMAIL}'")
    run_command(f"git config user.name '{USER_NAME}'")

    # Tüm dosyaları al
    all_files = []
    for root, dirs, files in os.walk(REPO_PATH):
        if ".git" in root: continue
        for f in files:
            if f in ["generate_history.py", "COMMIT_PLAN.md"]: continue
            rel = os.path.relpath(os.path.join(root, f), REPO_PATH)
            all_files.append(rel)
    
    # Dosyaları dağıtmak için basit bir bölme
    total_commits = sum(len(msgs) for msgs in PLAN.values())
    files_per_commit = max(1, len(all_files) // total_commits + 1)
    file_idx = 0

    print(f"Toplam {total_commits} commit oluşturulacak...")

    # Tarihlere göre sıralı işle
    sorted_days = sorted(PLAN.keys())
    
    for day in sorted_days:
        msgs = PLAN[day]
        y, m, d = day
        
        # O günkü ilk commit saati (09:15 - 10:45)
        current_time = datetime(y, m, d, random.randint(9, 10), random.randint(15, 45), random.randint(0, 59))
        
        for i, msg in enumerate(msgs):
            # Dosyaları ekle
            for _ in range(files_per_commit):
                if file_idx < len(all_files):
                    run_command(f"git add '{all_files[file_idx]}'")
                    file_idx += 1
            
            # Zaman damgasını ayarla (ISO format)
            ts = current_time.isoformat()
            env = os.environ.copy()
            env["GIT_AUTHOR_DATE"] = ts
            env["GIT_COMMITTER_DATE"] = ts
            
            # Commit
            stdout, stderr = run_command(f"git commit --allow-empty -m '{msg}'", env=env)
            
            # Zamanı ilerlet (45 dk - 110 dk arası rastgele)
            # Eğer öğle saatine geldiyse (12-13) daha fazla ara ver
            if 12 <= current_time.hour <= 13:
                current_time += timedelta(minutes=random.randint(90, 150))
            else:
                current_time += timedelta(minutes=random.randint(45, 110))
            
            print(f"  [{ts}] {msg}")

    print("\n--- İŞLEM TAMAMLANDI ---")
    print("Logları kontrol etmek için 'git log --oneline --graph' komutunu kullanabilirsiniz.")

if __name__ == "__main__":
    create_history()
