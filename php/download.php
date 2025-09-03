
<?php
/**
 * File Download API for MolView
 */

$fileId = $_GET['id'] ?? '';
$type = $_GET['type'] ?? '';

if (!$fileId || !$type) {
    http_response_code(400);
    die('Missing parameters');
}

// Load metadata
$metadataFile = 'uploads/metadata.json';
if (!file_exists($metadataFile)) {
    http_response_code(404);
    die('No files found');
}

$metadata = json_decode(file_get_contents($metadataFile), true);
$targetArray = ($type === 'animation') ? 'animations' : 'structures';

$fileInfo = null;
foreach ($metadata[$targetArray] as $file) {
    if ($file['id'] === $fileId) {
        $fileInfo = $file;
        break;
    }
}

if (!$fileInfo || !file_exists($fileInfo['file_path'])) {
    http_response_code(404);
    die('File not found');
}

// Set headers for file download
header('Content-Type: ' . ($fileInfo['content_type'] ?: 'application/octet-stream'));
header('Content-Disposition: attachment; filename="' . $fileInfo['name'] . '"');
header('Content-Length: ' . filesize($fileInfo['file_path']));

// Output file
readfile($fileInfo['file_path']);
?>
<?php
/**
 * Download handler for uploaded files
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

$id = $_GET['id'] ?? '';
$type = $_GET['type'] ?? '';

if (empty($id) || empty($type)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing id or type parameter']);
    exit();
}

// Load metadata
$uploadDir = __DIR__ . '/uploads/';
$metadataFile = $uploadDir . 'metadata.json';

if (!file_exists($metadataFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'No files found']);
    exit();
}

$metadata = json_decode(file_get_contents($metadataFile), true);
if (!$metadata) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Invalid metadata']);
    exit();
}

// Find the file
$targetArrayKey = ($type === 'animation') ? 'animations' : 'structures';
$fileInfo = null;

foreach ($metadata[$targetArrayKey] as $item) {
    if ($item['id'] === $id) {
        $fileInfo = $item;
        break;
    }
}

if (!$fileInfo) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'File not found']);
    exit();
}

// Check if file exists
if (!file_exists($fileInfo['file_path'])) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Physical file not found']);
    exit();
}

// Determine content type
$contentType = 'application/octet-stream';
$extension = strtolower($fileInfo['extension']);

switch ($extension) {
    case 'mol':
    case 'sdf':
    case 'pdb':
    case 'xyz':
    case 'cif':
        $contentType = 'chemical/x-' . $extension;
        break;
    case 'json':
        $contentType = 'application/json';
        break;
    case 'txt':
        $contentType = 'text/plain';
        break;
    case 'mp4':
        $contentType = 'video/mp4';
        break;
    case 'webm':
        $contentType = 'video/webm';
        break;
    case 'avi':
        $contentType = 'video/x-msvideo';
        break;
    case 'mov':
        $contentType = 'video/quicktime';
        break;
}

// Set headers for download
header('Content-Type: ' . $contentType);
header('Content-Disposition: attachment; filename="' . $fileInfo['name'] . '"');
header('Content-Length: ' . filesize($fileInfo['file_path']));
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

// Output file
readfile($fileInfo['file_path']);
exit();
?>
