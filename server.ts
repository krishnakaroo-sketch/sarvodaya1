import express from "express";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fsSync from "fs";
import multer from "multer";

dotenv.config();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

// Multer diskStorage with preserved extensions
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `${base || "upload"}-${uniqueSuffix}${ext || ".bin"}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 } // 30MB max upload
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "SarvodayaSchoolSecretKey2026!@#";

// LOCAL JSON FALLBACK SETUP
const LOCAL_DB_PATH = path.join(process.cwd(), "local.json");
function loadLocalData() {
  if (fsSync.existsSync(LOCAL_DB_PATH)) {
    try {
      return JSON.parse(fsSync.readFileSync(LOCAL_DB_PATH, "utf-8"));
    } catch (e) {
      console.error("Error reading local.json:", e);
    }
  }
  const initial = {
    admins: [
      { id: 1, email: "Admin", password_hash: bcrypt.hashSync("Pass", 10), role: "master" }
    ],
    content: {},
    announcements: [
      { id: 1, title: "Admissions Open for Academic Year 2026-27", content: "Admissions are now actively open across all Sarvodaya institutions and colleges. Contact our administrative office for prospectus and counseling.", date: "March 2026", isNew: true, order: 1 }
    ],
    events: [
      { id: 1, date: "15", month: "APR", title: "Annual State-Level Science & Tech Exhibition", location: "Central Campus Auditorium", order: 1 }
    ],
    institutions: [],
    careers: [],
    jobApplications: [],
    inquiries: []
  };
  fsSync.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2));
  return initial;
}

let localData = loadLocalData();
function saveLocalData() {
  fsSync.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localData, null, 2));
}

// DATABASE CONFIGURATION
let USE_MYSQL = !!process.env.DB_HOST && !!process.env.DB_USER;
let pool: any;

if (USE_MYSQL) {
  console.log("🚀 Starting in MySQL Mode (Hostinger/Production)");
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // INITIALIZE TABLES IF THEY DON'T EXIST
  (async () => {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Connected to MySQL Database");

      await connection.query(`CREATE TABLE IF NOT EXISTS admins (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255), role VARCHAR(50) DEFAULT 'admin')`);
      try { await connection.query("ALTER TABLE admins ADD COLUMN role VARCHAR(50) DEFAULT 'admin'"); } catch {}
      await connection.query(`CREATE TABLE IF NOT EXISTS content_blocks (id VARCHAR(255) PRIMARY KEY, content TEXT)`);
      await connection.query(`CREATE TABLE IF NOT EXISTS announcements (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), content TEXT, date VARCHAR(50), is_new BOOLEAN DEFAULT 0, display_order INT DEFAULT 0, attachmentUrl TEXT, attachmentOriginalName VARCHAR(255), attachmentType VARCHAR(50))`);
      try { await connection.query("ALTER TABLE announcements ADD COLUMN attachmentUrl TEXT"); } catch {}
      try { await connection.query("ALTER TABLE announcements ADD COLUMN attachmentOriginalName VARCHAR(255)"); } catch {}
      try { await connection.query("ALTER TABLE announcements ADD COLUMN attachmentType VARCHAR(50)"); } catch {}
      await connection.query(`CREATE TABLE IF NOT EXISTS events (id INT AUTO_INCREMENT PRIMARY KEY, date VARCHAR(50), month VARCHAR(50), title VARCHAR(255), location VARCHAR(255), display_order INT DEFAULT 0)`);
      await connection.query(`CREATE TABLE IF NOT EXISTS institutions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), type VARCHAR(100), description TEXT, image_url TEXT, link VARCHAR(255), display_order INT DEFAULT 0)`);
      await connection.query(`CREATE TABLE IF NOT EXISTS inquiries (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), program VARCHAR(255), message TEXT, status VARCHAR(50) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await connection.query(`CREATE TABLE IF NOT EXISTS careers (id VARCHAR(255) PRIMARY KEY, title VARCHAR(255), department VARCHAR(100), location VARCHAR(100), type VARCHAR(50), description TEXT, requirements TEXT, advertisementUrl TEXT, advertisementOriginalName VARCHAR(255), advertisementType VARCHAR(50))`);
      try { await connection.query("ALTER TABLE careers ADD COLUMN advertisementUrl TEXT"); } catch {}
      try { await connection.query("ALTER TABLE careers ADD COLUMN advertisementOriginalName VARCHAR(255)"); } catch {}
      try { await connection.query("ALTER TABLE careers ADD COLUMN advertisementType VARCHAR(50)"); } catch {}
      await connection.query(`CREATE TABLE IF NOT EXISTS job_applications (id VARCHAR(255) PRIMARY KEY, careerId VARCHAR(255), jobTitle VARCHAR(255), name VARCHAR(200), email VARCHAR(255), phone VARCHAR(50), coverLetter TEXT, resumeUrl VARCHAR(1000), resumeOriginalName VARCHAR(255), status VARCHAR(50) DEFAULT 'new', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await connection.query(`CREATE TABLE IF NOT EXISTS alumni_registrations (id INT AUTO_INCREMENT PRIMARY KEY, fullName VARCHAR(255), email VARCHAR(255), phone VARCHAR(50), dob VARCHAR(50), gender VARCHAR(50), institution VARCHAR(255), passingYear VARCHAR(50), degree VARCHAR(255), profession VARCHAR(255), company VARCHAR(255), designation VARCHAR(255), location VARCHAR(255), linkedin VARCHAR(500), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);

      try { await connection.query("ALTER TABLE alumni_registrations ADD COLUMN photoUrl TEXT"); } catch {}
      
      // CREATE DEFAULT ADMIN IF EMPTY
      const [rows] = await connection.query("SELECT * FROM admins");
      if (rows.length === 0) {
        const hash = bcrypt.hashSync("admin", 10);
        await connection.query("INSERT INTO admins (email, password_hash, role) VALUES (?, ?, ?)", ["admin", hash, "master"]);
        console.log("Created default MySQL Admin user");
      }
      connection.release();
    } catch (e) {
      console.error("MySQL Initialization Error:", e);
      console.log("⚠️ Falling back to Local JSON mode due to MySQL error.");
      USE_MYSQL = false;
    }
  })();
} else {
  console.log("📁 Starting in Local Fallback Mode (using local.json)");
}

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// 1. Auth Routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanEmail = (email || "").trim();
    const cleanPass = (password || "").toString();

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ error: "Please enter both username and password" });
    }

    let admin: any = null;
    if (USE_MYSQL) {
      const [rows]: any = await pool.query(
        "SELECT * FROM admins WHERE LOWER(TRIM(email)) = LOWER(?) OR email = ? LIMIT 1",
        [cleanEmail, cleanEmail]
      );
      if (rows.length > 0) admin = rows[0];
    } else {
      admin = (localData.admins || []).find(
        (a: any) => (a.email || "").trim().toLowerCase() === cleanEmail.toLowerCase()
      );
    }

    if (!admin) return res.status(401).json({ error: "Invalid username or password" });

    let validPassword = false;
    const storedHash = (admin.password_hash || "").toString();

    // Check bcrypt hash
    if (storedHash) {
      try {
        const bcryptHash = storedHash.startsWith("$2b$") 
          ? "$2a$" + storedHash.slice(4) 
          : storedHash.startsWith("$2y$") 
            ? "$2a$" + storedHash.slice(4) 
            : storedHash;
        validPassword = await bcrypt.compare(cleanPass, bcryptHash);
      } catch (e) {
        // Fallback check
      }
      
      // Plain text check if stored unhashed in database
      if (!validPassword && storedHash === cleanPass) {
        validPassword = true;
      }
    }

    if (!validPassword) return res.status(401).json({ error: "Invalid username or password" });

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role || "admin" }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: admin.id, email: admin.email, role: admin.role || "admin" } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// 2. Content Blocks
app.get("/api/content", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const contentMap: Record<string, string> = {};
      const [rows]: any = await pool.query("SELECT id, content FROM content_blocks");
      for (const row of rows) contentMap[row.id] = row.content;
      res.json(contentMap);
    } else {
      res.json(localData.content || {});
    }
  } catch (error: any) {
    console.error("Fetch content error:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

app.post("/api/content", authenticateToken, async (req, res) => {
  const { id, content } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "INSERT INTO content_blocks (id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?",
        [id, content, content]
      );
    } else {
      localData.content = localData.content || {};
      localData.content[id] = content;
      saveLocalData();
    }
    res.json({ success: true, id, content });
  } catch (error: any) {
    console.error("Save content error:", error);
    res.status(500).json({ error: "Failed to save content" });
  }
});

