<?php
/**
 * BUCC Dino Runner & Boss Shooter
 * Main PHP Entry Point
 */
session_start();

// Generate CSRF token for score submissions
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(16));
}

$config = require_once __DIR__ . '/config.php';

// Include the standard web application structure
include __DIR__ . '/index.html';
?>
