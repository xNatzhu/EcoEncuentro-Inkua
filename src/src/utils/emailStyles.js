/**
 * @param {string} resetLink
 * @param {string} userName
 * @returns {string}
*/
"use strict";

function htmlMail(resetLink, userName) {

    // Logo Img
    const logo = "https://i.postimg.cc/TptpbPBF/Isologotipo.png"

    const firstLetter = userName.charAt(0);
    const rest = userName.slice(1);
    const name =  firstLetter.toUpperCase() + rest;

    // Style added directly as HTML
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color:black;">
            <img src="${logo}" style="width: 100px; height: auto; margin-bottom: 20px;" alt='Eco-encuentro logo' title="Eco-encuentro Logo"/>
            <h1 style="color: #61AE4E;">Hola, ${name}</h1>
            <p style="font-size: 18px; margin-bottom: 20px;">Has solicitado restablecer tu contraseña.</p>
            <br> 
            Haz clic en el siguiente enlace para restablecerla:</p>
            <br>
            <p><a href="${resetLink}" style="background-color: #61AE4E; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a></p>
            <br>
            <p>Si no has solicitado esto, por favor ignora este correo electrónico.</p>
        </div>
    `;
};

module.exports = htmlMail;