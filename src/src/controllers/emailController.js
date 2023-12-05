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
const Users = require("../models/users");
const Emails = require("../models/emails");
// Email send function
const { sendResetEmail, contactEmail } = require("../utils/emailSender");
// Create token for reset password
const { validationPassword } = require("../utils/validation")
// Verify posible dangerous data in forms
const { checkInputs } = require("../middleware/securityMiddleware");

module.exports = {

    // Receibe petition from frontend, and send the email to the user email
    passwordReset: async function (req, res, next) {
        try {
            const { email } = req.body;
        
            if (checkInputs({email})) {
                return res.status(403).json({ message: `Error verifique la informacion, se detecto un posible peligro en su envio ${email}.` });
            };

            if(!email){
                return res.status(400).json({message:  "Email is required."});
            };

            const user = await Users.findOne({ email });
        
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
            const resetLink = `http://127.0.0.1:3000/api/email/passwordRedirect/${resetToken}?email=${email}`;  
            sendResetEmail(email, resetLink, userName);
        
            console.log("redirect Link:" + resetLink);

            return res.status(200).json({ message: "Password reset email sent successfully" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:  "Internal server error."});
        };
    },

    /* Redirect user endpoint to Frontend */
    redirect: async function (req, res, next) {
        const { token } = req.params;
        const { email } = req.query;

        if(!token || !email){
            return res.status(400).json({message: "Falta email o token, verifique y reintente nuevamente."})
        };

        // when the user is sended by the email to this endpoint function, redirect the user to the Frontend, with the token and user email.
        const redirectURL = `http://127.0.0.1:5500/password-recovery-confirm.html?token=${token}&email=${email}`; // URL del front.
        // URL OF FROTNEND, WE SENDING THE TOKEN AND EMAIL, THE FRONTEND SHOULD SEND THIS FOR THE RECOVER OF PASSWROD

        return res.status(302).redirect(redirectURL);
    },

    /* request the new password and email (the token is verified at the router) and update the user */
    confirmPasswordReset: async function (req, res, next) {
        try {
            const { newPassword, email } = req.body;

            console.log(checkInputs({ newPassword, email }));

            if(checkInputs({ newPassword, email })){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };

            if(!newPassword || !email){
                return res.status(404).json({message: "Email is required."})
            };
          
            const user = await Users.findOne({ email });
          
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
    },

    getContactEmail: async function(req, res, next){
        try{
            const allEmails = await Emails.find();

            if (!allEmails || allEmails.length === 0) {
                return res.status(404).json({ message: "Emails no encontrados." });
            };

            return res.json({ Emails: allEmails });
        
        }catch(err){
            console.error(err);
            return res.status(500).json({message:  "Internal server error."});
        };
    },

    createContactEmail: async function(req, res, next){
        try{
            let { name, email, affair, message } = req.body;

            if(checkInputs({ email, affair, message })){
                return res.status(403).json({ message: "Error verifique la informacion, se detecto un posible peligro"})
            };

            if(!email || !affair || !message){
                return res.status(400).json({ message: "Los campos email, affair y message son obligatorios." });
            };

            if(!name){
                name = email;
            }else{
                if(checkInputs({ name })){;
                    return res.status(403).json({ message: "Error, verifique la información del nombre, se detectó un posible peligro." });
                };
            };

            const emailData = new Emails ({
                name, 
                email, 
                affair, 
                message
            });

            contactEmail(name, email, affair, message);

            await emailData.save();

            return res.status(201).json({ message : `Email de ${email} enviado satisfactoriamente.`})
        }catch(err){
            console.error(err);
            return res.status(500).json({message:  "Internal server error."});
        };
    },

    deleteContactsEmails: async function(req, res, next){
        try{
            const deletedEmails = await Emails.deleteMany({});

            return res.status(200).json({ message: `Emails eliminados.` });
        }catch(err){
            console.error(err);
            return res.status(500).json({message:  "Internal server error."});
        };
    },
};