"use strict";

/**
* 
* @param {String} password 
* @param {String} email
* @returns {String}
*
*/
    
const bcrypt = require('bcrypt');

function validationPassword(password) {
    if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
        return new Error('El password debe contener al menos una letra y un número.');
    } else {
        let newPassword = bcrypt.hashSync(password, 10);
        return newPassword
    };
};

function validationEmail(email) {
    if (email) {
        if (email.includes('@') && email.includes('.')) {
            return true;
        } else {
            return false;
        };
    } else {
        return false;
    };
};

module.exports = {
    validationEmail,
    validationPassword
};