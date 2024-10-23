const productForm = document.getElementById("products-form");
const productUnitPrice = document.getElementById("unit-price");
const productSelectCategory = document.getElementById("products-select-category");
const productTable = document.getElementById("products-table");
let productName = document.getElementById("products-product-name");
let productAmount = document.getElementById("products-amount");

window.onload = () => {
    loadProductsTable();
}

async function loadProductsTable() {
    (await readProducts()).forEach(product => {
        productAdd(product);
    })
}

async function readProducts() {
    const result = await fetch ('http://localhost/products');
    const products = await result.json();
    return products;
}

async function readCategories() {
    const result = await fetch ('http://localhost/categories');
    const categories = await result.json();
    return categories;
}

async function loadSelectCategories() {
    (await readCategories()).forEach(category => {
        const option = document.createElement("option");
        option.textContent = category.name;
        option.setAttribute("value", category.code);
        
        productSelectCategory.append(option);
    });
}

loadSelectCategories();

productName.oninput = () => {
    let productNameRegex = productName.value.replace(/[^a-zA-Z]/g, "");
    productName.value = productNameRegex;
}

productAmount.oninput = () => {
    let productAmountRegex = productAmount.value.replace(/[^\d]/g, "");
    productAmount.value = productAmountRegex;
}

productUnitPrice.oninput = () => {
    let productUnitPriceRegex = productUnitPrice.value.replace(/[^\d.]/g, "");
    productUnitPrice.value = productUnitPriceRegex;
}

productForm.onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(productForm);

    fetch('http://localhost/products', {

        method: 'POST',
        body: formData,

    }).then(

        loadSelectCategories(),
        clearInputs(),
        location.reload()

    )
    
    clearInputs();
}

function productAdd(product) {
    try {
        const tableRows = document.createElement("tr");
        productTable.append(tableRows);

        const productTableID = document.createElement("td");
        productTableID.textContent = product.code;

        const productTableName = document.createElement("td");
        productTableName.textContent = product.name;

        const productTableAmount = document.createElement("td");
        productTableAmount.textContent = product.amount;

        const productTablePrice = document.createElement("td");
        productTablePrice.textContent = `$${product.price}`;

        const productTableCategory = document.createElement("td");
        productTableCategory.textContent = product.category_name;
      
        const productTableDeleteButtonTD = document.createElement("td");
        
        const productTableDeleteButton = document.createElement("button");
        productTableDeleteButton.textContent = "Delete";
        productTableDeleteButton.classList.add("delete-button-style");
        productTableDeleteButton.setAttribute("id", product.code);
        productTableDeleteButtonTD.append(productTableDeleteButton);

        tableRows.append(productTableID, productTableName, productTableAmount, productTablePrice, productTableCategory, productTableDeleteButtonTD);
    } catch (error) {
        alert("Oops, something went wrong. Please try again later.");
        console.log(error);
    }
}

async function deleteProduct(code) {
    await fetch (`http://localhost/products?code=${code}`, {

        method: 'DELETE',

    })
}

productTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button-style")) {
        const productCode = event.target.getAttribute("id");

        const removeTableRow = event.target.closest("tr");
        removeTableRow.remove();

        deleteProduct(productCode);
    }
});

function clearInputs() {
    productName.value = "";
    productAmount.value = "";
    productUnitPrice.value = "";
    productSelectCategory.selectedIndex = 0; 
}