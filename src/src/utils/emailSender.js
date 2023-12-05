/**
 * @param { string } userEmail
 * @param { string } resetLink
 * @param { string } userName
 * @param { Object } eventData
 * @returns { void }
 */

"use strict";

const nodemailer = require("nodemailer");
// Style for email function
const {htmlResetEmail, htmlMailContact, htmlEventEmail} = require("./emailStyles");
require("dotenv").config();

// Variables and transporter
const mailerUrl = process.env.MAILER;
const transporter = nodemailer.createTransport(mailerUrl);

// Function to send a password reset email
function sendResetEmail(userEmail, resetLink, userName) {

    // Create email message
    const mailOptions = {
        from: "eco_encuentro@inkua.com",
        to: userEmail,
        subject: "Password Reset Request",
        html: htmlResetEmail(resetLink, userName)
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);

            return;
        } else {
            console.log("Password reset email sent:", info.response);

            return;
        };
    });
};

function sendEVentEmail(userEmail, eventData, userName) {

    // Create email message
    const mailOptions = {
        from: "eco_encuentro@inkua.com",
        to: userEmail,
        subject: `Union a vento eco-encuentro ${eventData.eventDate}`,
        html: htmlEventEmail(eventData, userName)
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);

            return;
        } else {
            console.log("Password reset email sent:", info.response);

            return;
        };
    });
};


// Contacct Email
function contactEmail(name, email, affair, message) {

    const mailOptions = {
        from: email,
        to: "erwin.mdq@gmail.com",
        subject: affair,
        html: htmlMailContact(message, name, email)
    };
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        
            return;
        } else {
            console.log("Password reset email sent:", info.response);
        
            return;
        };
    });
};

module.exports = { 
    sendResetEmail,
    sendEVentEmail,
    contactEmail
 };