<?php

$bytes = random_bytes(32); // 256 bits is 32 bytes
$jwtSecretKey = bin2hex($bytes);
echo $jwtSecretKey; // Output the generated key
?>