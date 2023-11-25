const registerForm = document.getElementById("formLogin");
const token = sessionStorage.getItem("token");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const params = {
        "email": email,
        "password": password
    };

    loginUser(params);
});


function loginUser(params) {
    const URL = "https://successful-bear-bandanna.cyclic.app/api/users/login";

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            console.log(data);
            Swal.fire({
                icon: "error",
                title: `Los datos ingresados no son correctos`,
                confirmButtonColor: "#f27474"
            });
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log('Respuesta del servidor:', data);
        Swal.fire({
            icon: "success",
            title: "Has ingresado exitosamente",
            confirmButtonColor: "#8db596"
        });  
        sessionStorage.setItem("token", data.token);
        window.location.href = "/client/index.html"
        // Aquí puedes manejar la respuesta del servidor
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire({
            icon: "error",
            title: `${data.message}`,
            confirmButtonColor: "#f27474"
        });
        // Aquí puedes manejar errores en la solicitud
    });
}
