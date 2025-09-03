<?php
/**
 * File Download Handler with Database Integration for MolView
 */

require_once 'database.php';

// Initialize database
try {
    $db = new LibraryDatabase();
} catch (Exception $e) {
    http_response_code(500);
    echo "Database connection failed: " . $e->getMessage();
    exit();
}

$fileId = $_GET['id'] ?? '';
$type = $_GET['type'] ?? '';

if (empty($fileId)) {
    http_response_code(400);
    echo "File ID is required";
    exit();
}

// Get file information from database
$fileInfo = $db->getFileById($fileId);

if (!$fileInfo) {
    http_response_code(404);
    echo "File not found in database";
    exit();
}

// Check if physical file exists
if (!file_exists($fileInfo['file_path'])) {
    http_response_code(404);
    echo "Physical file not found: " . $fileInfo['original_name'];
    exit();
}

// Set appropriate headers for download
$mimeType = $fileInfo['mime_type'] ?: 'application/octet-stream';
$filename = $fileInfo['original_name'];

header('Content-Type: ' . $mimeType);
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Content-Length: ' . $fileInfo['file_size']);
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');

// Output the file
readfile($fileInfo['file_path']);
exit();
?>