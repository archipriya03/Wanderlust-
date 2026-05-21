const express = require("express");

const router = express.Router();

const passport = require("passport");

const wrapAsync = require("../utils/wrapAsyncs");

const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


// SIGNUP FORM
router.get("/signup", userController.renderSignupForm);


// SIGNUP
router.post(
    "/signup",
    wrapAsync(userController.signup)
);


// LOGIN FORM
router.get("/login", userController.renderLoginForm);


// LOGIN
router.post(
    "/login",

    saveRedirectUrl,

    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),

    userController.login
);


// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;