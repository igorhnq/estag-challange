<?php

require_once("Services/CategoriesService.php");

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $result = readCategories();
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $categoryName = $_POST["category-name"];
    $categoryName = strtoupper($categoryName);

    $categoryTax = $_POST["category-tax"];

    $result = createCategory($categoryName, $categoryTax);
    echo $result;
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $code = $_GET["code"];
    $result = deleteCategory($code);
    echo $result;
}

?>