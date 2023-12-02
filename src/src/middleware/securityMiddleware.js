"use strict";

const rateLimit = require("express-rate-limit");

function ipCheck(req, res, next) {
    const allowedIP = "::1"; // localhost, to modify witch a list if needed
    //const allowedIP = "1.1"; test for specific IP, worked.
    const requestIP = req.ip;

    console.dir(requestIP);

    if (requestIP !== allowedIP) {
        return res.status(403).json({ error: "Access denied from this IP address." });
    };

    next();
};

function checkInputs(input) {
    const dangerousCharacters = /[<>\\&\"'=;{}[\]`$%#^?*!~+\-|,]/;

    if (typeof input === 'object') {
        for (const key in input) {
            if (input.hasOwnProperty(key)) {
                const data = input[key];
                if (dangerousCharacters.test(data)) {
                    return true;
                };
            };
        };
    }else{
        if (dangerousCharacters.test(input)) {
            return true;
        };
    };

    return false;
};

const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1000,
    message: "Maximo de request alcanzadas por dia, vuelva a intentarlo luego.",
});

module.exports = {
    ipCheck,
    checkInputs,
    apiLimiter
};