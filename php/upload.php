
<?php
// Prevent any output before JSON response
ob_start();
error_reporting(0); // Suppress PHP warnings/notices that could break JSON

/**
 * File Upload API for MolView - Handle permanent file storage
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Clean any previous output
ob_clean();

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// Create necessary directories
$uploadDir = __DIR__ . '/uploads/';
$structuresDir = $uploadDir . 'structures/';
$animationsDir = $uploadDir . 'animations/';
$metadataFile = $uploadDir . 'metadata.json';

try {
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    if (!file_exists($structuresDir)) {
        mkdir($structuresDir, 0755, true);
    }
    if (!file_exists($animationsDir)) {
        mkdir($animationsDir, 0755, true);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to create directories']);
    exit();
}

function loadMetadata() {
    global $metadataFile;
    if (file_exists($metadataFile)) {
        $content = file_get_contents($metadataFile);
        $data = json_decode($content, true);
        return $data ?: ['structures' => [], 'animations' => []];
    }
    return ['structures' => [], 'animations' => []];
}

function saveMetadata($metadata) {
    global $metadataFile;
    return file_put_contents($metadataFile, json_encode($metadata, JSON_PRETTY_PRINT));
}

function sanitizeFilename($filename) {
    return preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
}

try {
    switch ($method) {
        case 'GET':
            $action = $_GET['action'] ?? '';

            if ($action === 'list') {
                echo json_encode(['success' => true, 'data' => loadMetadata()]);
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid action']);
            }
            break;

        case 'POST':
            if (!isset($_FILES['file'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No file uploaded']);
                break;
            }

            $file = $_FILES['file'];
            $type = $_POST['type'] ?? 'structure';

            if ($file['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Upload failed with error code: ' . $file['error']]);
                break;
            }

            if ($file['size'] > 10 * 1024 * 1024) { // 10MB limit
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'File too large (max 10MB)']);
                break;
            }

            $fileId = uniqid();
            $originalName = basename($file['name']);
            $sanitizedName = sanitizeFilename($originalName);
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            // Validate file type
            $allowedExtensions = ['mol', 'sdf', 'pdb', 'xyz', 'cif', 'json', 'txt'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'File type not allowed']);
                break;
            }

            // Determine storage directory
            $targetDir = ($type === 'animation') ? $animationsDir : $structuresDir;
            $targetFile = $targetDir . $fileId . '_' . $sanitizedName;

            if (move_uploaded_file($file['tmp_name'], $targetFile)) {
                // Update metadata
                $metadata = loadMetadata();
                $fileInfo = [
                    'id' => $fileId,
                    'name' => $originalName,
                    'sanitized_name' => $sanitizedName,
                    'type' => $type,
                    'extension' => $fileExtension,
                    'file_path' => $targetFile,
                    'relative_path' => 'php/uploads/' . ($type === 'animation' ? 'animations' : 'structures') . '/' . $fileId . '_' . $sanitizedName,
                    'size' => filesize($targetFile),
                    'timestamp' => date('c'),
                    'content_type' => $file['type']
                ];

                if ($type === 'animation') {
                    $metadata['animations'][] = $fileInfo;
                } else {
                    $metadata['structures'][] = $fileInfo;
                }

                if (saveMetadata($metadata)) {
                    echo json_encode([
                        'success' => true,
                        'id' => $fileId,
                        'message' => "File '{$originalName}' uploaded successfully",
                        'file_info' => $fileInfo
                    ]);
                } else {
                    // Clean up uploaded file if metadata save fails
                    unlink($targetFile);
                    http_response_code(500);
                    echo json_encode(['success' => false, 'error' => 'Failed to save metadata']);
                }
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Failed to save file to server']);
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
                break;
            }

            if (isset($input['action']) && $input['action'] === 'clear_all') {
                // Clear all files
                $files = glob($structuresDir . '*');
                foreach($files as $file) {
                    if(is_file($file)) unlink($file);
                }

                $files = glob($animationsDir . '*');
                foreach($files as $file) {
                    if(is_file($file)) unlink($file);
                }

                // Clear metadata
                saveMetadata(['structures' => [], 'animations' => []]);

                echo json_encode(['success' => true, 'message' => 'All files cleared']);
            } elseif (isset($input['id']) && isset($input['type'])) {
                // Delete specific file
                $type = $input['type'];
                $id = $input['id'];
                
                $metadata = loadMetadata();
                $targetArrayKey = ($type === 'animation') ? 'animations' : 'structures';
                $fileFound = false;

                foreach ($metadata[$targetArrayKey] as $index => $fileInfo) {
                    if ($fileInfo['id'] === $id) {
                        // Delete physical file
                        if (file_exists($fileInfo['file_path'])) {
                            unlink($fileInfo['file_path']);
                        }

                        // Remove from metadata
                        array_splice($metadata[$targetArrayKey], $index, 1);
                        $fileFound = true;
                        break;
                    }
                }

                if ($fileFound) {
                    saveMetadata($metadata);
                    echo json_encode(['success' => true, 'message' => 'File deleted']);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'File not found']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid delete request']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}

// Ensure clean output
ob_end_flush();
?>
