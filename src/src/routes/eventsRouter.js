"use strinct";

const express = require('express');
const router = express.Router();
const { getEvents, getEvent, createEvents, usersJoiningEvent, userQuitEvent,updateEvent , deleteEvent, deleteAllEvents} = require('../controllers/eventsController');
const { badMethod } = require("../utils/errorHandler");
const { jsonWebTokenVerify } = require("../middleware/authMiddleware");
const { ipCheck, apiLimiter } = require("../middleware/securityMiddleware");

/***** "/events" defined at app.js *****/

// Get the events
router.get('/', getEvents);
router.get("/:eventId", getEvent);
router.all('/', badMethod)

// Create the event
router.post("/create", jsonWebTokenVerify, apiLimiter, createEvents);
// Upload user to the event
router.put("/usersevent", jsonWebTokenVerify, apiLimiter, usersJoiningEvent);
// User quit event
router.put("/userquit", jsonWebTokenVerify, apiLimiter, userQuitEvent);
// Event update/modify
router.put("/update", jsonWebTokenVerify, apiLimiter, updateEvent)

// Delete specific event based on email (must be the same as the creator)
router.delete("/delete/:eventId", jsonWebTokenVerify, apiLimiter, deleteEvent);
// router.delete("/deleteall", apiLimiter, deleteAllEvents);

module.exports = router;