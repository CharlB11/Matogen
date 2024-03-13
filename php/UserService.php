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
        // Initialize the database connection
        $this->db = (new Database())->connect();
        // Set the JWT secret key from environment variable
        $this->jwtSecretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function registerUser($data) {
        $email = $data->email; 

        // Check if the user already exists
        $checkQuery = "SELECT COUNT(*) FROM users WHERE email = :email";
        $checkStmt = $this->db->prepare($checkQuery);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();

        if ($checkStmt->fetchColumn() > 0) {
            return json_encode(['status' => 'error', 'message' => 'User already exists']);
        }
        
        // Extract user data from the request
        $name = $data->name;
        $role = $data->role;
        $createdOn = date('Y-m-d H:i:s');
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        // Insert the user into the database
        $query = "INSERT INTO users (name, password, email, role, createdOn) VALUES (:name, :hashedPassword, :email, :role, :createdOn)";
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

        // Retrieve the user from the database based on email
        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            // Verify the password
            if (password_verify($password, $user['password'])) {
                $issuedAt = time();
                $expirationTime = $issuedAt + 3600; // Token expiration time (1 hour)
                
                // Create the JWT payload
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
                
                // Generate the JWT
                $jwt = JWT::encode($payload, $this->jwtSecretKey, 'HS256');

                $lastLoginTime = date('Y-m-d H:i:s');
                $tokenExpiryDateTime = date('Y-m-d H:i:s', $expirationTime);
                
                // Update the user's last login time and token in the database
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

    // Check if the new email already exists for another user
    $sql = "SELECT COUNT(*) FROM users WHERE email = :email AND id != :id";
    $stmt = $this->db->prepare($sql);
    $stmt->bindValue(':email', $newEmail, PDO::PARAM_STR);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
        return;
    }

    // Retrieve the user's role
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
    

    // Update the user's profile in the database
    $sql = "UPDATE users SET email = :email, name = :name, updatedOn = NOW() WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([':email' => $newEmail, ':name' => $newName, ':id' => $id]);

    if ($stmt->rowCount()) {
        // User was updated, generate new JWT
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600, // Token expiration time (1 hour) 
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
    // Invalidate the user's token in the database
    $query = "UPDATE users SET token = NULL, tokenExpiry = NULL WHERE id = :id";
    $stmt = $this->db->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        return json_encode(['status' => 'success', 'message' => 'Logout successful']);
    } else {
        error_log('Logout failed for user ID: ' . $id);
        return json_encode(['status' => 'error', 'message' => 'Logout failed']);
    }
}
}
?>