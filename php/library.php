<?php
/**
 * Library API for MolView - Handle structure and animation storage
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
$input = json_decode(file_get_contents('php://input'), true);

// Simple file-based storage (for production, use a proper database)
$structuresFile = 'data/structures.json';
$animationsFile = 'data/animations.json';

// Ensure data directory exists
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

function loadData($file) {
    if (file_exists($file)) {
        return json_decode(file_get_contents($file), true) ?: [];
    }
    return [];
}

function saveData($file, $data) {
    return file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

switch ($method) {
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'structures') {
            echo json_encode(loadData($structuresFile));
        } elseif ($action === 'animations') {
            echo json_encode(loadData($animationsFile));
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
        
    case 'POST':
        $action = $input['action'] ?? '';
        
        if ($action === 'save_structure') {
            $structures = loadData($structuresFile);
            $structure = [
                'id' => uniqid(),
                'name' => $input['name'],
                'type' => $input['type'],
                'content' => $input['content'],
                'timestamp' => date('c'),
                'size' => strlen($input['content'])
            ];
            $structures[] = $structure;
            
            if (saveData($structuresFile, $structures)) {
                echo json_encode(['success' => true, 'id' => $structure['id']]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save structure']);
            }
            
        } elseif ($action === 'save_animation') {
            $animations = loadData($animationsFile);
            $animation = [
                'id' => uniqid(),
                'name' => $input['name'],
                'type' => $input['type'],
                'content' => $input['content'],
                'timestamp' => date('c'),
                'size' => strlen($input['content'])
            ];
            $animations[] = $animation;
            
            if (saveData($animationsFile, $animations)) {
                echo json_encode(['success' => true, 'id' => $animation['id']]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save animation']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
        }
        break;
        
    case 'DELETE':
        $action = $input['action'] ?? '';
        $id = $input['id'] ?? '';
        
        if ($action === 'delete_structure' && $id) {
            $structures = loadData($structuresFile);
            $structures = array_filter($structures, function($s) use ($id) {
                return $s['id'] !== $id;
            });
            
            if (saveData($structuresFile, array_values($structures))) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete structure']);
            }
            
        } elseif ($action === 'delete_animation' && $id) {
            $animations = loadData($animationsFile);
            $animations = array_filter($animations, function($a) use ($id) {
                return $a['id'] !== $id;
            });
            
            if (saveData($animationsFile, array_values($animations))) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to delete animation']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action or missing ID']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>