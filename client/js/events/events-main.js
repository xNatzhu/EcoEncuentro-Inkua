
const cardContainer = document.getElementById("cardContainer");
const input = document.querySelector("input");
const favoriteIcon = document.querySelector(".favorite-icon");
let dataEvents;
// funciones

function getData() {
  const url = "https://successful-bear-bandanna.cyclic.app/api/events";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      dataEvents = data.eventos; // Use data.eventos instead of data.events
      createCards(data.eventos); // Use data.eventos instead of data.events
      input.addEventListener("input", (e) => {
        e.preventDefault();
        let oneFilter = textFilter(data.eventos, input.value.toLowerCase()); // Use data.eventos instead of data.events
      });
    });
}
function textFilter(array, text) {
  const dataEvents = array;
  let textFilter = dataEvents.filter((element) => {
    return element.title.toLowerCase().includes(text);
  });
  createCards(textFilter);
  return textFilter;
}

function createCards(data) {
  let card = ``;
  const mapdata = data.map(element => {
    const favoriteLocalStore = localStorage.getItem("favorite");
    let isFavorite = false;

    if (favoriteLocalStore !== null) {
      const parsedFavorite = JSON.parse(favoriteLocalStore);
      isFavorite = parsedFavorite.some((element2) => element2._id === element._id);
    }


    let date = new Date(element.eventDate);
    var dataPrint = date.toISOString().split('T')[0].split('-').reverse().join('-');
    card += `
      <div class="col">
        <div class="card h-100 custom-card">
          <div class="city-button">
            <button type="button" class="btn btn-success">${element.location}</button>
          </div>
          <img src="${element.eventImg}" class="card-img-top card-image" alt="limpiando el mar">
          <div class="card-body ">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title">${element.title}</h5>
              <button onClick="toggleFavorite('${element._id}')">
                <i class="favorite-icon ${isFavorite?(" bi bi-heart-fill text-danger"):("bi bi-heart")}" id="heartIcon_${element._id}"></i>
              </button>
            </div>
            <p class="text-success">${dataPrint}</p>
            <p class="card-text">${element.description}</p>
          </div>
          <div class="d-flex justify-content-center">
            <button onclick="probando()" class="btn btn-outline-success" href="#">ASISTIR</button>
            <div style="width: 50px;"></div>
            <a class="btn btn-success" href="detail.html?id=${element._id}">VER MÁS</a>
          </div>
        </div>
      </div>`;
  });
  cardContainer.innerHTML = card;
}
getData();


const toggleFavorite = (id) => {
    const heartIcon = document.getElementById(`heartIcon_${id}`);

    let favoriteLocalStore = localStorage.getItem("favorite");

    if (favoriteLocalStore === null) {
      favoriteLocalStore = "[]"; 
    }
    const parsedFavorite = JSON.parse(favoriteLocalStore);
    const isFavorite = parsedFavorite.some((element) => element._id === id);
  

    if (isFavorite) {
      const updatedFavorites = parsedFavorite.filter((element) => element._id !== id);
      localStorage.setItem("favorite", JSON.stringify(updatedFavorites));
      heartIcon.classList.remove("bi-heart-fill", "text-danger", "bi");
        heartIcon.classList.add("bi","bi-heart");

    } else {
      const dataFilter = dataEvents.find((element) => element._id === id);
      heartIcon.classList.remove("bi-heart");
        heartIcon.classList.add("bi","bi-heart-fill", "text-danger");
      if (dataFilter) {
        parsedFavorite.push(dataFilter);
        localStorage.setItem("favorite", JSON.stringify(parsedFavorite));
      }
    }
  };