// 3. Announcements
app.get("/api/announcements", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query(
        "SELECT * FROM announcements ORDER BY display_order ASC, date DESC"
      );
      res.json(rows.map((r: any) => ({
        ...r,
        isNew: r.is_new === 1,
        order: r.display_order,
        attachmentUrl: r.attachmentUrl || null,
        attachmentOriginalName: r.attachmentOriginalName || null,
        attachmentType: r.attachmentType || null
      })));
    } else {
      const list = [...(localData.announcements || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      res.json(list);
    }
  } catch (error: any) {
    console.error("Fetch announcements error:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// Dedicated upload route for Announcement attachment (PDF or JPG/JPEG/PNG)
app.post("/api/announcements/upload-attachment", authenticateToken, upload.any(), async (req, res) => {
  try {
    const file = req.file || (req.files && (req.files as any[])[0]);
    if (!file) {
      return res.status(400).json({ error: "No PDF or image file uploaded" });
    }
    const fileUrl = `/uploads/${file.filename}`;
    const originalName = file.originalname;
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    const isImage = file.mimetype.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);
    const fileType = isPdf ? 'pdf' : (isImage ? 'image' : 'file');

    res.json({
      success: true,
      url: fileUrl,
      originalName,
      fileType,
      size: file.size
    });
  } catch (err: any) {
    console.error("Announcement attachment upload error:", err);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
});

app.post("/api/announcements", authenticateToken, async (req, res) => {
  const { title, content, date, isNew, order, attachmentUrl, attachmentOriginalName, attachmentType } = req.body;
  try {
    if (USE_MYSQL) {
      const [result]: any = await pool.query(
        "INSERT INTO announcements (title, content, date, is_new, display_order, attachmentUrl, attachmentOriginalName, attachmentType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [title, content, date, isNew ? 1 : 0, order || 0, attachmentUrl || null, attachmentOriginalName || null, attachmentType || null]
      );
      res.json({ id: result.insertId, title, content, date, isNew, order, attachmentUrl, attachmentOriginalName, attachmentType });
    } else {
      const newId = Date.now();
      const newRecord = {
        id: newId,
        title,
        content,
        date,
        isNew: !!isNew,
        order: order || 0,
        attachmentUrl: attachmentUrl || null,
        attachmentOriginalName: attachmentOriginalName || null,
        attachmentType: attachmentType || (attachmentUrl && attachmentUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
      };
      localData.announcements = localData.announcements || [];
      localData.announcements.push(newRecord);
      saveLocalData();
      res.json(newRecord);
    }
  } catch (error: any) {
    console.error("Save announcement error:", error);
    res.status(500).json({ error: "Failed to save announcement" });
  }
});

app.put("/api/announcements/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, date, isNew, order, attachmentUrl, attachmentOriginalName, attachmentType } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "UPDATE announcements SET title = ?, content = ?, date = ?, is_new = ?, display_order = ?, attachmentUrl = ?, attachmentOriginalName = ?, attachmentType = ? WHERE id = ?",
        [title, content, date, isNew ? 1 : 0, order || 0, attachmentUrl || null, attachmentOriginalName || null, attachmentType || null, id]
      );
    } else {
      localData.announcements = (localData.announcements || []).map((a: any) =>
        String(a.id) === String(id)
          ? {
              ...a,
              title,
              content,
              date,
              isNew: !!isNew,
              order: order || 0,
              attachmentUrl: attachmentUrl !== undefined ? attachmentUrl : a.attachmentUrl,
              attachmentOriginalName: attachmentOriginalName !== undefined ? attachmentOriginalName : a.attachmentOriginalName,
              attachmentType: attachmentType !== undefined ? attachmentType : a.attachmentType
            }
          : a
      );
      saveLocalData();
    }
    res.json({ id, title, content, date, isNew, order, attachmentUrl, attachmentOriginalName, attachmentType });
  } catch (error: any) {
    console.error("Update announcement error:", error);
    res.status(500).json({ error: "Failed to update announcement" });
  }
});

