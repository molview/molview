
<?php
/**
 * File Upload API for MolView - Handle permanent file storage
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// Create necessary directories
$uploadDir = 'uploads/';
$structuresDir = $uploadDir . 'structures/';
$animationsDir = $uploadDir . 'animations/';
$metadataFile = $uploadDir . 'metadata.json';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
if (!file_exists($structuresDir)) {
    mkdir($structuresDir, 0755, true);
}
if (!file_exists($animationsDir)) {
    mkdir($animationsDir, 0755, true);
}

function loadMetadata() {
    global $metadataFile;
    if (file_exists($metadataFile)) {
        return json_decode(file_get_contents($metadataFile), true) ?: ['structures' => [], 'animations' => []];
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

switch ($method) {
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'list') {
            echo json_encode(loadMetadata());
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
        
    case 'POST':
        if (isset($_FILES['file'])) {
            $file = $_FILES['file'];
            $type = $_POST['type'] ?? 'structure'; // 'structure' or 'animation'
            
            if ($file['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(['error' => 'Upload failed']);
                break;
            }
            
            $fileId = uniqid();
            $originalName = $file['name'];
            $sanitizedName = sanitizeFilename($originalName);
            $fileExtension = pathinfo($originalName, PATHINFO_EXTENSION);
            
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
                    'size' => filesize($targetFile),
                    'timestamp' => date('c'),
                    'content_type' => $file['type']
                ];
                
                if ($type === 'animation') {
                    $metadata['animations'][] = $fileInfo;
                } else {
                    $metadata['structures'][] = $fileInfo;
                }
                
                saveMetadata($metadata);
                
                echo json_encode([
                    'success' => true,
                    'id' => $fileId,
                    'message' => "File '{$originalName}' uploaded successfully",
                    'file_info' => $fileInfo
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save file']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded']);
        }
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $fileId = $input['id'] ?? '';
        $type = $input['type'] ?? '';
        
        if ($fileId && $type) {
            $metadata = loadMetadata();
            $targetArray = ($type === 'animation') ? 'animations' : 'structures';
            
            $fileFound = false;
            foreach ($metadata[$targetArray] as $index => $fileInfo) {
                if ($fileInfo['id'] === $fileId) {
                    // Delete physical file
                    if (file_exists($fileInfo['file_path'])) {
                        unlink($fileInfo['file_path']);
                    }
                    
                    // Remove from metadata
                    array_splice($metadata[$targetArray], $index, 1);
                    $fileFound = true;
                    break;
                }
            }
            
            if ($fileFound) {
                saveMetadata($metadata);
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'File not found']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid parameters']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
