// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controller and middlewares
const {
    sendOTP,
    signUp,
    login,
    changePassword
} = require("../controllers/Auth")
const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")

const {auth} = require("../middleware/auth")

// Routes for login,signup,Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post("/login",login)
router.post("/signup",signUp)
router.post("/sendotp",sendOTP)
router.post("/changepassword",auth,changePassword)
// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)