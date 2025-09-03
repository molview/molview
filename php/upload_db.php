<?php
/**
 * Enhanced File Upload API with Database Storage for MolView
 * This replaces the file-based storage with permanent database storage
 */

// Prevent any output before JSON response
ob_start();
error_reporting(0);

require_once 'database.php';

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
    echo json_encode(['success' => false, 'error' => 'Failed to create directories: ' . $e->getMessage()]);
    exit();
}

// Initialize database
try {
    $db = new LibraryDatabase();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

function sanitizeFilename($filename) {
    return preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
}

function formatFileSize($bytes) {
    if ($bytes >= 1073741824) {
        return number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    }
    return $bytes . ' bytes';
}

try {
    switch ($method) {
        case 'GET':
            $action = $_GET['action'] ?? '';

            if ($action === 'list') {
                // Get files from database
                $structures = $db->getFiles('structure');
                $animations = $db->getFiles('animation');
                
                // Format file data for frontend
                $formattedStructures = array_map(function($file) {
                    return [
                        'id' => $file['file_id'],
                        'name' => $file['original_name'],
                        'type' => $file['category'],
                        'extension' => $file['file_type'],
                        'file_path' => $file['file_path'],
                        'relative_path' => str_replace(__DIR__ . '/', '', $file['file_path']),
                        'size' => $file['file_size'],
                        'formatted_size' => formatFileSize($file['file_size']),
                        'timestamp' => $file['upload_date'],
                        'mime_type' => $file['mime_type']
                    ];
                }, $structures);
                
                $formattedAnimations = array_map(function($file) {
                    return [
                        'id' => $file['file_id'],
                        'name' => $file['original_name'],
                        'type' => $file['category'],
                        'extension' => $file['file_type'],
                        'file_path' => $file['file_path'],
                        'relative_path' => str_replace(__DIR__ . '/', '', $file['file_path']),
                        'size' => $file['file_size'],
                        'formatted_size' => formatFileSize($file['file_size']),
                        'timestamp' => $file['upload_date'],
                        'mime_type' => $file['mime_type']
                    ];
                }, $animations);

                echo json_encode([
                    'success' => true, 
                    'data' => [
                        'structures' => $formattedStructures,
                        'animations' => $formattedAnimations
                    ]
                ]);
                
            } elseif ($action === 'stats') {
                // Get statistics
                $stats = $db->getStats();
                echo json_encode(['success' => true, 'stats' => $stats]);
                
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
                $errorMessages = [
                    UPLOAD_ERR_INI_SIZE => 'File too large (server limit)',
                    UPLOAD_ERR_FORM_SIZE => 'File too large (form limit)',
                    UPLOAD_ERR_PARTIAL => 'File partially uploaded',
                    UPLOAD_ERR_NO_FILE => 'No file uploaded',
                    UPLOAD_ERR_NO_TMP_DIR => 'No temporary directory',
                    UPLOAD_ERR_CANT_WRITE => 'Cannot write file',
                    UPLOAD_ERR_EXTENSION => 'Upload stopped by extension'
                ];
                
                $errorMsg = $errorMessages[$file['error']] ?? 'Unknown upload error';
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => $errorMsg]);
                break;
            }

            // File size validation - Allow large files up to server limits
            $maxSize = 500 * 1024 * 1024; // 500MB limit (matches php.ini)
            if ($file['size'] > $maxSize) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'File too large (max ' . formatFileSize($maxSize) . ')']);
                break;
            }

            $fileId = uniqid('file_', true);
            $originalName = basename($file['name']);
            $sanitizedName = sanitizeFilename($originalName);
            $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            // Validate file type based on category
            if ($type === 'animation') {
                $allowedExtensions = ['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv', 'wmv', '3gp', '3g2', 'asf', 'm4v', 'mpg', 'mpeg', 'm2v', 'm4p', 'ts', 'mts', 'm2ts', 'vob', 'ogv', 'ogg', 'rm', 'rmvb', 'divx', 'xvid', 'f4v', 'swf', 'gif', 'apng'];
            } else {
                $allowedExtensions = ['pdb', 'mol', 'sdf', 'xyz', 'cif', 'mol2', 'cml', 'mmcif', 'pqr', 'gro', 'xtc', 'trr', 'dcd', 'crd', 'psf', 'top', 'itp', 'mdp', 'prmtop', 'inpcrd', 'rst', 'nc', 'netcdf', 'h5', 'hdf5', 'dx', 'cube', 'wrl', 'vrml', 'obj', 'ply', 'stl', 'off', 'x3d', 'json', 'bson', 'yaml', 'xml', 'chem', 'cdx', 'cdxml', 'hin', 'mop', 'zmat', 'g03', 'g09', 'g16', 'inp', 'out', 'log', 'fch', 'chk', 'wfn', 'molden', 'adf', 'gamess', 'nwchem', 'orca', 'qchem', 'turbomole', 'vasp', 'cp2k', 'dftb', 'lammps', 'amber', 'gromacs', 'namd', 'charmm', 'openmm', 'hoomd', 'txt'];
            }

            if (!in_array($fileExtension, $allowedExtensions)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false, 
                    'error' => 'File type not allowed. Allowed types: ' . implode(', ', $allowedExtensions)
                ]);
                break;
            }

            // Determine storage directory and file path
            $targetDir = ($type === 'animation') ? $animationsDir : $structuresDir;
            $targetFile = $targetDir . $fileId . '_' . $sanitizedName;

            if (move_uploaded_file($file['tmp_name'], $targetFile)) {
                // Save to database
                $dbResult = $db->saveFile(
                    $fileId,
                    $originalName,
                    $targetFile,
                    $fileExtension,
                    $type,
                    filesize($targetFile),
                    $file['type']
                );

                if ($dbResult['success']) {
                    echo json_encode([
                        'success' => true,
                        'id' => $fileId,
                        'message' => "File '{$originalName}' uploaded and saved to database successfully",
                        'file_info' => [
                            'id' => $fileId,
                            'name' => $originalName,
                            'type' => $type,
                            'extension' => $fileExtension,
                            'size' => filesize($targetFile),
                            'formatted_size' => formatFileSize(filesize($targetFile)),
                            'path' => $targetFile,
                            'relative_path' => str_replace(__DIR__ . '/', '', $targetFile),
                            'mime_type' => $file['type'],
                            'upload_date' => date('c')
                        ]
                    ]);
                } else {
                    // Clean up uploaded file if database save fails
                    unlink($targetFile);
                    http_response_code(500);
                    echo json_encode(['success' => false, 'error' => 'Failed to save to database: ' . $dbResult['error']]);
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
                // Clear all files from database and filesystem
                $category = $input['category'] ?? null;
                $result = $db->clearAllFiles($category);
                
                echo json_encode($result);
                
            } elseif (isset($input['id'])) {
                // Delete specific file
                $fileId = $input['id'];
                $result = $db->deleteFile($fileId);
                
                if ($result['success']) {
                    echo json_encode(['success' => true, 'message' => 'File deleted from database and server']);
                } else {
                    http_response_code(404);
                    echo json_encode($result);
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