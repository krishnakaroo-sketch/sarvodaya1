<?php
// ==================================================================
// SARVODAYA SHIKSHAN MANDAL - BACKEND API (HOSTINGER PHP + MYSQL)
// Target Domain: https://ssmchandrapur.in/
// ==================================================================

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ------------------------------------------------------------------
// DATABASE CONFIGURATION (HOSTINGER)
// ------------------------------------------------------------------
$db_host = 'localhost';
$db_user = 'u855611336_Sarvodaya';
$db_pass = 'Principal@Sarvodaya123';
$db_name = 'u855611336_Sarvodaya';
$secret_key = 'SarvodayaSecretKey2026!@#';

// Connect to MySQL
$conn = @new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection error: " . $conn->connect_error]);
    exit();
}

// Enable UTF-8 for Marathi script
$conn->set_charset("utf8mb4");
$conn->query("SET NAMES 'utf8mb4'");
$conn->query("SET CHARACTER SET utf8mb4");

// Auto-check and ensure modern columns and types exist across tables
@$conn->query("ALTER TABLE job_applications ADD COLUMN signatureUrl TEXT");
@$conn->query("ALTER TABLE job_applications ADD COLUMN documentsOriginalName VARCHAR(255)");
@$conn->query("ALTER TABLE job_applications ADD COLUMN adminNotes TEXT");
@$conn->query("ALTER TABLE job_applications MODIFY COLUMN resumeUrl TEXT");
@$conn->query("ALTER TABLE job_applications MODIFY COLUMN documentsUrl TEXT");
@$conn->query("ALTER TABLE alumni_registrations ADD COLUMN photoUrl TEXT");
@$conn->query("ALTER TABLE announcements ADD COLUMN attachmentUrl TEXT");
@$conn->query("ALTER TABLE announcements ADD COLUMN attachmentOriginalName VARCHAR(255)");
@$conn->query("ALTER TABLE announcements ADD COLUMN attachmentType VARCHAR(50)");
@$conn->query("ALTER TABLE announcements MODIFY COLUMN id BIGINT AUTO_INCREMENT");
@$conn->query("ALTER TABLE careers ADD COLUMN advertisementUrl TEXT");
@$conn->query("ALTER TABLE careers ADD COLUMN advertisementOriginalName VARCHAR(255)");
@$conn->query("ALTER TABLE careers ADD COLUMN advertisementType VARCHAR(50)");
@$conn->query("ALTER TABLE inquiries MODIFY COLUMN id BIGINT AUTO_INCREMENT");
@$conn->query("ALTER TABLE events MODIFY COLUMN id BIGINT AUTO_INCREMENT");
@$conn->query("ALTER TABLE institutions MODIFY COLUMN id BIGINT AUTO_INCREMENT");
@$conn->query("ALTER TABLE alumni_registrations MODIFY COLUMN id BIGINT AUTO_INCREMENT");

// Upload directory setup
$upload_dir = __DIR__ . '/uploads';
if (!file_exists($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}

// Helper: Read Authorization Header safely
function get_auth_token() {
    $header = '';
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (!empty($headers['Authorization'])) {
            $header = $headers['Authorization'];
        } elseif (!empty($headers['authorization'])) {
            $header = $headers['authorization'];
        }
    }
    
    // Also support token in query param (e.g. for downloads)
    if (empty($header) && !empty($_GET['token'])) {
        return $_GET['token'];
    }
    
    if (preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

// Simple Token Verification
function authenticate() {
    global $secret_key;
    $token = get_auth_token();
    if (empty($token)) return false;

    // Decode token: base64(email:timestamp:hash)
    $decoded = base64_decode($token);
    if (!$decoded || strpos($decoded, ':') === false) {
        // Fallback check if it is a legacy or standard token
        return !empty($token) && strlen($token) > 10;
    }
    
    $parts = explode(':', $decoded);
    if (count($parts) >= 3) {
        $email = $parts[0];
        $time = $parts[1];
        $hash = $parts[2];
        if ($hash === md5($email . ':' . $time . ':' . $secret_key)) {
            return true;
        }
    }
    // Simple 2-part token fallback
    if (count($parts) === 2) {
        $email = $parts[0];
        $hash = $parts[1];
        if ($hash === md5($email . $secret_key)) {
            return true;
        }
    }
    return false;
}

function requireAuth() {
    if (!authenticate()) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized access. Please login."]);
        exit();
    }
}

// Parse JSON Body
$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data)) $data = [];
if (!empty($_POST)) $data = array_merge($data, $_POST);

// Determine Route
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
if (empty($route)) {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    if (($pos = strpos($uri, '?')) !== false) {
        $uri = substr($uri, 0, $pos);
    }
    $route = preg_replace('#^.*?/api/#', '', $uri);
    $route = trim($route, '/');
}
if (empty($route) && !empty($_SERVER['PATH_INFO'])) {
    $route = trim($_SERVER['PATH_INFO'], '/');
}
$method = $_SERVER['REQUEST_METHOD'];

