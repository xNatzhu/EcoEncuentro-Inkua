"use strict";

/**
* Muestra el email del usuario DOM.
* Se ejecuta cuando el DOM se cargo complpetamente.
*/
addEventListener("DOMContentLoaded", () => {
    document.getElementById("userEmail").innerHTML = `${localStorage.getItem("email")}`;
});

/**
* Envío de nueva contraseña.
* @param { Event } e
*/
const form = document.getElementById("formConfirmRecovery");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.querySelector("#floatingPassword").value;
    const checkPasswords = document.querySelector("#floatingNewPassword").value;

    if (newPassword !== checkPasswords) {
        Swal.fire({
            icon: "error",
            title: "Las contraseñas ingresadas no coinciden. Intente nuevamente",
            confirmButtonColor: "#f27474"
        });
        return;
    }

    if (newPassword.length < 7) {
        Swal.fire({
            icon: "error",
            title: "La contraseña debe tener al menos 7 caracteres. Intente nuevamente.",
            confirmButtonColor: "#f27474",
        });
        return;
    }

    const newPasswordUrl = "https://successful-bear-bandanna.cyclic.app/api/email/password/confirm";
    // const newPasswordUrl = "http://127.0.0.1:3000/api/email/password/confirm";

    try {
        const result = await Swal.fire({
            title: "¿Confirme si desea cambiar la contraseña?",
            showDenyButton: true,
            confirmButtonText: "Confirmar",
            color: "#448334",
            confirmButtonColor: "#448334",
        });

        if (result.isConfirmed) {
            const response = await fetch(newPasswordUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    email: localStorage.getItem("email"),
                    newPassword: newPassword
                }),
            });

            if (response.ok) {
                localStorage.clear();

                Swal.fire({
                    title: "Su contraseña fue cambiada.",
                    color: "#448334",
                    confirmButtonColor: "#448334",
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo problemas al intentar cambiar la contraseña. Intente nuevamente",
                    confirmButtonColor: "#f27474"
                });
            };

        } else if (result.isDenied) {
            Swal.fire("El cambio de contraseña fue cancelado.", "", "cancel");
        };
    } catch (err) {

        console.error("Error en la solicitud:", err);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo problemas en la solicitud, intente nuevamente",
            confirmButtonColor: "#f27474"
        });
    };
});