<?php 

require_once("Services/ProductsService.php");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $result = readProducts();
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $productName = $_POST["product-name"];
    $productName = strtoupper($productName);

    $productPrice = $_POST["product-price"];
    $productAmount = $_POST["product-amount"];
    $productCategory = $_POST["product-select"];

    $result = createProduct($productName, $productPrice, $productAmount, $productCategory);
    echo $result; 
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $code = $_GET["code"];
    $result = deleteProduct($code);
    echo $result;
}

?>
