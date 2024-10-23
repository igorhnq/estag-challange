const categoriesForm = document.getElementById("categories-form");
const categoriesTable = document.getElementById("categories-table");
let categoryName = document.getElementById("categories-category-name");
let categoriesTaxValue = document.getElementById("categories-tax");

window.onload = () => {
    loadCategoriesTable();
}
 
async function loadCategoriesTable() {
    (await readCategories()).forEach(category => {
        categoryAdd(category);
     });
} 

async function readProducts() {
    const result = await fetch ('http://localhost/products');
    const products = await result.json();
    return products; 
}

async function readCategories() {
    const result = await fetch ('http://localhost/categories');
    const categories = await result.json();
    console.log(categories);
    return categories;
}

categoriesTaxValue.oninput = () => {
    let categoriesTaxValueRegex = categoriesTaxValue.value.replace(/[^\d.]/g, "");
    categoriesTaxValue.value = categoriesTaxValueRegex;
}

categoryName.oninput = () => {
    let categoriesCategoryNameRegex = categoryName.value.replace(/[^a-zA-Z]/g, "");
    categoryName.value = categoriesCategoryNameRegex;
}

categoriesForm.onsubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(categoriesForm);

    fetch('http://localhost/categories', {

        method: 'POST',
        body: formData,

    }).then(

        loadCategoriesTable(),
        clearInputs(),
        location.reload(),

    );  
}

function categoryAdd(category) {
    try {
        const tableRows = document.createElement("tr");
        categoriesTable.append(tableRows);

        const categoriesTableCode = document.createElement("td");
        categoriesTableCode.textContent = category.code;

        const categoriesTableCategoryName = document.createElement("td");
        categoriesTableCategoryName.textContent = category.name;

        const categoriesTableTaxValue = document.createElement("td");
        categoriesTableTaxValue.textContent = `${category.tax}%`;

        const categoriesDeleteButtonTD = document.createElement("td");
        const categoriesDeleteButton = document.createElement("button");
        categoriesDeleteButton.textContent = "Delete";
        categoriesDeleteButton.classList.add("delete-button-style");
        categoriesDeleteButton.setAttribute("id", category.code);
        categoriesDeleteButtonTD.append(categoriesDeleteButton);

        tableRows.append(categoriesTableCode, categoriesTableCategoryName, categoriesTableTaxValue, categoriesDeleteButtonTD);
    } catch (error) {
        alert("Não foi possível adicionar a categoria, tente novamente mais tarde!");
        console.log(error);
    }
}

async function deleteCategory(code) {
    await fetch(`http://localhost/categories?code=${code}`, {
            
        method: 'DELETE',

    })
}

categoriesTable.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-button-style")) {

        const categoryCode = event.target.getAttribute("id");

        const products = await readProducts();
        const categories = await readCategories();

        const category = categories.find(category => category.code == categoryCode);
        const isCategoryUsed = products.some(product => product.category_name === category.name);

        if (isCategoryUsed) {
            alert("There is a product with this category!");
            return;
        }
        
        const removeTableRow = event.target.closest("tr");
        removeTableRow.remove();

        deleteCategory(categoryCode);
    }
});

function clearInputs() {
    categoryName.value = "";
    categoriesTaxValue.value = "";
}

