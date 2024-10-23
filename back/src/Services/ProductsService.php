<?php

require_once('Connection.php');

function readProducts() {
    global $myPDO;

    $statement = $myPDO->query("SELECT products.code, products.name, amount, price, categories.name AS category_name
                                FROM
                                products
                                INNER JOIN categories ON categories.code = products.category_code");

    $result = $statement->fetchALL(PDO::FETCH_ASSOC); 
    return json_encode($result);
}

function createProduct($productName, $productPrice, $productAmount, $productCategory) {
    global $myPDO;

    $statement = $myPDO->prepare("INSERT INTO products (name, price, amount, category_code) values (:productName, :productPrice, :productAmount, :productCategory)");
    $statement->bindParam(':productName', $productName);
    $statement->bindParam(':productPrice', $productPrice);
    $statement->bindParam(':productAmount', $productAmount);
    $statement->bindParam(':productCategory', $productCategory);
    $statement->execute();

    return "Produto criado!";
}

function deleteProduct($code) {
    global $myPDO;

    $statement = $myPDO->prepare("DELETE FROM products WHERE code = :code");
    $statement->bindParam(':code', $code);
    $statement->execute();
}

?>