app.delete("/api/announcements/:id", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM announcements WHERE id = ?", [req.params.id]);
    } else {
      localData.announcements = (localData.announcements || []).filter(
        (a: any) => String(a.id) !== String(req.params.id)
      );
      saveLocalData();
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete announcement error:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});

// 4. Events
app.get("/api/events", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query("SELECT * FROM events ORDER BY display_order ASC");
      res.json(rows.map((r: any) => ({ ...r, order: r.display_order })));
    } else {
      const list = [...(localData.events || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      res.json(list);
    }
  } catch (error: any) {
    console.error("Fetch events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post("/api/events", authenticateToken, async (req, res) => {
  const { date, month, title, location, order } = req.body;
  try {
    if (USE_MYSQL) {
      const [result]: any = await pool.query(
        "INSERT INTO events (date, month, title, location, display_order) VALUES (?, ?, ?, ?, ?)",
        [date, month, title, location, order || 0]
      );
      res.json({ id: result.insertId, date, month, title, location, order });
    } else {
      const newRecord = { id: Date.now(), date, month, title, location, order: order || 0 };
      localData.events = localData.events || [];
      localData.events.push(newRecord);
      saveLocalData();
      res.json(newRecord);
    }
  } catch (error: any) {
    console.error("Save event error:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

app.put("/api/events/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { date, month, title, location, order } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "UPDATE events SET date = ?, month = ?, title = ?, location = ?, display_order = ? WHERE id = ?",
        [date, month, title, location, order || 0, id]
      );
    } else {
      localData.events = (localData.events || []).map((e: any) =>
        String(e.id) === String(id) ? { ...e, date, month, title, location, order: order || 0 } : e
      );
      saveLocalData();
    }
    res.json({ id, date, month, title, location, order });
  } catch (error: any) {
    console.error("Update event error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

app.delete("/api/events/:id", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM events WHERE id = ?", [req.params.id]);
    } else {
      localData.events = (localData.events || []).filter(
        (e: any) => String(e.id) !== String(req.params.id)
      );
      saveLocalData();
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// 5. Institutions
app.get("/api/institutions", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query("SELECT * FROM institutions ORDER BY display_order ASC");
      res.json(rows.map((r: any) => ({ ...r, imageUrl: r.image_url, order: r.display_order })));
    } else {
      const list = [...(localData.institutions || [])].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      res.json(list);
    }
  } catch (error: any) {
    console.error("Fetch institutions error:", error);
    res.status(500).json({ error: "Failed to fetch institutions" });
  }
});

app.post("/api/institutions", authenticateToken, async (req, res) => {
  const { name, type, description, imageUrl, link, order } = req.body;
  try {
    if (USE_MYSQL) {
      const [result]: any = await pool.query(
        "INSERT INTO institutions (name, type, description, image_url, link, display_order) VALUES (?, ?, ?, ?, ?, ?)",
        [name, type, description, imageUrl, link, order || 0]
      );
      res.json({ id: result.insertId, name, type, description, imageUrl, link, order });
    } else {
      const newRecord = { id: Date.now(), name, type, description, imageUrl, link, order: order || 0 };
      localData.institutions = localData.institutions || [];
      localData.institutions.push(newRecord);
      saveLocalData();
      res.json(newRecord);
    }
  } catch (error: any) {
    console.error("Save institution error:", error);
    res.status(500).json({ error: "Failed to save institution" });
  }
});

app.put("/api/institutions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, type, description, imageUrl, link, order } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "UPDATE institutions SET name = ?, type = ?, description = ?, image_url = ?, link = ?, display_order = ? WHERE id = ?",
        [name, type, description, imageUrl, link, order || 0, id]
      );
    } else {
      localData.institutions = (localData.institutions || []).map((i: any) =>
        String(i.id) === String(id) ? { ...i, name, type, description, imageUrl, link, order: order || 0 } : i
      );
      saveLocalData();
    }
    res.json({ id, name, type, description, imageUrl, link, order });
  } catch (error: any) {
    console.error("Update institution error:", error);
    res.status(500).json({ error: "Failed to update institution" });
  }
});

