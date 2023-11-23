"use strict";

const cors = require('cors');

function corsConfig(req, res, next) {
    const corsOptions = {
        origin: '*' // To modify, in prod
    };
    
    cors(corsOptions)(req, res, next);
};

module.exports = corsConfig;