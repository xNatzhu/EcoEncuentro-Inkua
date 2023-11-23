/**
* Guardar params de URL en token para su uso
* Si no existe, devolvemos al usuaio a inicio
*/

"use strict";

const tokenVerify = () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        const token = urlParams.get("token");
        const email = urlParams.get("email");

        if (token && email) {
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);

        } else {
            window.location.href = "./index.html";
        };
    } catch (err) {
        console.error("Error al guardar en el localStorage:", err);
    };
};

tokenVerify();