app.delete("/api/institutions/:id", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM institutions WHERE id = ?", [req.params.id]);
    } else {
      localData.institutions = (localData.institutions || []).filter(
        (i: any) => String(i.id) !== String(req.params.id)
      );
      saveLocalData();
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete institution error:", error);
    res.status(500).json({ error: "Failed to delete institution" });
  }
});

// 6. Careers
app.get("/api/careers", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query("SELECT * FROM careers");
      res.json(rows);
    } else {
      res.json(localData.careers || []);
    }
  } catch (error: any) {
    console.error("Fetch careers error:", error);
    res.status(500).json({ error: "Failed to fetch careers" });
  }
});

app.post("/api/careers", authenticateToken, async (req, res) => {
  const { id, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType } = req.body;
  const newId = id || Math.random().toString(36).substr(2, 9);
  try {
    if (USE_MYSQL) {
      await pool.query(
        "INSERT INTO careers (id, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [newId, title, department, location, type, description, requirements, advertisementUrl || null, advertisementOriginalName || null, advertisementType || null]
      );
    } else {
      localData.careers = localData.careers || [];
      localData.careers.push({ id: newId, title, department, location, type, description, requirements, advertisementUrl: advertisementUrl || null, advertisementOriginalName: advertisementOriginalName || null, advertisementType: advertisementType || null });
      saveLocalData();
    }
    res.json({ id: newId, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType });
  } catch (error: any) {
    console.error("Save career error:", error);
    res.status(500).json({ error: "Failed to save career" });
  }
});

app.put("/api/careers/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "UPDATE careers SET title=?, department=?, location=?, type=?, description=?, requirements=?, advertisementUrl=?, advertisementOriginalName=?, advertisementType=? WHERE id=?",
        [title, department, location, type, description, requirements, advertisementUrl || null, advertisementOriginalName || null, advertisementType || null, id]
      );
    } else {
      localData.careers = (localData.careers || []).map((c: any) =>
        String(c.id) === String(id) ? { ...c, title, department, location, type, description, requirements, advertisementUrl: advertisementUrl || null, advertisementOriginalName: advertisementOriginalName || null, advertisementType: advertisementType || null } : c
      );
      saveLocalData();
    }
    res.json({ id, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType });
  } catch (error: any) {
    console.error("Update career error:", error);
    res.status(500).json({ error: "Failed to update career" });
  }
});

