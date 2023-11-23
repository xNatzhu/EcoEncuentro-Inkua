"use strict";

function badMethod() {
    return  res.status(405).json({ message: 'Method Not Allowed in this path.' });
};

module.exports = { badMethod };