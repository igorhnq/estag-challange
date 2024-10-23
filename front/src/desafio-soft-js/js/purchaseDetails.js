const purchaseDetailsTable = document.getElementById("purchase-details-table");

window.onload = async () => {
    (await readOrderItems()).forEach(item => {
        addItemToTable(item);
    })
}

async function readOrderItems() {

    const orderCode = window.location.href.split('?code=').at(-1);

    return await fetch (`http://localhost/orderitems?code=${orderCode}`, {

        method: 'GET'

    }).then(
        response => response.json()
    )
}

function addItemToTable(item) {
    const tableRow = document.createElement("tr");
    purchaseDetailsTable.append(tableRow);

    const purchaseTableCode = document.createElement("td");
    purchaseTableCode.textContent = item.order_code;

    const purchaseTableName = document.createElement("td");
    purchaseTableName.textContent = item.name;

    const purchaseTableAmount = document.createElement("td");
    purchaseTableAmount.textContent = item.amount;

    const purchaseTableTax = document.createElement("td");
    purchaseTableTax.textContent = `$${item.tax}`;

    const purchaseTableTotal = document.createElement("td");
    purchaseTableTotal.textContent = `$${item.total}`

    tableRow.append(purchaseTableCode, purchaseTableName, purchaseTableAmount, purchaseTableTax, purchaseTableTotal);
}
