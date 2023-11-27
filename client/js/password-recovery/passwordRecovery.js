/**
* Funcion para enviar peticion al backend y enviar email de recuperacion de password al usuario
* @param { Event } e - Submit event
*/

"use strict";

const form = document.getElementById("formRecovery");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email =document.querySelector("#floatingInput").value

    const urlRecoveryPassword = "https://successful-bear-bandanna.cyclic.app/api/email/password";
    // const urlRecoveryPassword = "http://127.0.0.1:3000/api/email/password";

    try {
        const response = await fetch(urlRecoveryPassword, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        if (response.ok) {
            Swal.fire({
                title: "Se envio exitosamente un mensaje a su email.",
                color: "#448334",
                confirmButtonColor: "#448334",
            });
        } else {
            Swal.fire({
                icon: "error",
                text: "Error al enviar el email.",
                confirmButtonColor: "#f27474",
            });  
        };
    } catch (err) {
        Swal.fire({
            icon: "error",
            text: "Hubo problemas al enviar solicitud.",
            confirmButtonColor: "#f27474",
        });  
    };
});