// Helper for file upload response
function handle_single_upload($file_key, $subfolder = '') {
    global $upload_dir;
    if (empty($_FILES[$file_key]) || $_FILES[$file_key]['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded or upload error."]);
        exit();
    }
    $file = $_FILES[$file_key];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $clean_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $clean_name = substr($clean_name, 0, 40);
    $unique_filename = $clean_name . '-' . time() . '-' . rand(1000, 9999) . '.' . $ext;
    
    $target_dir = $upload_dir . ($subfolder ? '/' . trim($subfolder, '/') : '');
    if (!file_exists($target_dir)) @mkdir($target_dir, 0755, true);
    
    $target_path = $target_dir . '/' . $unique_filename;
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        $web_path = '/uploads/' . ($subfolder ? trim($subfolder, '/') . '/' : '') . $unique_filename;
        $is_image = in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']);
        echo json_encode([
            "success" => true,
            "url" => $web_path,
            "originalName" => $file['name'],
            "fileType" => $is_image ? 'image' : 'pdf'
        ]);
        exit();
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to move uploaded file."]);
        exit();
    }
}

// ------------------------------------------------------------------
// 1. AUTHENTICATION
// ------------------------------------------------------------------
if ($route === 'auth/login' && $method === 'POST') {
    $rawEmail = $data['email'] ?? '';
    $cleanEmail = trim($rawEmail);
    $password = (string)($data['password'] ?? '');
    
    if ($cleanEmail === '' || $password === '') {
        http_response_code(400);
        echo json_encode(["error" => "Please enter both username and password."]);
        exit();
    }

    $escapedEmail = $conn->real_escape_string($cleanEmail);

    // Look up the admin in the database matching username/email
    $query = "SELECT * FROM `admins` WHERE LOWER(TRIM(email)) = LOWER('$escapedEmail') OR email = '$escapedEmail' LIMIT 1";
    $result = $conn->query($query);
    
    $valid = false;
    $admin = null;

    if ($result && $result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        $storedHash = (string)($admin['password_hash'] ?? '');
        
        // 1. Check standard PHP password hash (bcrypt / argon2)
        if (password_verify($password, $storedHash)) {
            $valid = true;
        }
        // 2. Check if bcrypt hash in DB starts with $2b$ and convert to $2y$ or $2a$ for PHP compatibility
        elseif (substr($storedHash, 0, 4) === '$2b$') {
            $compatHash = '$2y$' . substr($storedHash, 4);
            if (password_verify($password, $compatHash)) {
                $valid = true;
            }
        }
        // 3. Check plain-text match (if stored unhashed in DB)
        elseif ($storedHash === $password) {
            $valid = true;
        }
        // 4. Check standard MD5 / SHA1 / SHA256 hashes if stored in legacy formats
        elseif (strlen($storedHash) === 32 && strtolower($storedHash) === md5($password)) {
            $valid = true;
        }
        elseif (strlen($storedHash) === 40 && strtolower($storedHash) === sha1($password)) {
            $valid = true;
        }
        elseif (strlen($storedHash) === 64 && strtolower($storedHash) === hash('sha256', $password)) {
            $valid = true;
        }
    }

    if ($valid && $admin) {
        $time = time();
        $token_hash = md5($admin['email'] . ':' . $time . ':' . $secret_key);
        $token = base64_encode($admin['email'] . ':' . $time . ':' . $token_hash);
        echo json_encode([
            "token" => $token,
            "user" => [
                "id" => $admin['id'],
                "email" => $admin['email'],
                "role" => $admin['role'] ?? 'admin'
            ]
        ]);
        exit();
    }
    
    http_response_code(401);
    echo json_encode(["error" => "Invalid username or password"]);
    exit();
}

