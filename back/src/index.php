<?php

header ('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
header ('Access-Control-Allow-Origin: *');
header ('Access-Control-Allow-Headers: *');
header ('Content-Type: application/json');

require_once("Connection.php");

if ($_SERVER['REQUEST_URI'] === '/categories' || strpos($_SERVER['REQUEST_URI'], '/categories?code=') === 0) {
    require_once("Routes/CategoriesRoute.php");
}

if ($_SERVER['REQUEST_URI'] === '/products' || strpos($_SERVER['REQUEST_URI'], '/products?code=') === 0) {
    require_once("Routes/ProductsRoute.php");
}

if ($_SERVER['REQUEST_URI'] === '/orderitems' || strpos($_SERVER['REQUEST_URI'], '/orderitems?code=') === 0) {
    require_once("Routes/OrderItemsRoute.php");
}

if ($_SERVER['REQUEST_URI'] === '/orders' || strpos($_SERVER['REQUEST_URI'], '/orders?code=') === 0) {
    require_once("Routes/OrdersRoute.php");
}

?>