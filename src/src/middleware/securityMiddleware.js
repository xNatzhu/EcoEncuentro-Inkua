"use strict";

const { check } = require("express-validator");
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

function sanitizerInputs(input) {
    const sanitizedInput = check(input).trim().escape().blacklist('<>\\&\""=;(){}[]`$%#^?*@!~+-|_:,'); 

    return sanitizedInput;
};

const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1000,
    message: "Maximo de request alcanzadas por dia, vuelva a intentarlo luego.",
});

module.exports = {
    ipCheck,
    sanitizerInputs,
    apiLimiter
};