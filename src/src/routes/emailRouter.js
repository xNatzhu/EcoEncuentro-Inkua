"use strict";

const express = require("express");
const router = express.Router();
const { passwordReset, confirmPasswordReset, redirect } = require("../controllers/emailController");
const { jsonWebTokenVerify } = require("../middleware/authMiddleware");
const { badMethod } = require("../utils/errorHandler");
const { ipCheck, apiLimiter } = require("../middleware/securityMiddleware");

// Endpoint for send email the user requested
router.post("/password", apiLimiter, passwordReset);
// Redirect endpoint to frontend with token and the user email
router.get("/password/:token", redirect);
// Change the password endpoint
router.post("/password/confirm", jsonWebTokenVerify , apiLimiter, confirmPasswordReset);
router.all("/", badMethod);

module.exports = router;