app.delete("/api/careers/:id", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM careers WHERE id = ?", [req.params.id]);
    } else {
      localData.careers = (localData.careers || []).filter(
        (c: any) => String(c.id) !== String(req.params.id)
      );
      saveLocalData();
    }
    res.json({ success: true, message: "Career opening deleted successfully" });
  } catch (error: any) {
    console.error("Delete career error:", error);
    res.status(500).json({ error: "Failed to delete career" });
  }
});

// Dedicated upload route for Career Opening Advertisement (PDF or JPEG/PNG image)
app.post("/api/careers/upload-attachment", authenticateToken, upload.any(), async (req, res) => {
  try {
    const file = req.file || (req.files && (req.files as any[])[0]);
    if (!file) {
      return res.status(400).json({ error: "No PDF or image file uploaded" });
    }
    const fileUrl = `/uploads/${file.filename}`;
    const originalName = file.originalname;
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    const isImage = file.mimetype.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);
    const fileType = isPdf ? 'pdf' : (isImage ? 'image' : 'file');

    res.json({
      success: true,
      url: fileUrl,
      originalName,
      fileType,
      size: file.size
    });
  } catch (error: any) {
    console.error("Upload career advertisement error:", error);
    res.status(500).json({ error: "Failed to upload advertisement file" });
  }
});

// 7. Job Applications & Uploads
app.use("/uploads", express.static(uploadDir));

// Resume download endpoint with original filename
app.get("/api/downloads/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(uploadDir, safeFilename);
  if (!fsSync.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }
  const downloadName = (req.query.name as string) || safeFilename;
  res.download(filePath, downloadName, (err) => {
    if (err && !res.headersSent) {
      res.status(500).send("Download failed");
    }
  });
});

app.get("/api/job-applications", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query("SELECT * FROM job_applications ORDER BY created_at DESC");
      res.json(rows);
    } else {
      res.json(localData.jobApplications || []);
    }
  } catch (error: any) {
    console.error("Fetch job applications error:", error);
    res.status(500).json({ error: "Failed to fetch job applications" });
  }
});

