<?php
/**
 * BUCC Promotion Game - API: Scores
 * Handles fetching high score leaderboard and saving new game completions.
 */
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/../data/scores.json';

// Ensure data file exists
if (!file_exists($dataFile)) {
    if (!is_dir(dirname($dataFile))) {
        mkdir(dirname($dataFile), 0777, true);
    }
    file_put_contents($dataFile, json_encode([], JSON_PRETTY_PRINT));
}

// GET: Return top leaderboard
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $raw = @file_get_contents($dataFile);
    $scores = json_decode($raw, true) ?: [];

    // Sort by score DESC
    usort($scores, function ($a, $b) {
        if ($b['score'] === $a['score']) {
            return ($b['coins'] ?? 0) - ($a['coins'] ?? 0);
        }
        return ($b['score'] ?? 0) - ($a['score'] ?? 0);
    });

    // Top 5 scores
    $topScores = array_slice($scores, 0, 5);

    echo json_encode([
        'status' => 'success',
        'count' => count($topScores),
        'leaderboard' => $topScores
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

// POST: Save new score
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $payload = json_decode($body, true);

    if (!$payload) {
        $payload = $_POST;
    }

    $name = trim($payload['name'] ?? 'Anonymous GM');
    if (empty($name)) {
        $name = 'BUCC Member';
    }
    $name = substr(htmlspecialchars($name, ENT_QUOTES, 'UTF-8'), 0, 24);

    $score = max(0, intval($payload['score'] ?? 0));
    $coins = max(0, intval($payload['coins'] ?? 0));
    $rank = trim($payload['rank'] ?? 'General Member');
    $levelReached = max(1, intval($payload['level_reached'] ?? 1));
    $victory = !empty($payload['victory']);

    $newEntry = [
        'id' => uniqid('score_'),
        'name' => $name,
        'score' => $score,
        'coins' => $coins,
        'rank' => $rank,
        'level_reached' => $levelReached,
        'victory' => $victory,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $raw = @file_get_contents($dataFile);
    $scores = json_decode($raw, true) ?: [];
    $scores[] = $newEntry;

    // Sort descending
    usort($scores, function ($a, $b) {
        if ($b['score'] === $a['score']) {
            return ($b['coins'] ?? 0) - ($a['coins'] ?? 0);
        }
        return ($b['score'] ?? 0) - ($a['score'] ?? 0);
    });

    // Find position of new score
    $position = 1;
    foreach ($scores as $idx => $item) {
        if ($item['id'] === $newEntry['id']) {
            $position = $idx + 1;
            break;
        }
    }

    // Keep top 100 in file
    $scores = array_slice($scores, 0, 100);
    file_put_contents($dataFile, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    echo json_encode([
        'status' => 'success',
        'message' => 'Score recorded successfully',
        'entry' => $newEntry,
        'leaderboard_rank' => $position,
        'leaderboard' => array_slice($scores, 0, 5)
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
