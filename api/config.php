<?php
/**
 * BUCC Promotion Game - API: Config
 * Returns game balance and configuration parameters in JSON format.
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$config = require_once __DIR__ . '/../config.php';

echo json_encode([
    'status' => 'success',
    'data' => $config
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
