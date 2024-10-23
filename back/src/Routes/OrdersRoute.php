<?php

require_once("Services/OrdersService.php");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $result = readOrders();
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $total = $_POST['total'];
    $tax = $_POST['tax'];

    $result = createOrder($total, $tax);
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $code = $_GET['code'];
    $result = deleteOrder($code);
    echo $result;
}

?>