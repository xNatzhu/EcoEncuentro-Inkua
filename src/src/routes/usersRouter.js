"use strinct";

const express = require('express');
const router = express.Router();
const { getUsers, createUsers, loginUsers, deleteUser, deleteAllUsers, userUpdate } = require('../controllers/usersController');
const { badMethod } = require("../utils/errorHandler");
const { jsonWebTokenVerify } = require("../middleware/authMiddleware");
const { ipCheck, apiLimiter } = require("../middleware/securityMiddleware");

/***** "/users" defined at app.js *****/

// Get users.
// router.get('/', jsonWebTokenVerify, apiLimiter, getUsers);
router.all('/', badMethod)

// Create users.
router.post('/create', createUsers);
// Login.
router.post('/login', loginUsers);
// Update.
router.put("/update", jsonWebTokenVerify, apiLimiter, userUpdate)

// Delete user by email and token required.
router.delete('/delete/:emailToDelete', jsonWebTokenVerify, apiLimiter, deleteUser);
//router.all('/delete', badMethod)

// Clear users, just for dev mode.
//router.delete('/deleteall', deleteAllUsers);

module.exports = router;