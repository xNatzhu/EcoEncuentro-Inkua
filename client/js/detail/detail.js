const queryString = location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");
//llamadas de funciones y eventos
getData();
function getData() {
  const url = "https://successful-bear-bandanna.cyclic.app/api/events/" + id;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dataEvents = data.eventos;
      const createCard = document.getElementById("detailsContainer");
      
      let date = new Date(dataEvents.eventDate);
      var dataPrint = date.toISOString().split('T')[0].split('-').reverse().join('-');
      createCard.innerHTML = `
            <div class="imagen-central-evento">
        <img src="${dataEvents.eventImg}" 
        alt="${dataEvents.title}" class="imagen-recortada">
    </div>
        <div class="row">
            <!-- Autores: Foto y nombre -->
            <div class="col-12 col-md-6 m-2 d-flex align-items-center">
                <img src="${dataEvents.usersJoined.userImage}" alt="Foto de perfil del autor/a" class="mr-3 img-profile">
                <div class="texto">
                    <h6>${dataEvents.usersJoined.userName}</h6>
                </div>
            </div>
            <!-- Titulo del evento -->
            <div class="col-12 col-md-6 m-2">
                <div class="subtitle-detail">
                    <h4>${dataEvents.title}</h4>
                </div>
            </div>
            <!-- Botones de fecha, categoría y ubicación del evento -->
            <div class="col-12 col-md-6 m-2">
                <button class="btn btn-success me-2">${dataPrint}</button>
                <button class="btn btn-success me-2">${dataEvents.category}</button>
                <button class="btn btn-outline-success">${dataEvents.location}</button>
            </div>
            <!-- Contendio principal y explicación del evento -->
            <div class="parrafo m-2 mt-4">
                <p>${dataEvents.description}</p>
            </div>
            <!-- Botón asistir. redirigir a la pagina de inscripción -->
            <div class="m-2">
                <a class="btn btn-outline-success" href="#">ASISTIR</a>
            </div>
            <!-- Mapa de Google para ubicación-->
            <div class=" mt-5" style="text-align: center;">
                <iframe src="${dataEvents.map}" 
                width="100%" height="383" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
            `;
    });
}
