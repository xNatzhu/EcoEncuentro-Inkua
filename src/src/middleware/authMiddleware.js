"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = "inkua";

const jsonWebTokenVerify = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json("Error: Token necesario");
    };

    const token = authHeader.split(" ")[1];

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json(`Error en la verificación del token: ${err}`);
        } else {
            next();
        };
    });
};

module.exports = {jsonWebTokenVerify, jwtSecret};