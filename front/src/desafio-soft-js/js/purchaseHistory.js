const purchaseHistoryTable = document.getElementById("history-table");

window.onload = () => {
    loadOrdersTable();
}

async function loadOrdersTable() {
    (await readOrders()).forEach(item => {
        addItemToTable(item);
    })
}

async function readOrders() {
    const result = await fetch ("http://localhost/orders");
    const orders = await result.json();
    return orders;
}

readOrders();

async function addItemToTable(item) {
    const tableRows = document.createElement("tr");
    purchaseHistoryTable.append(tableRows);

    const purchaseHistoryTableCode = document.createElement("td");
    purchaseHistoryTableCode.textContent = item.code;

    const purchaseHistoryTableTax = document.createElement("td");
    purchaseHistoryTableTax.textContent = `$${item.tax}`

    const purchaseHistoryTableTotal = document.createElement("td");
    purchaseHistoryTableTotal.textContent = `$${item.total}`;

    const purchaseHistoryTableTD = document.createElement("td");
    const purchaseHistoryTableViewButton = document.createElement("button");
    purchaseHistoryTableViewButton.classList.add("history-view-button");
    purchaseHistoryTableViewButton.setAttribute("id", item.code)

    const orderCode = item.code

    purchaseHistoryTableViewButton.addEventListener("click", () => {
        
        readOrderItems(orderCode);
        console.log(orderCode)
    })

    const a = document.createElement("a");
    a.textContent = "View";
    a.setAttribute("href", `purchase-details.html?code=${orderCode}`);

    purchaseHistoryTableViewButton.append(a);
    purchaseHistoryTableTD.append(purchaseHistoryTableViewButton);

    tableRows.append(purchaseHistoryTableCode, purchaseHistoryTableTax, purchaseHistoryTableTotal, purchaseHistoryTableTD);
}

async function readOrderItems(code) {

    await fetch (`http://localhost/orderitems?code=${code}`, {
    
        method: 'GET'

    })
}