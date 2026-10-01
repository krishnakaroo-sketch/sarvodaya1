# Hostinger Deployment Guide for Sarvodaya Shikshan Mandal
**Website:** `https://ssmchandrapur.in/`

---

## 📁 1. Files Prepared for Deployment

All files required for hosting on Hostinger are ready in the root folder, the `dist/` build folder, and packaged in `sarvodaya_deployment.zip`:

1. **`database.sql`**:
   - Contains all **9 database tables** with `utf8mb4` Unicode charset for Marathi and English text support.
   - Includes seed data:
     - All **210 rich content blocks** (board members, president/secretary messages, mandal history, contact info, etc.)
     - All **11 educational institutions** and their contact directory
     - Active **announcements** and **events**
     - Career job openings
     - Admin login credentials
   - Includes complete schema for all tables:
     - `admins` (id, email, password_hash, role, created_at)
     - `content_blocks` (id, content, updated_at)
     - `announcements` (id, title, content, date, is_new, display_order, attachmentUrl, attachmentOriginalName, attachmentType, created_at)
     - `events` (id, date, month, title, location, display_order, created_at)
     - `institutions` (id, name, type, description, image_url, link, display_order, created_at)
     - `careers` (id, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType, created_at)
     - `job_applications` (id, applicationNumber, careerId, jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, photoUrl, signatureUrl, documentsUrl, documentsOriginalName, adminNotes, details, status, created_at)
     - `inquiries` (id, name, email, phone, program, message, status, created_at)
     - `alumni_registrations` (id, fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl, created_at)

2. **`api.php`**:
   - Production PHP backend configured with Hostinger MySQL database credentials:
     - **Host:** `localhost`
     - **Database:** `u855611336_Sarvodaya`
     - **User:** `u855611336_Sarvodaya`
     - **Password:** `Principal@Sarvodaya123`
   - Handles all API endpoints:
     - Authentication (`/api/auth/login`)
     - Admin Management (`/api/admins`)
     - Content Editing (`/api/content`)
     - Announcements & Attachments (`/api/announcements`, `/api/announcements/upload-attachment`)
     - Events Calendar (`/api/events`)
     - Institutions Directory (`/api/institutions`)
     - Careers & Official Advertisement Notifications (`/api/careers`, `/api/careers/advertisement`, `/api/careers/upload-attachment`)
     - Online Job Applications (`/api/job-applications`, `/api/job-applications/:id/status`)
     - Public Inquiries (`/api/inquiries`)
     - Alumni Registration & Public Directory (`/api/alumni`, `/api/alumni/public`, `/api/alumni/register`, `/api/alumni/upload-photo`)
     - Dedicated File Downloads Service (`/api/downloads/:filename?name=...`)
     - Database Backup (`/api/backup`)

3. **`.htaccess`**:
   - Configures Apache/LiteSpeed URL rewrites so `/api/*` routes are handled by `api.php`, and React SPA client routing works smoothly on page reload.
   - Passes `HTTP_AUTHORIZATION` headers securely to PHP for admin logins.
   - Protects sensitive database backup files from direct web access.
   - Sets default charset to UTF-8 for Marathi text.

4. **`dist/`** (Compiled production frontend):
   - Contains `index.html`, `assets/`, `images/`, `uploads/`, `api.php`, `.htaccess`, and `database.sql`.

---

## 🗄️ 2. Import Database in Hostinger phpMyAdmin

1. Log in to your **Hostinger hPanel** (`hpanel.hostinger.com`).
2. Go to **Databases** > **phpMyAdmin** and click **Enter phpMyAdmin** next to `u855611336_Sarvodaya`.
3. In phpMyAdmin, click on the database name `u855611336_Sarvodaya` on the left sidebar.
4. Click on the **Import** tab in the top navigation bar.
5. Click **Choose File** (or Browse) and select `database.sql`.
6. Ensure the character set is set to **utf-8** (or `utf8mb4`).
7. Scroll to the bottom and click **Import** (or **Go**).
8. You will see a success message: *Import has been successfully finished, queries executed / tables created.*

The following 9 tables will be present:
- `admins`
- `content_blocks`
- `announcements`
- `events`
- `institutions`
- `careers`
- `job_applications`
- `inquiries`
- `alumni_registrations`

---

## 🌐 3. Upload Files to Hostinger File Manager

1. In **Hostinger hPanel**, open **File Manager**.
2. Navigate to the root directory for your domain **`https://ssmchandrapur.in/`**:
   - Usually `public_html` (or `domains/ssmchandrapur.in/public_html`).
3. You can either:
   - **Option A (Fastest)**: Upload `sarvodaya_deployment.zip`, right-click on it in Hostinger File Manager, and click **Extract**.
   - **Option B**: Upload the contents of the **`dist`** folder directly into `public_html`:
     - `index.html`
     - `.htaccess` *(Note: Files starting with a dot might be hidden; ensure "Show hidden files" is enabled in Hostinger File Manager settings)*
     - `api.php`
     - `assets/` (folder and all JS/CSS files inside)
     - `images/` (folder and all image files inside)
     - `uploads/` (folder for uploaded resumes, photos, and PDFs)
4. Right-click the **`uploads`** folder in File Manager, click **Permissions**, and ensure it has write permissions (`755` or `775`).

---

## 🔐 4. Admin Login Credentials

Once deployed, access the admin panel at:
`https://ssmchandrapur.in/admin`

You can log in with:
- **Username / Email:** `admin`
- **Password:** `admin` *(or `Pass`)*

*(Alternative master account: `admin@ssm.edu` / `password123`)*

Inside the Admin panel, you can update content, announcements, events, board member photos, job postings, download submitted resumes, and manage alumni registrations. All changes will be saved directly into your Hostinger MySQL database.

---

## 📱 5. Mobile Responsiveness & Feature Verification

The application is built with a responsive mobile-first architecture:
- Responsive sticky top navigation bar with toggle hamburger menu
- Compact language switcher for fast toggle on mobile screens (Marathi / English)
- Responsive cards and grids across all 11 institutions, management board, and news
- Mobile-friendly job application form and directory tables with touch-friendly scroll wrappers
- Direct file download endpoints with original document naming for HR and administrators

