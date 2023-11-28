const login = document.getElementById('login');
const profile = document.getElementById('profile');
const eventLink = document.getElementById('eventLink');
const tokenNavBar = localStorage.getItem('token');
const userNavBar = localStorage.getItem('user');
const objUser = JSON.parse(userNavBar);

if (tokenNavBar) {
    const containerProfile = ` 
        <div class="dropdown">
            <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="${objUser.img}" class="menu-img-profile rounded-circle" alt="" srcset="">
            </button>
            <ul class="dropdown-menu">
                <li><a onclick="logOutBtn()" class="dropdown-item" href="#">Cerrar sesión</a></li>
            </ul>
        </div> `;
    profile.innerHTML = containerProfile;

    // Mostrar la pestaña "EVENTO" cuando el usuario ha iniciado sesión
    eventLink.style.display = 'block';
} else {
    const containerLogin = ` 
        <a class="nav-link nav-login" href="./login.html">Iniciar sesión</a>`;
    login.innerHTML = containerLogin;

    // Ocultar la pestaña "EVENTO" cuando el usuario no ha iniciado sesión
    eventLink.style.display = 'none';
}

/**
 * Función para cerrar sesión, redirige a la página de inicio y borra localStorage.
 */
const logOutBtn = () => {
    const token = localStorage.getItem("token");
    if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./login.html";
    }
};
