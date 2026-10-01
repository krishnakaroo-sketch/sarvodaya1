<?php
// Bridge all /api/* requests directly to root api.php
if (file_exists(__DIR__ . '/../api.php')) {
    require_once __DIR__ . '/../api.php';
} else if (file_exists(__DIR__ . '/api.php')) {
    require_once __DIR__ . '/api.php';
} else {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'API backend file api.php not found']);
}
