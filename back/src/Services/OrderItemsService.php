<?php

require_once('Connection.php');

function readOrderItems($code) {
    global $myPDO;

    $statement = $myPDO->query("SELECT order_item.order_code, 
                                order_item.amount, 
                                order_item.price, 
                                orders.total, 
                                orders.tax, 
                                products.name
                                FROM order_item
                                INNER JOIN orders ON order_item.order_code = orders.code
                                INNER JOIN products ON order_item.product_code = products.code
                                WHERE order_code = {$code};");

    $result = $statement->fetchALL(PDO::FETCH_ASSOC);
    return json_encode($result);
}

function createOrderItem($order, $product, $amount, $price, $tax) {
    global $myPDO;

    $statement = $myPDO->prepare("INSERT INTO order_item (order_code, product_code, amount, price, tax) VALUES (:order, :product, :amount, :price, :tax)");
    $statement->bindParam(':order', $order);
    $statement->bindParam(':product', $product);
    $statement->bindParam(':amount', $amount);
    $statement->bindParam(':price', $price);
    $statement->bindParam(':tax', $tax);
    $statement->execute();
    updateStock($product, $amount);    
}

function deleteOrderItem($code) {
    global $myPDO;

    $statement = $myPDO->prepare("DELETE FROM order_item WHERE code = :code");
    $statement->bindParam(':code', $code);
    $statement->execute();
}

function updateStock($productCode, $amount) {
    global $myPDO;

    $item = itemsStorage($productCode);
    $newAmount = $item['amount'] - $amount;

    $order_item = $myPDO->query("UPDATE products SET amount = $newAmount WHERE code = {$productCode}");
    $order_item = $order_item->execute();
}

function itemsStorage($productCode) {
    global $myPDO;

    $statement = $myPDO->query("SELECT * FROM products WHERE code = {$productCode}");
    $result = $statement->fetch();
    return $result;
}
?>