// Comprehensive Multi-file & Detailed Job Application submission
app.post(
  "/api/job-applications",
  (req, res, next) => {
    upload.any()(req, res, (err: any) => {
      if (err) {
        console.error("Multer upload error in /api/job-applications:", err);
        return res.status(400).json({ 
          error: `File upload error: ${err.message || 'File upload failed. Please ensure files are under 30MB.'}` 
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const allFiles = (req.files as Express.Multer.File[]) || [];
      const resumeFile = allFiles.find(f => f.fieldname === "resume");
      const photoFile = allFiles.find(f => f.fieldname === "photo");
      const signatureFile = allFiles.find(f => f.fieldname === "signature");
      const docFile = allFiles.find(f => f.fieldname === "documents" || f.fieldname === "document");

      const newId = Math.random().toString(36).substr(2, 9);
      const appYear = new Date().getFullYear();
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const applicationNumber = req.body.applicationNumber || `SSM-${appYear}-REC-${randomCode}`;

      const resumeUrl = resumeFile ? `/uploads/${resumeFile.filename}` : (req.body.resumeUrl || null);
      const resumeOriginalName = resumeFile ? resumeFile.originalname : (req.body.resumeOriginalName || null);
      const photoUrl = photoFile ? `/uploads/${photoFile.filename}` : (req.body.photoUrl || null);
      const signatureUrl = signatureFile ? `/uploads/${signatureFile.filename}` : (req.body.signatureUrl || null);
      const documentsUrl = docFile ? `/uploads/${docFile.filename}` : (req.body.documentsUrl || null);
      const documentsOriginalName = docFile ? docFile.originalname : (req.body.documentsOriginalName || null);

      // Parse structured details
      let parsedQualifications = [];
      try {
        parsedQualifications = typeof req.body.qualifications === "string" 
          ? JSON.parse(req.body.qualifications) 
          : (req.body.qualifications || []);
      } catch (e) {
        parsedQualifications = [];
      }

      let parsedExperience = [];
      try {
        parsedExperience = typeof req.body.experience === "string" 
          ? JSON.parse(req.body.experience) 
          : (req.body.experience || []);
      } catch (e) {
        parsedExperience = [];
      }

      const applicationRecord = {
        id: newId,
        applicationNumber,
        careerId: req.body.careerId || "",
        jobTitle: req.body.jobTitle || "General Application",
        institutionPreference: req.body.institutionPreference || "",
        specialization: req.body.specialization || "",
        
        // Personal Details
        name: req.body.name || "",
        nameMarathi: req.body.nameMarathi || "",
        fatherOrHusbandName: req.body.fatherOrHusbandName || "",
        motherName: req.body.motherName || "",
        dob: req.body.dob || "",
        age: req.body.age || "",
        gender: req.body.gender || "Not Specified",
        maritalStatus: req.body.maritalStatus || "Unmarried",
        nationality: req.body.nationality || "Indian",
        domicile: req.body.domicile || "Yes",
        category: req.body.category || "OPEN",
        casteValidity: req.body.casteValidity || "Not Applicable",
        pwd: req.body.pwd || "No",
        aadhaar: req.body.aadhaar || "",
        pan: req.body.pan || "",

        // Contact & Communication
        email: req.body.email || "",
        phone: req.body.phone || "",
        alternatePhone: req.body.alternatePhone || "",
        address: req.body.address || "",
        city: req.body.city || "",
        district: req.body.district || "",
        state: req.body.state || "Maharashtra",
        pincode: req.body.pincode || "",
        correspondenceAddress: req.body.correspondenceAddress || req.body.address || "",

        // Qualifications & Experience
        qualifications: parsedQualifications,
        experience: parsedExperience,
        totalExperienceYears: req.body.totalExperienceYears || "0",
        currentOrganization: req.body.currentOrganization || "",
        currentDesignation: req.body.currentDesignation || "",
        publications: req.body.publications || "",
        coverLetter: req.body.coverLetter || "",

        // Files
        resumeUrl,
        resumeOriginalName,
        photoUrl,
        signatureUrl,
        documentsUrl,
        documentsOriginalName,

        status: "new",
        created_at: new Date().toISOString()
      };

      const fullDetailsJson = JSON.stringify(applicationRecord);

      if (USE_MYSQL) {
        // Try inserting with extended details column if available
        try {
          await pool.query(
            "INSERT INTO job_applications (id, careerId, jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, status, details, applicationNumber, photoUrl, documentsUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)",
            [
              newId,
              applicationRecord.careerId,
              applicationRecord.jobTitle,
              applicationRecord.name,
              applicationRecord.email,
              applicationRecord.phone,
              applicationRecord.coverLetter,
              resumeUrl,
              resumeOriginalName,
              fullDetailsJson,
              applicationNumber,
              photoUrl,
              documentsUrl
            ]
          );
        } catch (dbErr: any) {
          // Fallback if extended columns do not exist yet in existing MySQL table
          console.warn("MySQL extended insert failed, falling back to standard columns:", dbErr.message);
          await pool.query(
            "INSERT INTO job_applications (id, careerId, jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            [
              newId,
              applicationRecord.careerId,
              applicationRecord.jobTitle,
              applicationRecord.name,
              applicationRecord.email,
              applicationRecord.phone,
              applicationRecord.coverLetter,
              resumeUrl,
              resumeOriginalName
            ]
          );
        }
      } else {
        localData.jobApplications = localData.jobApplications || [];
        localData.jobApplications.unshift(applicationRecord);
        saveLocalData();
      }

      res.json({
        success: true,
        id: newId,
        applicationNumber,
        data: applicationRecord
      });
    } catch (error: any) {
      console.error("Save job application error:", error);
      res.status(500).json({ error: error.message || "Failed to save application" });
    }
  }
);

// Update Application Status (Shortlisted / Interviewed / Selected / Rejected)
app.patch(["/api/job-applications/:id/status", "/api/job-applications/:id"], authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query("UPDATE job_applications SET status = ? WHERE id = ?", [status, id]);
    } else {
      localData.jobApplications = (localData.jobApplications || []).map((app: any) =>
        String(app.id) === String(id)
          ? { ...app, status, adminNotes: adminNotes ?? app.adminNotes, updated_at: new Date().toISOString() }
          : app
      );
      saveLocalData();
    }
    res.json({ success: true, id, status, adminNotes });
  } catch (error: any) {
    console.error("Update job application status error:", error);
    res.status(500).json({ error: "Failed to update application status" });
  }
});

app.delete("/api/job-applications/:id", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM job_applications WHERE id = ?", [req.params.id]);
    } else {
      localData.jobApplications = (localData.jobApplications || []).filter(
        (a: any) => String(a.id) !== String(req.params.id)
      );
      saveLocalData();
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete job application error:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
});

