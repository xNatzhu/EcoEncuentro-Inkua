export default function createCards(card) {
    let card = ``;
    const mapdata = data.map(element => {
      const favoriteLocalStore = localStorage.getItem("favorite");
      let isFavorite = false;
  
      if (favoriteLocalStore !== null) {
        const parsedFavorite = JSON.parse(favoriteLocalStore);
        isFavorite = parsedFavorite.some((element2) => element2._id === element._id);
      }
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
                <button onclick="toggleFavorite('${element._id}')">
                  <i class="favorite-icon ${isFavorite?(" bi bi-heart-fill text-danger"):("bi bi-heart")}" id="heartIcon_${element._id}"></i>
                </button>
              </div>
              <p class="text-success">01/12/2023</p>
              <p class="card-text">${element.description}</p>
            </div>
            <div class="d-flex justify-content-center">
              <a class="btn btn-outline-success" href="#">ASISTIR</a>
              <div style="width: 50px;"></div>
              <a class="btn btn-success" href="#">VER MÁS</a>
            </div>
          </div>
        </div>`;
    });
    cardContainer.innerHTML = card;
}