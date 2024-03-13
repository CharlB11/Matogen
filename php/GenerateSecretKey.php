<?php

$bytes = random_bytes(32); 
$jwtSecretKey = bin2hex($bytes);
echo $jwtSecretKey; // Output the generated key
?>