"use strict";

const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    event: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "events",
        required: true,
        
    }],
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("messages", messagesSchema);