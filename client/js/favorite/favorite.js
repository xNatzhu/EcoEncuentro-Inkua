const cardContainer = document.getElementById("cardContainer");
const favoriteLocalStore = localStorage.getItem("favorite");
let dataFavorite = JSON.parse(favoriteLocalStore);

function getData() {
  const listData = []
  for (const element of dataFavorite) {
    listData.push(element);
  }
  createCards(listData);
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
              <h5 class="card-title">${element.title.slice(0, 20).concat('...')}</h5>
              <button onClick="toggleFavorite('${element._id}')">
                <i class="favorite-icon ${isFavorite?(" bi bi-heart-fill text-danger"):("bi bi-heart")}" id="heartIcon_${element._id}"></i>
              </button>
            </div>
            <p class="text-success">${dataPrint}</p>
            <p class="card-text"> ${element.description.split(' ').slice(0, 10).join(' ')}...</p>
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
  const updatedFavorites = dataFavorite.filter((element) => element._id !== id);
  dataFavorite = updatedFavorites
  localStorage.setItem("favorite", JSON.stringify(updatedFavorites));

  if (dataFavorite === null) {
    dataFavorite = "[]"; 
  }

  console.log("probando");
  console.log(updatedFavorites);
  createCards(updatedFavorites)
}; 