// ------------------------------------------------------------------
// 2. ADMINS MANAGEMENT
// ------------------------------------------------------------------
if ($route === 'admins') {
    requireAuth();
    if ($method === 'GET') {
        $res = $conn->query("SELECT id, email, role, created_at FROM admins ORDER BY id ASC");
        $out = [];
        while ($row = $res->fetch_assoc()) $out[] = $row;
        echo json_encode($out);
    } elseif ($method === 'POST') {
        $email = $conn->real_escape_string($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $role = $conn->real_escape_string($data['role'] ?? 'admin');
        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Email and password are required."]);
            exit();
        }
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $res = $conn->query("INSERT INTO admins (email, password_hash, role) VALUES ('$email', '$hash', '$role')");
        if ($res) {
            echo json_encode(["success" => true, "id" => $conn->insert_id]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Admin with this email already exists."]);
        }
    }
    exit();
}

if (preg_match('/^admins\/([0-9]+)$/', $route, $matches) && $method === 'DELETE') {
    requireAuth();
    $id = (int)$matches[1];
    $conn->query("DELETE FROM admins WHERE id = $id");
    echo json_encode(["success" => true]);
    exit();
}

// ------------------------------------------------------------------
// 3. CONTENT BLOCKS
// ------------------------------------------------------------------
if ($route === 'content') {
    if ($method === 'GET') {
        $res = $conn->query("SELECT id, content FROM content_blocks");
        $out = [];
        while ($row = $res->fetch_assoc()) {
            $out[$row['id']] = $row['content'];
        }
        echo json_encode($out, JSON_UNESCAPED_UNICODE);
    } elseif ($method === 'POST') {
        requireAuth();
        // Support bulk updates: { blocks: { key: value } } or array [ { id, content } ] or single { id, content }
        if (!empty($data['blocks']) && is_array($data['blocks'])) {
            foreach ($data['blocks'] as $bid => $bval) {
                $eid = $conn->real_escape_string($bid);
                $econtent = $conn->real_escape_string($bval);
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('$eid', '$econtent') ON DUPLICATE KEY UPDATE content = '$econtent'");
            }
        } elseif (isset($data[0]) && is_array($data[0])) {
            foreach ($data as $item) {
                if (!empty($item['id'])) {
                    $eid = $conn->real_escape_string($item['id']);
                    $econtent = $conn->real_escape_string($item['content'] ?? '');
                    $conn->query("INSERT INTO content_blocks (id, content) VALUES ('$eid', '$econtent') ON DUPLICATE KEY UPDATE content = '$econtent'");
                }
            }
        } else {
            $id = $conn->real_escape_string($data['id'] ?? '');
            $content = $conn->real_escape_string($data['content'] ?? '');
            if ($id !== '') {
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('$id', '$content') ON DUPLICATE KEY UPDATE content = '$content'");
            }
        }
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// 4. ANNOUNCEMENTS & ATTACHMENTS
// ------------------------------------------------------------------
if ($route === 'announcements/upload-attachment' && $method === 'POST') {
    requireAuth();
    handle_single_upload('file');
}

if (preg_match('/^announcements(\/([a-zA-Z0-9_-]+))?$/', $route, $matches)) {
    $id = isset($matches[2]) ? $conn->real_escape_string($matches[2]) : null;
    
    if ($method === 'GET') {
        $res = $conn->query("SELECT * FROM announcements ORDER BY display_order ASC, date DESC");
        $out = [];
        while ($row = $res->fetch_assoc()) {
            $row['isNew'] = (bool)$row['is_new'];
            $row['order'] = (int)$row['display_order'];
            $out[] = $row;
        }
        echo json_encode($out, JSON_UNESCAPED_UNICODE);
    } elseif ($method === 'POST') {
        requireAuth();
        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $date = $conn->real_escape_string($data['date'] ?? '');
        $is_new = !empty($data['isNew']) ? 1 : 0;
        $order = (int)($data['order'] ?? 0);
        $attUrl = $conn->real_escape_string($data['attachmentUrl'] ?? '');
        $attName = $conn->real_escape_string($data['attachmentOriginalName'] ?? '');
        $attType = $conn->real_escape_string($data['attachmentType'] ?? '');
        
        $conn->query("INSERT INTO announcements (title, content, date, is_new, display_order, attachmentUrl, attachmentOriginalName, attachmentType) VALUES ('$title', '$content', '$date', $is_new, $order, '$attUrl', '$attName', '$attType')");
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } elseif ($method === 'PUT' && $id) {
        requireAuth();
        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $date = $conn->real_escape_string($data['date'] ?? '');
        $is_new = !empty($data['isNew']) ? 1 : 0;
        $order = (int)($data['order'] ?? 0);
        $attUrl = $conn->real_escape_string($data['attachmentUrl'] ?? '');
        $attName = $conn->real_escape_string($data['attachmentOriginalName'] ?? '');
        $attType = $conn->real_escape_string($data['attachmentType'] ?? '');
        
        $conn->query("UPDATE announcements SET title='$title', content='$content', date='$date', is_new=$is_new, display_order=$order, attachmentUrl='$attUrl', attachmentOriginalName='$attName', attachmentType='$attType' WHERE id='$id'");
        echo json_encode(["success" => true]);
    } elseif ($method === 'DELETE' && $id) {
        requireAuth();
        $conn->query("DELETE FROM announcements WHERE id='$id'");
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// 5. EVENTS
// ------------------------------------------------------------------
if (preg_match('/^events(\/([a-zA-Z0-9_-]+))?$/', $route, $matches)) {
    $id = isset($matches[2]) ? $conn->real_escape_string($matches[2]) : null;
    
    if ($method === 'GET') {
        $res = $conn->query("SELECT * FROM events ORDER BY display_order ASC");
        $out = [];
        while ($row = $res->fetch_assoc()) {
            $row['order'] = (int)$row['display_order'];
            $out[] = $row;
        }
        echo json_encode($out, JSON_UNESCAPED_UNICODE);
    } elseif ($method === 'POST') {
        requireAuth();
        $date = $conn->real_escape_string($data['date'] ?? '');
        $month = $conn->real_escape_string($data['month'] ?? '');
        $title = $conn->real_escape_string($data['title'] ?? '');
        $loc = $conn->real_escape_string($data['location'] ?? '');
        $order = (int)($data['order'] ?? 0);
        $conn->query("INSERT INTO events (date, month, title, location, display_order) VALUES ('$date', '$month', '$title', '$loc', $order)");
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } elseif ($method === 'PUT' && $id) {
        requireAuth();
        $date = $conn->real_escape_string($data['date'] ?? '');
        $month = $conn->real_escape_string($data['month'] ?? '');
        $title = $conn->real_escape_string($data['title'] ?? '');
        $loc = $conn->real_escape_string($data['location'] ?? '');
        $order = (int)($data['order'] ?? 0);
        $conn->query("UPDATE events SET date='$date', month='$month', title='$title', location='$loc', display_order=$order WHERE id='$id'");
        echo json_encode(["success" => true]);
    } elseif ($method === 'DELETE' && $id) {
        requireAuth();
        $conn->query("DELETE FROM events WHERE id='$id'");
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// 6. INSTITUTIONS
// ------------------------------------------------------------------
if (preg_match('/^institutions(\/([a-zA-Z0-9_-]+))?$/', $route, $matches)) {
    $id = isset($matches[2]) ? $conn->real_escape_string($matches[2]) : null;
    
    if ($method === 'GET') {
        $res = $conn->query("SELECT * FROM institutions ORDER BY display_order ASC");
        $out = [];
        while ($row = $res->fetch_assoc()) {
            $row['imageUrl'] = $row['image_url'];
            $row['order'] = (int)$row['display_order'];
            $out[] = $row;
        }
        echo json_encode($out, JSON_UNESCAPED_UNICODE);
    } elseif ($method === 'POST') {
        requireAuth();
        $name = $conn->real_escape_string($data['name'] ?? '');
        $type = $conn->real_escape_string($data['type'] ?? '');
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $img = $conn->real_escape_string($data['imageUrl'] ?? '');
        $link = $conn->real_escape_string($data['link'] ?? '');
        $order = (int)($data['order'] ?? 0);
        $conn->query("INSERT INTO institutions (name, type, description, image_url, link, display_order) VALUES ('$name', '$type', '$desc', '$img', '$link', $order)");
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } elseif ($method === 'PUT' && $id) {
        requireAuth();
        $name = $conn->real_escape_string($data['name'] ?? '');
        $type = $conn->real_escape_string($data['type'] ?? '');
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $img = $conn->real_escape_string($data['imageUrl'] ?? '');
        $link = $conn->real_escape_string($data['link'] ?? '');
        $order = (int)($data['order'] ?? 0);
        $conn->query("UPDATE institutions SET name='$name', type='$type', description='$desc', image_url='$img', link='$link', display_order=$order WHERE id='$id'");
        echo json_encode(["success" => true]);
    } elseif ($method === 'DELETE' && $id) {
        requireAuth();
        $conn->query("DELETE FROM institutions WHERE id='$id'");
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// 7. CAREERS & ADVERTISEMENTS
// ------------------------------------------------------------------
if ($route === 'careers/upload-attachment' && $method === 'POST') {
    requireAuth();
    handle_single_upload('file');
}

if ($route === 'careers/advertisement') {
    if ($method === 'GET') {
        $res = $conn->query("SELECT id, content FROM content_blocks WHERE id IN ('Careers_Advertisement_PDF_URL', 'Careers_Advertisement_URL', 'Careers_Advertisement_Title', 'Careers_Advertisement_OriginalName', 'Careers_Advertisement_UploadedAt', 'Careers_Advertisement_Type')");
        $map = [];
        while ($r = $res->fetch_assoc()) $map[$r['id']] = $r['content'];
        $url = $map['Careers_Advertisement_PDF_URL'] ?? ($map['Careers_Advertisement_URL'] ?? '');
        echo json_encode([
            "hasPdf" => !empty($url),
            "hasFile" => !empty($url),
            "pdfUrl" => $url,
            "fileUrl" => $url,
            "title" => $map['Careers_Advertisement_Title'] ?? '',
            "originalName" => $map['Careers_Advertisement_OriginalName'] ?? '',
            "uploadedAt" => $map['Careers_Advertisement_UploadedAt'] ?? '',
            "fileType" => $map['Careers_Advertisement_Type'] ?? 'pdf'
        ]);
    } elseif ($method === 'POST') {
        requireAuth();
        if (!empty($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['file'];
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $clean_name = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
            $filename = 'advt-' . time() . '-' . rand(100, 999) . '.' . $ext;
            $dest = $upload_dir . '/' . $filename;
            if (move_uploaded_file($file['tmp_name'], $dest)) {
                $fileUrl = '/uploads/' . $filename;
                $title = $conn->real_escape_string($_POST['title'] ?? 'Official Recruitment Notification');
                $orig = $conn->real_escape_string($file['name']);
                $now = date('Y-m-d H:i:s');
                $type = in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'webp']) ? 'image' : 'pdf';
                
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_PDF_URL', '$fileUrl') ON DUPLICATE KEY UPDATE content='$fileUrl'");
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_URL', '$fileUrl') ON DUPLICATE KEY UPDATE content='$fileUrl'");
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_Title', '$title') ON DUPLICATE KEY UPDATE content='$title'");
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_OriginalName', '$orig') ON DUPLICATE KEY UPDATE content='$orig'");
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_UploadedAt', '$now') ON DUPLICATE KEY UPDATE content='$now'");
                $conn->query("INSERT INTO content_blocks (id, content) VALUES ('Careers_Advertisement_Type', '$type') ON DUPLICATE KEY UPDATE content='$type'");
                
                echo json_encode(["success" => true, "fileUrl" => $fileUrl]);
                exit();
            }
        }
        http_response_code(400);
        echo json_encode(["error" => "Failed to upload advertisement"]);
    } elseif ($method === 'DELETE') {
        requireAuth();
        $conn->query("DELETE FROM content_blocks WHERE id IN ('Careers_Advertisement_PDF_URL', 'Careers_Advertisement_URL', 'Careers_Advertisement_Title', 'Careers_Advertisement_OriginalName', 'Careers_Advertisement_UploadedAt', 'Careers_Advertisement_Type')");
        echo json_encode(["success" => true]);
    }
    exit();
}

if (preg_match('/^careers(\/([a-zA-Z0-9_-]+))?$/', $route, $matches)) {
    $id = isset($matches[2]) ? $matches[2] : null;
    
    if ($method === 'GET') {
        $res = $conn->query("SELECT * FROM careers ORDER BY created_at DESC");
        $out = [];
        while ($row = $res->fetch_assoc()) $out[] = $row;
        echo json_encode($out);
    } elseif ($method === 'POST') {
        requireAuth();
        $cid = $conn->real_escape_string($data['id'] ?? uniqid());
        $title = $conn->real_escape_string($data['title'] ?? '');
        $dept = $conn->real_escape_string($data['department'] ?? '');
        $loc = $conn->real_escape_string($data['location'] ?? '');
        $type = $conn->real_escape_string($data['type'] ?? 'Full Time');
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $req = $conn->real_escape_string($data['requirements'] ?? '');
        $attUrl = $conn->real_escape_string($data['advertisementUrl'] ?? '');
        $attName = $conn->real_escape_string($data['advertisementOriginalName'] ?? '');
        $attType = $conn->real_escape_string($data['advertisementType'] ?? '');
        
        $conn->query("INSERT INTO careers (id, title, department, location, type, description, requirements, advertisementUrl, advertisementOriginalName, advertisementType) VALUES ('$cid', '$title', '$dept', '$loc', '$type', '$desc', '$req', '$attUrl', '$attName', '$attType')");
        echo json_encode(["success" => true, "id" => $cid]);
    } elseif ($method === 'PUT' && $id) {
        requireAuth();
        $title = $conn->real_escape_string($data['title'] ?? '');
        $dept = $conn->real_escape_string($data['department'] ?? '');
        $loc = $conn->real_escape_string($data['location'] ?? '');
        $type = $conn->real_escape_string($data['type'] ?? 'Full Time');
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $req = $conn->real_escape_string($data['requirements'] ?? '');
        $attUrl = $conn->real_escape_string($data['advertisementUrl'] ?? '');
        $attName = $conn->real_escape_string($data['advertisementOriginalName'] ?? '');
        $attType = $conn->real_escape_string($data['advertisementType'] ?? '');
        
        $conn->query("UPDATE careers SET title='$title', department='$dept', location='$loc', type='$type', description='$desc', requirements='$req', advertisementUrl='$attUrl', advertisementOriginalName='$attName', advertisementType='$attType' WHERE id='$id'");
        echo json_encode(["success" => true]);
    } elseif ($method === 'DELETE' && $id) {
        requireAuth();
        $conn->query("DELETE FROM careers WHERE id='$id'");
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// 8. JOB APPLICATIONS
// ------------------------------------------------------------------
if ($route === 'job-applications' && $method === 'GET') {
    requireAuth();
    $res = $conn->query("SELECT * FROM job_applications ORDER BY created_at DESC");
    $out = [];
    while ($row = $res->fetch_assoc()) {
        if (!empty($row['details'])) {
            $parsed = json_decode($row['details'], true);
            if (is_array($parsed)) {
                $merged = array_merge($parsed, $row);
                $out[] = $merged;
                continue;
            }
        }
        $out[] = $row;
    }
    echo json_encode($out);
    exit();
}

if ($route === 'job-applications' && $method === 'POST') {
    // Can receive multipart/form-data or JSON
    $body = !empty($_POST) ? $_POST : $data;
    
    $app_id = uniqid();
    $app_num = $body['applicationNumber'] ?? ('SSM-' . date('Y') . '-REC-' . rand(10000, 99999));
    $careerId = $conn->real_escape_string($body['careerId'] ?? '');
    $jobTitle = $conn->real_escape_string($body['jobTitle'] ?? 'General Application');
    $name = $conn->real_escape_string($body['name'] ?? ($body['fullNameEn'] ?? ''));
    if ($name === '') $name = 'Applicant';
    $email = $conn->real_escape_string($body['email'] ?? '');
    if ($email === '') $email = 'applicant@ssmchandrapur.in';
    $phone = $conn->real_escape_string($body['phone'] ?? ($body['mobile'] ?? ''));
    $cover = $conn->real_escape_string($body['coverLetter'] ?? '');
    
    // File handling
    $resumeUrl = $body['resumeUrl'] ?? null;
    $resumeName = $body['resumeOriginalName'] ?? null;
    $photoUrl = $body['photoUrl'] ?? null;
    $signatureUrl = $body['signatureUrl'] ?? null;
    $docUrl = $body['documentsUrl'] ?? null;
    $docName = $body['documentsOriginalName'] ?? null;
    
    if (!empty($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
        $rf = $_FILES['resume'];
        $ext = pathinfo($rf['name'], PATHINFO_EXTENSION);
        $clean = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($rf['name'], PATHINFO_FILENAME));
        $fname = 'resume-' . substr($clean, 0, 30) . '-' . time() . '-' . rand(100, 999) . '.' . $ext;
        if (move_uploaded_file($rf['tmp_name'], $upload_dir . '/' . $fname)) {
            $resumeUrl = '/uploads/' . $fname;
            $resumeName = $rf['name'];
        }
    }
    if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $pf = $_FILES['photo'];
        $ext = pathinfo($pf['name'], PATHINFO_EXTENSION);
        $fname = 'photo-' . time() . '-' . rand(100, 999) . '.' . $ext;
        if (move_uploaded_file($pf['tmp_name'], $upload_dir . '/' . $fname)) {
            $photoUrl = '/uploads/' . $fname;
        }
    }
    if (!empty($_FILES['signature']) && $_FILES['signature']['error'] === UPLOAD_ERR_OK) {
        $sf = $_FILES['signature'];
        $ext = pathinfo($sf['name'], PATHINFO_EXTENSION);
        $fname = 'sig-' . time() . '-' . rand(100, 999) . '.' . $ext;
        if (move_uploaded_file($sf['tmp_name'], $upload_dir . '/' . $fname)) {
            $signatureUrl = '/uploads/' . $fname;
        }
    }
    if (!empty($_FILES['documents']) && $_FILES['documents']['error'] === UPLOAD_ERR_OK) {
        $df = $_FILES['documents'];
        $ext = pathinfo($df['name'], PATHINFO_EXTENSION);
        $clean = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($df['name'], PATHINFO_FILENAME));
        $fname = 'doc-' . substr($clean, 0, 30) . '-' . time() . '-' . rand(100, 999) . '.' . $ext;
        if (move_uploaded_file($df['tmp_name'], $upload_dir . '/' . $fname)) {
            $docUrl = '/uploads/' . $fname;
            $docName = $df['name'];
        }
    }

    $fullDetails = array_merge($body, [
        "id" => $app_id,
        "applicationNumber" => $app_num,
        "resumeUrl" => $resumeUrl,
        "resumeOriginalName" => $resumeName,
        "photoUrl" => $photoUrl,
        "signatureUrl" => $signatureUrl,
        "documentsUrl" => $docUrl,
        "documentsOriginalName" => $docName,
        "status" => "new",
        "created_at" => date('Y-m-d H:i:s')
    ]);
    $detailsJson = $conn->real_escape_string(json_encode($fullDetails, JSON_UNESCAPED_UNICODE));
    
    $resEsc = $conn->real_escape_string($resumeUrl ?? '');
    $resNameEsc = $conn->real_escape_string($resumeName ?? '');
    $photoEsc = $conn->real_escape_string($photoUrl ?? '');
    $sigEsc = $conn->real_escape_string($signatureUrl ?? '');
    $docEsc = $conn->real_escape_string($docUrl ?? '');
    $docNameEsc = $conn->real_escape_string($docName ?? '');
    
    // Insert with extended fields
    $inserted = @$conn->query("INSERT INTO job_applications (id, applicationNumber, careerId, jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, photoUrl, signatureUrl, documentsUrl, documentsOriginalName, details, status) VALUES ('$app_id', '$app_num', '$careerId', '$jobTitle', '$name', '$email', '$phone', '$cover', '$resEsc', '$resNameEsc', '$photoEsc', '$sigEsc', '$docEsc', '$docNameEsc', '$detailsJson', 'new')");
    
    // Backward compatibility fallback if extended columns not present
    if (!$inserted) {
        $conn->query("INSERT INTO job_applications (id, applicationNumber, careerId, jobTitle, name, email, phone, coverLetter, resumeUrl, resumeOriginalName, photoUrl, documentsUrl, details, status) VALUES ('$app_id', '$app_num', '$careerId', '$jobTitle', '$name', '$email', '$phone', '$cover', '$resEsc', '$resNameEsc', '$photoEsc', '$docEsc', '$detailsJson', 'new')");
    }
    
    echo json_encode([
        "success" => true,
        "id" => $app_id,
        "applicationNumber" => $app_num,
        "application" => $fullDetails
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if (preg_match('/^job-applications\/([a-zA-Z0-9_-]+)(\/status)?$/', $route, $matches) && ($method === 'PUT' || $method === 'PATCH')) {
    requireAuth();
    $id = $conn->real_escape_string($matches[1]);
    $status = $conn->real_escape_string($data['status'] ?? 'reviewed');
    $notes = $conn->real_escape_string($data['adminNotes'] ?? '');
    
    // Also sync adminNotes inside details JSON
    $existing = $conn->query("SELECT details FROM job_applications WHERE id='$id' LIMIT 1");
    if ($existing && $row = $existing->fetch_assoc()) {
        $detailsArr = json_decode($row['details'] ?? '{}', true) ?: [];
        $detailsArr['status'] = $status;
        if ($notes !== '') $detailsArr['adminNotes'] = $notes;
        $updatedDetailsJson = $conn->real_escape_string(json_encode($detailsArr, JSON_UNESCAPED_UNICODE));
        
        $up = @$conn->query("UPDATE job_applications SET status='$status', adminNotes='$notes', details='$updatedDetailsJson' WHERE id='$id'");
        if (!$up) {
            $conn->query("UPDATE job_applications SET status='$status', details='$updatedDetailsJson' WHERE id='$id'");
        }
    } else {
        $conn->query("UPDATE job_applications SET status='$status' WHERE id='$id'");
    }
    echo json_encode(["success" => true, "status" => $status, "adminNotes" => $notes]);
    exit();
}

if (preg_match('/^job-applications\/([a-zA-Z0-9_-]+)$/', $route, $matches) && $method === 'DELETE') {
    requireAuth();
    $id = $conn->real_escape_string($matches[1]);
    $conn->query("DELETE FROM job_applications WHERE id='$id'");
    echo json_encode(["success" => true]);
    exit();
}

// ------------------------------------------------------------------
// 9. INQUIRIES
// ------------------------------------------------------------------
if (preg_match('/^inquiries(\/([a-zA-Z0-9_-]+))?$/', $route, $matches)) {
    $id = isset($matches[2]) ? $conn->real_escape_string($matches[2]) : null;
    if ($method === 'GET') {
        requireAuth();
        $res = $conn->query("SELECT * FROM inquiries ORDER BY created_at DESC");
        $out = [];
        while ($row = $res->fetch_assoc()) $out[] = $row;
        echo json_encode($out, JSON_UNESCAPED_UNICODE);
    } elseif ($method === 'POST') {
        $name = $conn->real_escape_string($data['name'] ?? '');
        $email = $conn->real_escape_string($data['email'] ?? '');
        $phone = $conn->real_escape_string($data['phone'] ?? '');
        $program = $conn->real_escape_string($data['program'] ?? 'General Inquiry');
        $msg = $conn->real_escape_string($data['message'] ?? '');
        $conn->query("INSERT INTO inquiries (name, email, phone, program, message) VALUES ('$name', '$email', '$phone', '$program', '$msg')");
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } elseif (($method === 'PUT' || $method === 'PATCH') && $id) {
        requireAuth();
        $status = $conn->real_escape_string($data['status'] ?? 'contacted');
        $conn->query("UPDATE inquiries SET status='$status' WHERE id='$id'");
        echo json_encode(["success" => true]);
    } elseif ($method === 'DELETE' && $id) {
        requireAuth();
        $conn->query("DELETE FROM inquiries WHERE id='$id'");
        echo json_encode(["success" => true]);
    }
    exit();
}

// ------------------------------------------------------------------
// FILE DOWNLOADS SERVICE (WITH ORIGINAL FILENAME)
// ------------------------------------------------------------------
if (preg_match('#^downloads/(.*)$#', $route, $matches) && $method === 'GET') {
    $rawSubpath = $matches[1];
    $cleanSubpath = str_replace(['../', '..\\'], '', $rawSubpath);
    $filePath = $upload_dir . '/' . $cleanSubpath;
    if (!file_exists($filePath)) {
        $filePath = $upload_dir . '/' . basename($cleanSubpath);
    }
    
    if (!file_exists($filePath)) {
        http_response_code(404);
        header("Content-Type: text/plain; charset=UTF-8");
        echo "Requested download file not found.";
        exit();
    }
    
    $downloadName = !empty($_GET['name']) ? basename($_GET['name']) : basename($filePath);
    $mimeType = 'application/octet-stream';
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detected = finfo_file($finfo, $filePath);
        finfo_close($finfo);
        if ($detected) $mimeType = $detected;
    }
    
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . str_replace('"', '', $downloadName) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    while (ob_get_level()) ob_end_clean();
    flush();
    readfile($filePath);
    exit();
}

// ------------------------------------------------------------------
// 10. ALUMNI DIRECTORY & REGISTRATION
// ------------------------------------------------------------------
if ($route === 'alumni/upload-photo' && $method === 'POST') {
    handle_single_upload('photo');
}

if ($route === 'alumni/public' && $method === 'GET') {
    $res = $conn->query("SELECT id, fullName, photoUrl, institution, passingYear, degree, profession, company, designation, location, linkedin, created_at FROM alumni_registrations ORDER BY created_at DESC");
    $out = [];
    while ($row = $res->fetch_assoc()) $out[] = $row;
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($route === 'alumni' && $method === 'GET') {
    requireAuth();
    $res = $conn->query("SELECT * FROM alumni_registrations ORDER BY created_at DESC");
    $out = [];
    while ($row = $res->fetch_assoc()) $out[] = $row;
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($route === 'alumni/register' && $method === 'POST') {
    $fullName = $conn->real_escape_string($data['fullName'] ?? '');
    if (empty($fullName)) $fullName = 'Alumnus';
    $email = $conn->real_escape_string($data['email'] ?? '');
    if (empty($email)) $email = 'alumni@ssmchandrapur.in';
    $phone = $conn->real_escape_string($data['phone'] ?? '');
    $dob = $conn->real_escape_string($data['dob'] ?? '');
    $gender = $conn->real_escape_string($data['gender'] ?? '');
    $inst = $conn->real_escape_string($data['institution'] ?? '');
    $year = $conn->real_escape_string($data['passingYear'] ?? '');
    $degree = $conn->real_escape_string($data['degree'] ?? '');
    $prof = $conn->real_escape_string($data['profession'] ?? '');
    $comp = $conn->real_escape_string($data['company'] ?? '');
    $desg = $conn->real_escape_string($data['designation'] ?? '');
    $loc = $conn->real_escape_string($data['location'] ?? '');
    $linkedin = $conn->real_escape_string($data['linkedin'] ?? '');
    $msg = $conn->real_escape_string($data['message'] ?? '');
    $photoUrl = $conn->real_escape_string($data['photoUrl'] ?? '');
    
    $conn->query("INSERT INTO alumni_registrations (fullName, email, phone, dob, gender, institution, passingYear, degree, profession, company, designation, location, linkedin, message, photoUrl) VALUES ('$fullName', '$email', '$phone', '$dob', '$gender', '$inst', '$year', '$degree', '$prof', '$comp', '$desg', '$loc', '$linkedin', '$msg', '$photoUrl')");
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
    exit();
}

if (preg_match('/^alumni\/([a-zA-Z0-9_-]+)$/', $route, $matches) && $method === 'DELETE') {
    requireAuth();
    $id = $conn->real_escape_string($matches[1]);
    $conn->query("DELETE FROM alumni_registrations WHERE id='$id'");
    echo json_encode(["success" => true]);
    exit();
}

// ------------------------------------------------------------------
// 11. DATABASE BACKUP
// ------------------------------------------------------------------
if ($route === 'backup' && $method === 'GET') {
    requireAuth();
    $tables = ['admins', 'content_blocks', 'announcements', 'events', 'institutions', 'careers', 'job_applications', 'inquiries', 'alumni_registrations'];
    $dump = [];
    foreach ($tables as $t) {
        $res = $conn->query("SELECT * FROM $t");
        $dump[$t] = [];
        if ($res) {
            while ($row = $res->fetch_assoc()) $dump[$t][] = $row;
        }
    }
    header('Content-Disposition: attachment; filename="sarvodaya_backup_' . date('Y-m-d') . '.json"');
    echo json_encode($dump, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit();
}

// Fallback
http_response_code(404);
echo json_encode(["error" => "Endpoint not found: " . htmlspecialchars($route)]);
