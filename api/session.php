<?php
/**
 * BUCC Promotion Game - API: Session
 * Manages player session state and game security token.
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(16));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!empty($input['player_name'])) {
        $_SESSION['player_name'] = substr(trim($input['player_name']), 0, 24);
    }
}

echo json_encode([
    'status' => 'success',
    'session_id' => session_id(),
    'player_name' => $_SESSION['player_name'] ?? 'General Member',
    'token' => $_SESSION['csrf_token']
], JSON_PRETTY_PRINT);
