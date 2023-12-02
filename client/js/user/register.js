const registerForm = document.getElementById("formRegister");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const params = {
        "name": username,
        "email": email,
        "password": password
    };

    registerUser(params);
});


function registerUser(params) {
    const URL = "https://successful-bear-bandanna.cyclic.app/api/users/create";

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            console.log(response.message);
            console.log("Error en la solicitud");
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log('Respuesta del servidor:', data);
        Swal.fire({
            icon: "success",
            title: "Usuario registrado exitosamente",
            confirmButtonColor: "#8db596"
        });  
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data._id);
        window.location.href = "./index.html"
        // Aquí puedes manejar la respuesta del servidor
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire({
            icon: "error",
            title: `${error.message}`,
            confirmButtonColor: "#f27474"
        });
        // Aquí puedes manejar errores en la solicitud
    });
}
