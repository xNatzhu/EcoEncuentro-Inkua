const formLogin = document.getElementById("formContact");

const token = sessionStorage.getItem("token");

formContact.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const affair = document.getElementById("affair").value;
    const message = document.getElementById("message").value;
    const params = {
        "email": email,
        "name": name,
        "affair": affair,
        "message": message,
    };

    contact(params);
});


function contact(params) {
    const URL = "https://successful-bear-bandanna.cyclic.app/api/users/contact";

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: `Los datos ingresados no son correctos`,
                confirmButtonColor: "#f27474"
            });
            throw new Error('Error en la solicitud');
        };

        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log('Respuesta del servidor:', data);
        Swal.fire({
            icon: "success",
            title: "¡Mensaje enviado exitosamente!",
            text: "Pronto nos pondremos en contacto contigo",
            confirmButtonColor: "#8db596"
        });  
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: `${data.message}`,
            confirmButtonColor: "#f27474"
        });
    });
};