<?php

require_once('Services/OrderItemsService.php');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $code = $_GET["code"];
    $result = readOrderItems($code);
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $order = $_POST["order_code"];
    $product = $_POST["home-produt-select"];
    $amount = $_POST["home-product-amount"];
    $tax = $_POST["home-product-tax"];
    $price = $_POST["home-product-price"];

    $result = createOrderItem($order, $product, $amount, $price, $tax);
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $code = $_GET["code"];
    $result = deleteOrderItem($code);
    echo $result;
}

?>