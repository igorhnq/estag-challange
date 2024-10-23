<?php

require_once('Connection.php');

function readOrders() {
    global $myPDO;

    $statement = $myPDO->query("SELECT * FROM orders ORDER BY code DESC");
    $result = $statement->fetchALL(PDO::FETCH_ASSOC);

    return json_encode($result);
}

function createOrder($total, $tax) {
    global $myPDO;

    $statement = $myPDO->prepare("INSERT INTO orders (total, tax) VALUES (:total, :tax)");
    $statement->bindParam(':total', $total);
    $statement->bindParam(':tax', $tax);
    $statement->execute();

    $orderCode = $myPDO->lastInsertId();
    return json_encode(['order_code' => $orderCode]);
}

function deleteOrder($code) {
    global $myPDO;

    $statement = $myPDO->prepare("DELETE FROM orders WHERE code = :code");
    $statement->bindParam(':code', $code);
    $statement->execute();
}

?>