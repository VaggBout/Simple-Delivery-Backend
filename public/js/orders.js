"use strict";

window.onload = function () {
    setInterval(async () => await getOrdersList(), 10000);
};

async function getOrdersList() {
    const url = new URL(window.location.href);
    const storeId = url.pathname.split("/")[3];

    try {
        const response = await axios.get(
            `/backoffice/api/stores/${storeId}/orders`
        );
        const ordersList = document.getElementById("ordersList");
        ordersList.innerHTML = response.data.html;
    } catch (error) {
        console.error(error);
    }
}