// Recruitment Advertisement (PDF / JPEG Image) Upload & Management
app.get("/api/careers/advertisement", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query(
        "SELECT id, content FROM content_blocks WHERE id IN ('Careers_Advertisement_PDF_URL', 'Careers_Advertisement_URL', 'Careers_Advertisement_Title', 'Careers_Advertisement_OriginalName', 'Careers_Advertisement_UploadedAt', 'Careers_Advertisement_Type')"
      );
      const map: Record<string, string> = {};
      rows.forEach((r: any) => { map[r.id] = r.content; });
      const url = map["Careers_Advertisement_URL"] || map["Careers_Advertisement_PDF_URL"] || null;
      const fileType = map["Careers_Advertisement_Type"] || (url && url.toLowerCase().endsWith('.pdf') ? 'pdf' : (url ? 'image' : null));
      res.json({
        url,
        pdfUrl: url,
        fileType,
        hasFile: Boolean(url),
        hasPdf: fileType === 'pdf',
        title: map["Careers_Advertisement_Title"] || "अधिकृत भरती जाहिरात (Official Recruitment Advertisement)",
        originalName: map["Careers_Advertisement_OriginalName"] || null,
        uploadedAt: map["Careers_Advertisement_UploadedAt"] || null
      });
    } else {
      const content = localData.content || {};
      const url = content["Careers_Advertisement_URL"] || content["Careers_Advertisement_PDF_URL"] || null;
      const fileType = content["Careers_Advertisement_Type"] || (url && url.toLowerCase().endsWith('.pdf') ? 'pdf' : (url ? 'image' : null));
      res.json({
        url,
        pdfUrl: url,
        fileType,
        hasFile: Boolean(url),
        hasPdf: fileType === 'pdf',
        title: content["Careers_Advertisement_Title"] || "अधिकृत भरती जाहिरात (Official Recruitment Advertisement)",
        originalName: content["Careers_Advertisement_OriginalName"] || null,
        uploadedAt: content["Careers_Advertisement_UploadedAt"] || null
      });
    }
  } catch (error: any) {
    console.error("Fetch advertisement error:", error);
    res.status(500).json({ error: "Failed to fetch advertisement metadata" });
  }
});

app.post(
  "/api/careers/advertisement",
  authenticateToken,
  upload.any(),
  async (req, res) => {
    try {
      const file = req.file || (req.files && (req.files as any[])[0]);
      if (!file) {
        return res.status(400).json({ error: "No PDF or image file uploaded" });
      }
      const fileUrl = `/uploads/${file.filename}`;
      const originalName = file.originalname;
      const title = req.body.title || "अधिकृत भरती जाहिरात (Official Recruitment Advertisement)";
      const uploadedAt = new Date().toISOString();
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      const fileType = isPdf ? 'pdf' : 'image';

      if (USE_MYSQL) {
        await pool.query(
          "INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_PDF_URL', ?), ('Careers_Advertisement_URL', ?), ('Careers_Advertisement_Type', ?), ('Careers_Advertisement_Title', ?), ('Careers_Advertisement_OriginalName', ?), ('Careers_Advertisement_UploadedAt', ?) ON DUPLICATE KEY UPDATE content = VALUES(content)",
          [fileUrl, fileUrl, fileType, title, originalName, uploadedAt]
        );
      } else {
        localData.content = localData.content || {};
        localData.content["Careers_Advertisement_PDF_URL"] = fileUrl;
        localData.content["Careers_Advertisement_URL"] = fileUrl;
        localData.content["Careers_Advertisement_Type"] = fileType;
        localData.content["Careers_Advertisement_Title"] = title;
        localData.content["Careers_Advertisement_OriginalName"] = originalName;
        localData.content["Careers_Advertisement_UploadedAt"] = uploadedAt;
        saveLocalData();
      }

      res.json({
        success: true,
        url: fileUrl,
        pdfUrl: fileUrl,
        fileType,
        hasFile: true,
        hasPdf: isPdf,
        title,
        originalName,
        uploadedAt
      });
    } catch (error: any) {
      console.error("Upload advertisement error:", error);
      res.status(500).json({ error: "Failed to upload advertisement file" });
    }
  }
);

app.delete("/api/careers/advertisement", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      await pool.query(
        "DELETE FROM content_blocks WHERE id IN ('Careers_Advertisement_PDF_URL', 'Careers_Advertisement_URL', 'Careers_Advertisement_Type', 'Careers_Advertisement_Title', 'Careers_Advertisement_OriginalName', 'Careers_Advertisement_UploadedAt')"
      );
    } else {
      if (localData.content) {
        delete localData.content["Careers_Advertisement_PDF_URL"];
        delete localData.content["Careers_Advertisement_URL"];
        delete localData.content["Careers_Advertisement_Type"];
        delete localData.content["Careers_Advertisement_Title"];
        delete localData.content["Careers_Advertisement_OriginalName"];
        delete localData.content["Careers_Advertisement_UploadedAt"];
        saveLocalData();
      }
    }
    res.json({ success: true, message: "Advertisement removed successfully" });
  } catch (error: any) {
    console.error("Delete advertisement error:", error);
    res.status(500).json({ error: "Failed to delete advertisement" });
  }
});

