
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
