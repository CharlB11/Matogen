<?php
require __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

class AuthMiddleware {
    private $jwtSecretKey;

    public function __construct() {
        // Load environment variables from .env file
        $dotenv = Dotenv::createImmutable(__DIR__);
        $dotenv->load();

        // Get the JWT secret key from the environment variables
        $this->jwtSecretKey = $_ENV['JWT_SECRET_KEY'];
    }

    public function validateToken() {
        // Get the JWT token from the Authorization header
        $token = $this->getTokenFromHeader();
        if (empty($token)) {
            $this->unauthorized("Access denied. No token provided.");
        }

        try {
            // Decode and validate the JWT token
            JWT::decode($token, new Key($this->jwtSecretKey, 'HS256'));
            // Token is valid. You could further implement role checks or other logic as needed here
        } catch (Exception $e) {
            // Token is invalid or an error occurred during decoding
            $this->unauthorized("Access denied. Invalid token.");
        }
    }

    private function getTokenFromHeader() {
        // Get all the request headers
        $headers = getallheaders();
        // Extract the Authorization header
        $authHeader = $headers['Authorization'] ?? null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            // Remove the "Bearer " prefix from the token
            return substr($authHeader, 7);
        }
        return null;
    }

    private function unauthorized($message) {
        // Set the HTTP response code to 401 Unauthorized
        http_response_code(401);
        // Return the error message as JSON
        echo json_encode(["message" => $message]);
        exit;
    }
}