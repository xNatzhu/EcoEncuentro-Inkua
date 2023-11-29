const eventForm = document.getElementById("eventForm");
const registerForm = document.getElementById("formRegister");
const tokenEvent = sessionStorage.getItem("token");
const userLocalStorage = localStorage.getItem("user");


eventForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const city = document.getElementById("city").value;
    const eventDate = document.getElementById("eventDate").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("file");

    console.log(" en event antes de bsucar file")

     //Verificar si se seleccionó un archivo
    if (fileInput.files.length > 0) {
       const file = fileInput.files[0];

       // Crear un lector de archivos
       const reader = new FileReader();

       // Configurar la función de devolución de llamada cuando la lectura esté completa
       reader.onloadend = function () {
           // Obtener los datos en formato base64
            const base64Data = reader.result;
            const userId = JSON.parse(localStorage.getItem("user"));

            const params = {
                "title": title,
                "location": city,
                "eventImg": base64Data, // Aquí se agrega la imagen en formato base64
                "createdBy": userId.id,
                "eventDate": eventDate,
                "description": description,
                "category": category,
            };

            registerEvent(params);
        };

        // Leer el archivo como una cadena de datos URL
        reader.readAsDataURL(file);
    }else{
        const userId = JSON.parse(localStorage.getItem("user"));
        const user = JSON.stringify(userId.id);

        const params = {
            "title": title,
            "location": city,
            //"eventImg": base64Data, // Aquí se agrega la imagen en formato base64
            "createdBy": userId.id,
            "eventDate": eventDate,
            "description": description,
            "category": category,
        };
    
        registerEvent(params);
    };
});

function registerEvent(params) {
    const URL = "https://successful-bear-bandanna.cyclic.app/api/events/create";
    //const URL = "http://127.0.0.1:3000/api/events/create";

    console.log("en rergister")
    console.log(params)

    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            console.log("Error en la solicitud");
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        Swal.fire({
            icon: "success",
            title: "Evento registrado exitosamente",
            confirmButtonColor: "#8db596"
        });
        // Puedes manejar la respuesta del servidor aquí
    })
    .catch(error => {
        console.error('Error al realizar la solicitud:', error);
        Swal.fire({
            icon: "error",
            title: "Error en la solicitud",
            confirmButtonColor: "#f27474"
        });
        // Puedes manejar errores en la solicitud aquí
    });
};