<?php
require_once 'database.php';
require __DIR__ . '/../vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

date_default_timezone_set('Europe/Bucharest');

class ProductService {
    private $db;
    private $jwtSecretKey;

    public function __construct() {
        // Initialize the database connection
        $this->db = (new Database())->connect();
        // Get the JWT secret key from environment variables
        $this->jwtSecretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function getAllProducts() {
        header('Content-Type: application/json');
        
        try {
            // Query to fetch product names and their total quantities
            $query = "SELECT name, SUM(quantity) as quantity FROM products GROUP BY name";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Return the products data as JSON response
            echo json_encode(['status' => 'success', 'products' => $products]);
        } catch (PDOException $e) {
            // Handle database errors and return error response
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch products: ' . $e->getMessage()]);
        }
    }
    
    public function addProduct($data) {
        header('Content-Type: application/json');
        
        // Validate input data
        if (empty($data->name) || empty($data->category) || !is_numeric($data->quantity)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
            return;
        }
    
        try {
            // Insert a new product into the database
            $query = "INSERT INTO products (name, category, quantity, id) VALUES (:name, :category, :quantity, :id)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':name', $data->name, PDO::PARAM_STR);
            $stmt->bindParam(':category', $data->category, PDO::PARAM_STR);
            $stmt->bindParam(':quantity', $data->quantity, PDO::PARAM_INT);
            $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);
    
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Product added successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to add product']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error occurred: ' . $e->getMessage()]);
        }
    }
    
    public function getAllProductInstances() {
        header('Content-Type: application/json');
        
        try {
            // Query to fetch all product instances sorted by prod_id
            $query = "SELECT prod_id, name, category, quantity FROM products ORDER BY prod_id ASC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            // Return the product instances data as JSON response
            echo json_encode(['status' => 'success', 'products' => $products]);
        } catch (PDOException $e) {
            // Handle database errors and return error response
            echo json_encode(['status' => 'error', 'message' => 'Failed to fetch product instances: ' . $e->getMessage()]);
        }
    }
    
    public function deleteSelectedProducts($data) {
        header('Content-Type: application/json');
    
        // Validate input data
        if (empty($data->ids) || !is_array($data->ids)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid or missing product IDs']);
            return;
        }
    
        // Generate placeholders for the product IDs
        $placeholders = rtrim(str_repeat('?,', count($data->ids)), ',');
        $query = "DELETE FROM products WHERE prod_id IN ($placeholders)";
    
        try {
            $stmt = $this->db->prepare($query);
            if ($stmt->execute($data->ids)) {
                echo json_encode(['status' => 'success', 'message' => 'Products deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete products']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error occurred: ' . $e->getMessage()]);
        }
    }
}
?>