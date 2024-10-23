<?php

require_once('Connection.php');

function readCategories() {
    global $myPDO;

    $statement = $myPDO->query("SELECT * FROM categories");
    $result = $statement->fetchALL(PDO::FETCH_ASSOC);

    return json_encode($result);
}

function createCategory($categoryName, $categoryTax) {
    global $myPDO;

    $statement = $myPDO->prepare("INSERT INTO categories (name, tax) VALUES (:categoryName, :categoryTax)");
    $statement->bindParam(':categoryName', $categoryName);
    $statement->bindParam(':categoryTax', $categoryTax);
    $statement->execute();
}

function deleteCategory($code) {
    global $myPDO;
 
    $statement = $myPDO->prepare("DELETE FROM categories WHERE code = :code");
    $statement->bindParam(':code', $code);
    $statement->execute();
}

?>