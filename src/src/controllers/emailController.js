"use strict";

/* Funcionamiento:
    1: Envio de email simple.
    Usuario require un cambio de password solo con el email. Ejecutar esto envia un request al backend, el cual envia un email, con una ENDPOINT (el cual contiene el email y un token generado)
    2: Comprobacion de email y token para rediriguir a URL frontend para cambio de contraseña.
    El usuario al hacer click en el email con la url del ENDPOINT (comprando el token y email), es rediriguido, a una URL frontend, la cual comprueba nuevamente el email y token, permite el cambio de contraseña.
    3: Peticion del front a endpoint de cambio, comprando email y token.
    El front envia una peticion al backend email, password, y en el header el token, si todo es correcto, actualiza la contraseña del usuario en la DB.
*/

const jwt = require('jsonwebtoken');
const config = require('../middleware/authMiddleware');
const users = require("../models/users");
// Email send function
const { sendResetEmail } = require("../utils/emailSender");
// Create token for reset password
const { validationPassword } = require("../utils/validation")

module.exports = {

  // Receibe petition from frontend, and send the email to the user email
  passwordReset: async function (req, res, next) {
    try {
        const { email } = req.body;
    
        if(!email){
            return res.status(400).json({message:  "Email is required."});
        };
    
        const user = await users.findOne({ email });
    
        if (!user) {
            return res.status(404).json({message:  "User not found."});
        };
    
        const token = jwt.sign({
            email: email,
        },
        config.jwtSecret,
        {
            expiresIn: '1h',
        });
    
        const userName  = user.name;
        const resetToken = token; 
    
        // Generate link and send via Email to the user
        const resetLink = `https://eco-encuentro/api/reset/password/${resetToken}?email=${email}`;  
        sendResetEmail(email, resetLink, userName);
    
        return res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:  "Internal server error."});
    };},

    /* Redirect user endpoint to Frontend */
    redirect: async function (req, res, next) {
        const { token } = req.params;
        const { email } = req.query;

        if(!token || !email){
            return res.status(400).json({message: "Falta email o token, verifique y reintente nuevamente."})
        };

        // when the user is sended by the email to this endpoint function, redirect the user to the Frontend, with the token and user email.
        const redirectURL = `https://URL-TO.REDIRECT/password-reset.html?token=${token}&email=${email}`; // URL del front.
        // URL OF FROTNEND, WE SENDING THE TOKEN AND EMAIL, THE FRONTEND SHOULD SEND THIS FOR THE RECOVER OF PASSWROD

        return res.status(302).redirect(redirectURL);
    },

    /* request the new password and email (the token is verified at the router) and update the user */
    confirmPasswordReset: async function (req, res, next) {
        try {
          const { newPassword, email } = req.body;

          if(!newPassword || !email){
            return res.status(404).json({message: "Email is required."})
          };
      
          const user = await users.findOne({ email });
      
          if (!user) {
            return res.status(404).json({message:  "User not found."});
          };

          // Hash the new password, and save the user
          const hashedPassword = validationPassword(newPassword);
          user.password = hashedPassword;
          
          await user.save();

          return res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
          console.error(error);
          return res.status(500).json({message:  "Internal server error."});
        };
    }  
};