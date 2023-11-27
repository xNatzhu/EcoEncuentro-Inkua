"use strict";

const logOutBtn = document.getElementById("");

/**
* Logout href to index, and clear localStorage.
*/
logOutBtn.addEventListener("click", () => {

    const token = localStorage.getItem("token");
     
    if(token){
        localStorage.clear();
        
        window.location.href = "./index.html";
    };
});