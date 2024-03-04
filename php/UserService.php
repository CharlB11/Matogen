<?php
require_once 'database.php';
require __DIR__ . '/../vendor/autoload.php'; 

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

date_default_timezone_set('Europe/Bucharest');

class UserService {
    private $db;
    private $jwtSecretKey;

    public function __construct() {
        $this->db = (new Database())->connect();
        $this->jwtSecretKey = '01b48b0fe183ce1b24bc4fc80e8145b27e9bc2389cc2a0f7a79b02af88c2ac5f';
    }

    public function registerUser($data) {
        $email = $data->email; 

        $checkQuery = "SELECT COUNT(*) FROM users WHERE email = :email";
        $checkStmt = $this->db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();

        if ($checkStmt->fetchColumn() > 0) {
            return json_encode(['status' => 'error', 'message' => 'User already exists']);
        }
        
        $name = $data->name;
        $role = $data->role;
        $createdOn = date('Y-m-d H:i:s');
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        $query = "INSERT INTO users (name, password, email, role, createdOn, emailConfirmed) VALUES (:name, :hashedPassword, :email, :role, :createdOn, 0)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':hashedPassword', $hashedPassword);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':createdOn', $createdOn);

        if ($stmt->execute()) {
            return json_encode(['status' => 'success', 'message' => 'Registration successful']);
        } else {
            return json_encode(['status' => 'error', 'message' => 'Registration failed']);
        }
    }
    
    public function loginUser($data) {
        $email = $data->email;
        $password = $data->password;

        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            if (password_verify($password, $user['password'])) {
                $issuedAt = time();
                $expirationTime = $issuedAt + 3600; // Token expiration time een uur
                $payload = [
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'iss' => 'http://localhost:4200',
                    'data' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'name' => $user['name']
                    ]
                ];
                
                $jwt = JWT::encode($payload, $this->jwtSecretKey, 'HS256');

                $lastLoginTime = date('Y-m-d H:i:s');
                $tokenExpiryDateTime = date('Y-m-d H:i:s', $expirationTime);
                $updateQuery = "UPDATE users SET lastLogin = :lastLogin, token = :token, tokenExpiry = :tokenExpiry WHERE email = :email";
                $updateStmt = $this->db->prepare($updateQuery);
                $updateStmt->bindParam(':lastLogin', $lastLoginTime);
                $updateStmt->bindParam(':token', $jwt);
                $updateStmt->bindParam(':tokenExpiry', $tokenExpiryDateTime);
                $updateStmt->bindParam(':email', $email);
                $updateStmt->execute();

                return json_encode(['status' => 'success', 'message' => 'Login successful', 'token' => $jwt]);
            } else {
                return json_encode(['status' => 'error', 'message' => 'Login failed. Incorrect password.']);
            }
        } else {
            return json_encode(['status' => 'error', 'message' => 'Login failed. Email does not exist.']);
        }
 
   }

   public function updateUserProfile($data) {
    $id = $data->id;
    $newEmail = $data->email;
    $newName = $data->name;

    $sql = "SELECT role FROM users WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        return;
    }

    $userRole = $user['role'];
    

    $sql = "UPDATE users SET email = :email, name = :name, updatedOn = NOW() WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([':email' => $newEmail, ':name' => $newName, ':id' => $id]);

    if ($stmt->rowCount()) {
        // User was updated, generate new JWT
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // Een uur 
            'data' => [
                'id' => $id,
                'email' => $newEmail,
                'name' => $newName,
                'role' => $userRole   
            ]
        ];

        $newToken = JWT::encode($payload, $this->jwtSecretKey, 'HS256');

        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully', 'newToken' => $newToken]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update profile']);
    }
}

public function logoutUser($id) {
    $query = "UPDATE users SET token = NULL WHERE id = :id";
    $stmt = $this->db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        return json_encode(['status' => 'success', 'message' => 'Logout successful']);
    } else {
        error_log('Logout failed for user ID: ' . $id);
        return json_encode(['status' => 'error', 'message' => 'Logout failed']);
    }
}
public function getAllProducts() {
    header('Content-Type: application/json');
    
    try {
        $query = "SELECT name, SUM(quantity) as quantity FROM products GROUP BY name";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['status' => 'success', 'products' => $products]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch products: ' . $e->getMessage()]);
    }
}



public function addProduct($data) {
    header('Content-Type: application/json');
    
    if (empty($data->name) || empty($data->category) || !is_numeric($data->quantity)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
        return;
    }

    try {
        $query = "INSERT INTO products (name, category, quantity) VALUES (:name, :category, :quantity)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':name', $data->name, PDO::PARAM_STR);
        $stmt->bindParam(':category', $data->category, PDO::PARAM_STR);
        $stmt->bindParam(':quantity', $data->quantity, PDO::PARAM_INT);

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
        // Query updated to sort by prod_id
        $query = "SELECT prod_id, name, category, quantity FROM products ORDER BY prod_id ASC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['status' => 'success', 'products' => $products]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch product instances: ' . $e->getMessage()]);
    }
}
public function deleteSelectedProducts($data) {
    header('Content-Type: application/json');

    if (empty($data->ids) || !is_array($data->ids)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid or missing product IDs']);
        return;
    }

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
