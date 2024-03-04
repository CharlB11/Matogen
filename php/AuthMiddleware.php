<?php
require_once 'C:/xampp/htdocs/warehouse/vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    private $jwtSecretKey = '01b48b0fe183ce1b24bc4fc80e8145b27e9bc2389cc2a0f7a79b02af88c2ac5f'; 

    public function __construct() {
        
    }

    public function validateToken() {
        $token = $this->getTokenFromHeader();
        if (empty($token)) {
            $this->unauthorized("Access denied. No token provided.");
        }

        try {
            JWT::decode($token, new Key($this->jwtSecretKey, 'HS256'));
            // Token is valid. You could further implement role checks or other logic as needed here
        } catch (Exception $e) {
            $this->unauthorized("Access denied. Invalid token.");
        }
    }

    private function getTokenFromHeader() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            return substr($authHeader, 7);
        }
        return null;
    }

    private function unauthorized($message) {
        http_response_code(401);
        echo json_encode(["message" => $message]);
        exit;
    }
}
