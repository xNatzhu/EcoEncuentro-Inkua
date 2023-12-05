"use strict";

const express = require("express");
const router = express.Router();
const { getContactEmail, deleteContactsEmails, createContactEmail, passwordReset, confirmPasswordReset, redirect } = require("../controllers/emailController");
const { jsonWebTokenVerify } = require("../middleware/authMiddleware");
const { badMethod } = require("../utils/errorHandler");
const { ipCheck, apiLimiter } = require("../middleware/securityMiddleware");

// Endpoint for send email the user requested
router.post("/password", passwordReset);
// Redirect endpoint to frontend with token and the user email
router.get("/passwordRedirect/:token", redirect);
// Change the password endpoint
router.post("/password/confirm", jsonWebTokenVerify, apiLimiter, confirmPasswordReset);
router.all("/", badMethod);

// Emails by contact
router.get("/email/contact", jsonWebTokenVerify, apiLimiter, getContactEmail);
router.post("/email/contact", apiLimiter, createContactEmail);
router.delete("/email/contact", apiLimiter, deleteContactsEmails);

module.exports = router;