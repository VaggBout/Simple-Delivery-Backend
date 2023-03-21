"use strict";

window.onload = function () {
    registerRegistrationHandler();
};

function registerRegistrationHandler() {
    const registrationForm = document.getElementById("registrationForm");
    registrationForm.addEventListener("submit", async function (evt) {
        evt.preventDefault();

        const data = {
            email: document.getElementById("registrationEmail").value,
            password: document.getElementById("registrationPassword").value,
            name: document.getElementById("registrationName").value,
            address: document.getElementById("registrationAddress").value,
        };

        try {
            await axios.post("/backoffice/api/register", data);
            location.href = "/backoffice/login";
        } catch (error) {
            document.getElementById("registrationForm").reset();
            errorMessage(error.response.data.error, "registrationError");
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