// 8. Contact Inquiries
app.get("/api/inquiries", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows]: any = await pool.query("SELECT * FROM inquiries ORDER BY created_at DESC");
      res.json(rows);
    } else {
      res.json(localData.inquiries || []);
    }
  } catch (error: any) {
    console.error("Fetch inquiries error:", error);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

// Alumni Endpoints
app.post("/api/alumni/upload-photo", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No photo uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.post("/api/alumni/register", async (req, res) => {
  const { fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl } = req.body;
  try {
    if (USE_MYSQL) {
      await pool.query(
        "INSERT INTO alumni_registrations (fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl]
      );
    } else {
      if (!localData.alumniRegistrations) localData.alumniRegistrations = [];
      localData.alumniRegistrations.push({
        id: Math.random().toString(36).substr(2, 9),
        fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl,
        created_at: new Date().toISOString()
      });
      saveLocalData();
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error registering alumni:", err);
    res.status(500).json({ error: "Failed to register alumni" });
  }
});

app.delete("/api/alumni/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (USE_MYSQL) {
      await pool.query("DELETE FROM alumni_registrations WHERE id = ?", [id]);
    } else {
      if (localData.alumniRegistrations) {
        localData.alumniRegistrations = localData.alumniRegistrations.filter((a: any) => String(a.id) !== String(id));
        saveLocalData();
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting alumni:", err);
    res.status(500).json({ error: "Failed to delete alumni record" });
  }
});

app.get("/api/alumni/public", async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows] = await pool.query("SELECT id, fullName, photoUrl, institution, passingYear, degree, profession, company, designation, location, linkedin, created_at FROM alumni_registrations ORDER BY created_at DESC");
      res.json(rows);
    } else {
      const pubData = (localData.alumniRegistrations || []).map((a: any) => ({
        id: a.id,
        fullName: a.fullName,
        photoUrl: a.photoUrl,
        institution: a.institution,
        passingYear: a.passingYear,
        degree: a.degree,
        profession: a.profession,
        company: a.company,
        designation: a.designation,
        location: a.location,
        linkedin: a.linkedin,
        created_at: a.created_at
      })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      res.json(pubData);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alumni directory data" });
  }
});

app.get("/api/alumni", authenticateToken, async (req, res) => {
  try {
    if (USE_MYSQL) {
      const [rows] = await pool.query("SELECT * FROM alumni_registrations ORDER BY created_at DESC");
      res.json(rows);
    } else {
      const adminData = [...(localData.alumniRegistrations || [])].sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      res.json(adminData);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alumni data" });
  }
});

app.post("/api/inquiries", async (req, res) => {
  const { name, email, phone, program, message } = req.body;
  try {
    if (USE_MYSQL) {
      const [result]: any = await pool.query(
        "INSERT INTO inquiries (name, email, phone, program, message) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone, program || "General Inquiry", message]
      );
      res.json({ success: true, id: result.insertId });
    } else {
      localData.inquiries = localData.inquiries || [];
      const newInquiry = {
        id: Date.now(),
        name,
        email,
        phone,
        program: program || "General Inquiry",
        message,
        status: "new",
        created_at: new Date().toISOString()
      };
      localData.inquiries.unshift(newInquiry);
      saveLocalData();
      res.json({ success: true, id: newInquiry.id });
    }
  } catch (error: any) {
    console.error("Save inquiry error:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

// Global API error handler ensuring JSON responses for all API routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global express API error caught:", err);
  if (req.path.startsWith("/api/")) {
    return res.status(err.status || 500).json({
      error: err.message || "Internal server error",
      code: err.code || "SERVER_ERROR"
    });
  }
  next(err);
});


// DATABASE BACKUP ROUTE
// Custom auth for backup download via query param
app.get("/api/backup", (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    jwt.verify(token as string, JWT_SECRET);
  } catch (e) {
    return res.status(403).json({ error: "Invalid token" });
  }
  if (USE_MYSQL) {
    return res.status(400).json({ error: "Backup route only available for local JSON storage mode." });
  }
  
  try {
    if (fsSync.existsSync(LOCAL_DB_PATH)) {
      res.download(LOCAL_DB_PATH, `sarvodaya_backup_${new Date().toISOString().split('T')[0]}.json`);
    } else {
      res.status(404).json({ error: "Database file not found" });
    }
  } catch (error: any) {
    console.error("Backup error:", error);
    res.status(500).json({ error: "Failed to generate backup" });
  }
});

// --- VITE DEV SERVER / PROD STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
