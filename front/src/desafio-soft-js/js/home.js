const homeForm = document.getElementById("home-form");
const homeCancelButton = document.getElementById("home-cancel-button");
const homeTable = document.getElementById("home-table");
const homeFinishButton = document.getElementById("home-finish-button");
let homeProductSelect = document.getElementById("home-select-input");
let homeTax = document.getElementById("home-tax-input");
let homePrice = document.getElementById("home-price-input");
let homeAmount = document.getElementById("home-amount-input");
let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

window.onload = () => {
    shoppingCart.forEach(product => {
        addProductToTable(product);
       
        
    });

    updateTotals();

}

// async function loadProductsTable() {
//     (await readOrderItems()).forEach(product => {
//         addProductToTable(product);
//     })
// }

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

async function readOrders() {
    const result = await fetch ('http://localhost/orders');
    const orders = await result.json();
    return orders;
}

readOrders();

// async function readOrderItems() {
//     const result = await fetch ('http://localhost/orderitems');
//     const orderItems = await result.json();
//     console.log(readOrderItems);
//     return orderItems;
// }

// readOrderItems();

readCategories();

async function loadProductsSelect() {
    (await readProducts()).forEach(product => {
        const option = document.createElement("option");
        option.setAttribute("value", product.code);
        option.textContent = product.name;

        homeProductSelect.append(option);

    })
}

loadProductsSelect();

homeAmount.oninput = () => {
    homeAmount.value = homeAmount.value.replace(/[^\d]/g, "");
}

homeProductSelect.onchange = async () => {
    const result = await fetch ('http://localhost/categories');
    const categories = await result.json();

    const result2 = await fetch ('http://localhost/products');
    const products = await result2.json();

    const selectedProduct = products.find(product => product.code == homeProductSelect.value);

    if (selectedProduct) {

        const productCategory = categories.find(category => category.name === selectedProduct.category_name);

        if (productCategory) {

            homeTax.value = productCategory.tax;
            homePrice.value = selectedProduct.price;
            homeAmount.value = selectedProduct.amount;

        }
    }
}

homeForm.onsubmit = async (event) => {
    event.preventDefault();

    const products = await readProducts();

    const newProduct = {
        name: homeProductSelect.options[homeProductSelect.selectedIndex].text,
        code: Number(homeProductSelect.value),
        amount: Number(homeAmount.value),
        tax: Number(homeTax.value),
        price: Number(homePrice.value),
        total: Number(homePrice.value) * Number(homeAmount.value),
    }
    
    const isProductInShoppingCart = shoppingCart.find(product => product.code === newProduct.code);

    if (isProductInShoppingCart) {
        alert("This product is already in your shopping cart!");
        return;
    }

    const selectedProduct = products.find(product => product.code == newProduct.code);

    if (homeAmount.value > selectedProduct.amount || homeAmount.value == 0) {
        alert("Unavailable amount for this product!");
        return;
    } 

    clearInputs();
    addProductToTable(newProduct);
    
    shoppingCart.push(newProduct);
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    updateTotals();    
}

homeFinishButton.onclick = async () => {

    if (shoppingCart.length < 1) {
        alert("Your shopping cart is empty!");
        return;
    }

    const total = document.querySelector(".totals").textContent;
    const tax = document.querySelector(".tax-totals").textContent;

    const formData = new FormData();

    formData.append('total', total);
    formData.append('tax', tax);

    const orderResponse = fetch("http://localhost/orders", {

        method: 'POST',
        body: formData,

    });

    const {order_code} = await (await orderResponse).json();

    for (const product of shoppingCart) {
        const itemData = new FormData();
        itemData.append('order_code', order_code);
        itemData.append('home-produt-select', product.code); 
        itemData.append('home-product-amount', product.amount);
        itemData.append('home-product-tax', product.tax);
        itemData.append('home-product-price', product.price); 

        await fetch("http://localhost/orderitems", {
            method: 'POST',
            body: itemData,
        });
    }

    alert('Purchase successful!');
    localStorage.clear(); 
    location.reload(); 

}

function addProductToTable(product) {
    try {
        const tableRows = document.createElement("tr");
        homeTable.append(tableRows);

        const homeProductTable = document.createElement("td");
        homeProductTable.textContent = product.name;

        const homePriceTable = document.createElement("td");
        homePriceTable.textContent = `$${product.price}`;

        const homeAmountTable = document.createElement("td");
        homeAmountTable.textContent = product.amount;

        const homeTotalTable = document.createElement("td");
        homeTotalTable.textContent = `$${product.total}`;
        homeTotalTable.classList.add("each-total");

        const homeTD = document.createElement("td");

        const homeDeleteButton = document.createElement("button");
        homeDeleteButton.textContent = "Delete";
        homeDeleteButton.classList.add("delete-button-style");
        homeDeleteButton.setAttribute("id", product.code);
        homeTD.append(homeDeleteButton);

        tableRows.append(homeProductTable, homePriceTable, homeAmountTable, homeTotalTable, homeTD);
    } catch (error) {
        alert("Oops, something went wrong. Please try again later.");
        console.error(error);
    }
}

// async function deleteProduct(code) {
//     await fetch (`http://localhost/orderitems?code=${code}`, {
//         method: 'DELETE',
//     })
// }

function updateTotals() {

    const totalField = document.querySelector(".totals");
    const totalTaxField = document.querySelector(".tax-totals");

    let total = 0;
    let totalTax = 0;

    shoppingCart.forEach(product => {
    
        total = total + product.total;
        
        let productTaxValue = (product.price * product.tax / 100) * product.amount;

        totalTax += productTaxValue;

    })

    totalField.textContent = `${(total + totalTax).toFixed(2)}`;
    totalTaxField.textContent = `${totalTax.toFixed(2)}`;    
}

homeCancelButton.onclick = () => {

    if (shoppingCart.length < 1) {
        homeCancelButton.setAttribute("disabled");
    }

    if (confirm("Are you sure you want to cancel this purchase?") == true) {
        shoppingCart = [];
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
        location.reload();


    }
}

homeTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-button-style")) {
        const productCode = event.target.getAttribute("id");

        shoppingCart = shoppingCart.filter(product => product.code != Number(productCode));
        localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

       

        const removeTableRow = event.target.closest("tr");
        removeTableRow.remove();

        updateTotals();

    } 
});

function clearInputs() {
    homeProductSelect.selectedIndex = 0;
    homeAmount.value = "";
    homePrice.value = "";
    homeTax.value = "";
}


