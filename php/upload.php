
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function jsonResponse($success, $data = null, $error = null) {
    $response = ['success' => $success];
    if ($data !== null) $response['data'] = $data;
    if ($error !== null) $response['error'] = $error;
    echo json_encode($response);
    exit();
}

function logError($message) {
    error_log(date('Y-m-d H:i:s') . " - " . $message . "\n", 3, 'uploads/error.log');
}

try {
    // Create upload directories if they don't exist
    $structuresDir = __DIR__ . '/uploads/structures/';
    $animationsDir = __DIR__ . '/uploads/animations/';
    
    if (!file_exists($structuresDir)) {
        mkdir($structuresDir, 0755, true);
    }
    if (!file_exists($animationsDir)) {
        mkdir($animationsDir, 0755, true);
    }

    // Handle GET request for listing files
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'list') {
        $structures = [];
        $animations = [];
        
        // Load structures
        if (is_dir($structuresDir)) {
            $files = scandir($structuresDir);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && is_file($structuresDir . $file)) {
                    $filePath = $structuresDir . $file;
                    $structures[] = [
                        'id' => pathinfo($file, PATHINFO_FILENAME),
                        'name' => $file,
                        'type' => pathinfo($file, PATHINFO_EXTENSION),
                        'size' => filesize($filePath),
                        'timestamp' => filemtime($filePath) * 1000 // Convert to milliseconds for JS
                    ];
                }
            }
        }
        
        // Load animations
        if (is_dir($animationsDir)) {
            $files = scandir($animationsDir);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && is_file($animationsDir . $file)) {
                    $filePath = $animationsDir . $file;
                    $animations[] = [
                        'id' => pathinfo($file, PATHINFO_FILENAME),
                        'name' => $file,
                        'type' => pathinfo($file, PATHINFO_EXTENSION),
                        'size' => filesize($filePath),
                        'timestamp' => filemtime($filePath) * 1000 // Convert to milliseconds for JS
                    ];
                }
            }
        }
        
        jsonResponse(true, ['structures' => $structures, 'animations' => $animations]);
    }

    // Handle POST request for file upload
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_FILES['file']) || !isset($_POST['type'])) {
            jsonResponse(false, null, 'Missing file or type parameter');
        }
        
        $file = $_FILES['file'];
        $type = $_POST['type'];
        
        // Validate file upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File too large (server limit)',
                UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
                UPLOAD_ERR_PARTIAL => 'File upload incomplete',
                UPLOAD_ERR_NO_FILE => 'No file uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
                UPLOAD_ERR_CANT_WRITE => 'Cannot write to disk',
                UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
            ];
            $errorMsg = isset($errorMessages[$file['error']]) ? $errorMessages[$file['error']] : 'Unknown upload error';
            jsonResponse(false, null, $errorMsg);
        }
        
        // Validate file type
        if ($type === 'structure') {
            $allowedExtensions = ['pdb', 'mol', 'sdf', 'xyz', 'cif'];
            $targetDir = $structuresDir;
        } elseif ($type === 'animation') {
            $allowedExtensions = ['mp4', 'webm', 'avi', 'mov'];
            $targetDir = $animationsDir;
        } else {
            jsonResponse(false, null, 'Invalid file type specified');
        }
        
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($fileExtension, $allowedExtensions)) {
            jsonResponse(false, null, "Invalid file extension. Allowed: " . implode(', ', $allowedExtensions));
        }
        
        // Generate unique filename
        $fileName = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
        $targetPath = $targetDir . $fileName;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            chmod($targetPath, 0644);
            jsonResponse(true, [
                'id' => pathinfo($fileName, PATHINFO_FILENAME),
                'name' => $file['name'],
                'type' => $fileExtension,
                'size' => filesize($targetPath),
                'timestamp' => time() * 1000
            ]);
        } else {
            logError("Failed to move uploaded file: " . $file['name']);
            jsonResponse(false, null, 'Failed to save file to server');
        }
    }

    // Handle DELETE request
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            jsonResponse(false, null, 'Invalid JSON data');
        }
        
        if (isset($input['action']) && $input['action'] === 'clear_all') {
            // Clear all files
            $cleared = 0;
            
            // Clear structures
            if (is_dir($structuresDir)) {
                $files = glob($structuresDir . '*');
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                        $cleared++;
                    }
                }
            }
            
            // Clear animations
            if (is_dir($animationsDir)) {
                $files = glob($animationsDir . '*');
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                        $cleared++;
                    }
                }
            }
            
            jsonResponse(true, ['cleared' => $cleared]);
        } else {
            // Delete specific file
            if (!isset($input['id']) || !isset($input['type'])) {
                jsonResponse(false, null, 'Missing file ID or type');
            }
            
            $fileId = $input['id'];
            $type = $input['type'];
            
            $targetDir = ($type === 'structure') ? $structuresDir : $animationsDir;
            
            // Find file with matching ID (prefix)
            $files = glob($targetDir . $fileId . '_*');
            if (empty($files)) {
                jsonResponse(false, null, 'File not found');
            }
            
            $filePath = $files[0];
            if (unlink($filePath)) {
                jsonResponse(true, ['deleted' => basename($filePath)]);
            } else {
                jsonResponse(false, null, 'Failed to delete file');
            }
        }
    }

    // Invalid request method
    jsonResponse(false, null, 'Invalid request method');

} catch (Exception $e) {
    logError("Exception: " . $e->getMessage());
    jsonResponse(false, null, 'Server error: ' . $e->getMessage());
} catch (Error $e) {
    logError("Error: " . $e->getMessage());
    jsonResponse(false, null, 'Server error: ' . $e->getMessage());
}
?>
