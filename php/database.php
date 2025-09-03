<?php
/**
 * Database connection and management for MolView Library
 * Uses SQLite for permanent file storage with metadata
 */

class LibraryDatabase {
    private $db;
    private $dbPath;
    
    public function __construct($dbPath = 'data/molview_library.db') {
        $this->dbPath = $dbPath;
        $this->initDatabase();
    }
    
    private function initDatabase() {
        try {
            // Ensure data directory exists
            $dataDir = dirname($this->dbPath);
            if (!file_exists($dataDir)) {
                mkdir($dataDir, 0755, true);
            }
            
            // Create database connection
            $this->db = new PDO('sqlite:' . $this->dbPath);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Create tables if they don't exist
            $this->createTables();
            
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }
    
    private function createTables() {
        $sql = "
            CREATE TABLE IF NOT EXISTS uploaded_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_id TEXT UNIQUE NOT NULL,
                original_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_type TEXT NOT NULL,
                category TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                mime_type TEXT,
                upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            );
            
            CREATE INDEX IF NOT EXISTS idx_file_id ON uploaded_files(file_id);
            CREATE INDEX IF NOT EXISTS idx_category ON uploaded_files(category);
            CREATE INDEX IF NOT EXISTS idx_upload_date ON uploaded_files(upload_date);
        ";
        
        $this->db->exec($sql);
    }
    
    public function saveFile($fileId, $originalName, $filePath, $fileType, $category, $fileSize, $mimeType = null) {
        try {
            $sql = "INSERT INTO uploaded_files (file_id, original_name, file_path, file_type, category, file_size, mime_type) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([$fileId, $originalName, $filePath, $fileType, $category, $fileSize, $mimeType]);
            
            if ($result) {
                return [
                    'success' => true,
                    'id' => $this->db->lastInsertId(),
                    'file_id' => $fileId
                ];
            }
            
            return ['success' => false, 'error' => 'Failed to save file metadata'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    public function getFiles($category = null) {
        try {
            if ($category) {
                $sql = "SELECT * FROM uploaded_files WHERE category = ? AND is_active = 1 ORDER BY upload_date DESC";
                $stmt = $this->db->prepare($sql);
                $stmt->execute([$category]);
            } else {
                $sql = "SELECT * FROM uploaded_files WHERE is_active = 1 ORDER BY upload_date DESC";
                $stmt = $this->db->prepare($sql);
                $stmt->execute();
            }
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            return [];
        }
    }
    
    public function getFileById($fileId) {
        try {
            $sql = "SELECT * FROM uploaded_files WHERE file_id = ? AND is_active = 1";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$fileId]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            return false;
        }
    }
    
    public function deleteFile($fileId) {
        try {
            // First get file info to delete physical file
            $fileInfo = $this->getFileById($fileId);
            if (!$fileInfo) {
                return ['success' => false, 'error' => 'File not found'];
            }
            
            // Delete physical file
            if (file_exists($fileInfo['file_path'])) {
                unlink($fileInfo['file_path']);
            }
            
            // Mark as inactive in database (soft delete)
            $sql = "UPDATE uploaded_files SET is_active = 0 WHERE file_id = ?";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([$fileId]);
            
            return ['success' => $result, 'message' => 'File deleted successfully'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    public function clearAllFiles($category = null) {
        try {
            // Get files to delete physical files
            $files = $this->getFiles($category);
            
            // Delete physical files
            foreach ($files as $file) {
                if (file_exists($file['file_path'])) {
                    unlink($file['file_path']);
                }
            }
            
            // Mark all as inactive (soft delete)
            if ($category) {
                $sql = "UPDATE uploaded_files SET is_active = 0 WHERE category = ?";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->execute([$category]);
            } else {
                $sql = "UPDATE uploaded_files SET is_active = 0";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->execute();
            }
            
            return ['success' => $result, 'message' => 'All files cleared successfully'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    public function getStats() {
        try {
            $sql = "SELECT 
                        category,
                        COUNT(*) as file_count,
                        SUM(file_size) as total_size
                    FROM uploaded_files 
                    WHERE is_active = 1 
                    GROUP BY category";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            return [];
        }
    }
}
?>