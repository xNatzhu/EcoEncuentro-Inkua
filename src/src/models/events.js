"use strict";

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Default IMG for users
const defaultImagePath = path.join(__dirname, '..', 'assets', 'events', 'default.png');
const defaultImageBase64 = fs.readFileSync(defaultImagePath, 'base64');
const defaultImageURI = `data:image/png;base64,${defaultImageBase64}`

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        min: 4,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    eventImg: {
        type: String,
        default: defaultImageURI,
    },
    createdBy: [{
        eventOwnedId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        eventOwnerName:  { type: String } ,
        eventOwnerEmail: { type: String } ,
        eventOwnerImg:   { type: String }
    }],
    usersJoined: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        userName:  { type: String } ,
        message:   { type: String } ,
        userImage: { type: String } 
    }],
    eventDate: {
        type: Date,
        required: true
    },
    map: {
        type: String,
        default: null,
    },
    description:{
        type: String,
        min: 50,
        required: true
    },
    category:{
        type: String,
        enum: ["Árboles", "Hogar", "Industria", "Animales", "Contaminación", "Basurales", "Energía", "Fauna marina"]
    },
    messages: [{
        messageId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages"
        },
        message:{
            type: String
        }
    }]
});

module.exports = mongoose.model("events", eventSchema);