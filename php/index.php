<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header("Content-Type: application/json; charset=UTF-8");
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

require_once 'C:/xampp/htdocs/warehouse/vendor/autoload.php';
require_once 'UserService.php';
require_once 'AuthMiddleware.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
}

$authMiddleware = new AuthMiddleware();
$data = json_decode(file_get_contents("php://input"));
$userService = new UserService();

$authenticatedActions = ['updateUserProfile', 'getAllProducts', 'addProduct', 'getAllProductInstances', 'deleteSelectedProducts'];

if (isset($data->action) && in_array($data->action, $authenticatedActions)) {
    // Validate JWT for actions that require authentication
    $authMiddleware->validateToken();
}

switch ($data->action ?? '') {
    case 'register':
        echo $userService->registerUser($data);
        break;
    case 'login':
        echo $userService->loginUser($data);
        break;
    case 'logout':
        echo $userService->logoutUser($data->id);
        break;
    case 'updateUserProfile':
        echo $userService->updateUserProfile($data);
        break;
    case 'getAllProducts':
        echo $userService->getAllProducts();
        break;
    case 'addProduct':
        echo $userService->addProduct($data);
        break;
    case 'getAllProductInstances':
        echo $userService->getAllProductInstances();
        break;
    case 'deleteSelectedProducts':
        echo $userService->deleteSelectedProducts($data);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Action not recognized or no action specified']);
        break;
}

?>
