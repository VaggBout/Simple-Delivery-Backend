"use strict";

window.onload = function () {
    registerRegistrationHandler();
};

function registerRegistrationHandler() {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (evt) {
        evt.preventDefault();

        const data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value,
        };

        try {
            const response = await axios.post("/backoffice/api/login", data);
            if (response.data.data?._id) {
                location.href = `/backoffice/stores/${response.data.data._id}/orders`;
                return;
            }
            location.reload();
        } catch (error) {
            document.getElementById("loginForm").reset();
            errorMessage(error.response.data.error, "loginError");
        }
    });
}

function errorMessage(error, id) {
    const errorElement = document.getElementById(id);
    errorElement.innerHTML = `
            <span style='color: red;'>
                ${error}
            </span>`;
}
