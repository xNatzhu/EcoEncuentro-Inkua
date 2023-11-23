  // const / variables
  const cardContainer = document.getElementById("cardContainer");
  const checkContainer = document.getElementById("checkContainer");
  const input = document.querySelector("input");
  let dataEvents;

  //llamadas de funciones y eventos
  getData()
  // funciones
  function getData() {
      const url = "https://successful-bear-bandanna.cyclic.app/api/events";
      fetch(url)
        .then(response => response.json())
        .then(data => {
          dataEvents = data.eventos;
          createCard(data.eventos, data.currentDate);
          
          createCheckbox(data.eventos, data.currentDate);
          console.log(data.eventos);
          
          input.addEventListener("input",(e)=>{
            e.preventDefault();
      
            let oneFilter = textFilter(data.eventos, input.value);
            let twoFilter = filterCategory(oneFilter);
            createCard(twoFilter, data.currentDate);
          })
      
          checkContainer.addEventListener("change",(e)=>{
            let oneFilter = textFilter(data.eventos, input.value)
            let twoFilter = filterCategory(oneFilter)
            createCard(twoFilter, data.currentDate);
          })
          console.log(data.eventos)

        });
    }
    

  
    function createCard(array){
      if(array.length == 0){
          cardContainer.innerHTML =` 
          <div class="alert alert-light" role="alert">
              ¡Ups! No hay eventos con esa caracteristicas.
          </div>`
      }else{
           
          let card = ``;
          array.forEach(element => {
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
                        <p class="card-text">${element.description.split(' ').slice(0, 10).join(' ')}...</p>
                      </div>
                      <div class="d-flex justify-content-center">
                        <button onclick="probando()" class="btn btn-outline-success" href="#">ASISTIR</button>
                        <div style="width: 50px;"></div>
                        <a class="btn btn-success" href="detail.html?id=${element._id}">VER MÁS</a>
                      </div>
                    </div>
                  </div>`
          });
          cardContainer.innerHTML = card
      }
  }


  function createCheckbox(array, date) {
      
      let arrayCategory = []
      array.map(element=>{
          arrayCategory.push(element.category) 
          return arrayCategory
          
      })
      //set es una estructura de javascript que no permite elementos repetidos. siempre y cuando sea de elementos basico.
      let setCategory = new Set(arrayCategory)
      console.log(setCategory); //el set tiene foreach lo que permite recorrer.
      let chech = ""
      setCategory.forEach(element=>{

          chech +=`
          <div class="col-5">
              <input class="form-check-input" type="checkbox" value="${element}" id="${element}">
              <label class="form-check-label" for="${element}">
              ${element}
              </label>
          </div>`
          checkContainer.innerHTML = chech
      })
  }


  function textFilter(array, text) {
      let arrayFilter = array.filter(element => {
          return element.title.toLowerCase().includes(text.toLowerCase())
      });
      return arrayFilter;
  }
  
  function filterCategory(array) {
      let checkboxes = document.querySelectorAll("input[type='checkbox']");
      console.log(checkboxes);
      let arrayCheck = Array.from(checkboxes)
      let correctCheck = arrayCheck.filter(check => check.checked)
      if(correctCheck == 0){
          return array
      }else{
          console.log(correctCheck)
          let category = correctCheck.map(check => check.value)
          console.log(category);
          let arrayFilter = array.filter(element => category.includes(element.category))
          return arrayFilter
      }
  }


  
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