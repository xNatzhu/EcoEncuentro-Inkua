"use strict";

const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    name: { type: String },
    email: {
        type: String,
        require: true,
        minLength: 7 
    },
    affair: {
        type: String,
        require: true,
        minLength: 10
    },
    message: {
        type: String,
        require: true,
        minLength: 50
    }
});

module.exports = mongoose.model("emails", emailSchema);