import express from "express";
import AuthController from "../src/controllers/authController";
import asyncWrapper from "express-async-wrapper";
import registerUserSchema from "../src/dtos/registerUser.dto";
import loginUserSchema from "../src/dtos/loginUser.dto";
import resetPasswordSchema from "../src/dtos/resetPassword.dto";
import validator from "../src/config/joiValidator";
import authenticate from "../src/middleware/authenticate";
const router = express.Router();

router.post("/register", validator.body(registerUserSchema), asyncWrapper(AuthController.register));

router.post("/login", validator.body(loginUserSchema), asyncWrapper(AuthController.login));

router.post("/logout", authenticate, asyncWrapper(AuthController.logout));

router.post("/send-otp", asyncWrapper(AuthController.sendOtp));

router.post("/verify-otp", asyncWrapper(AuthController.verifyOtp));

router.post("/reset-password", validator.body(resetPasswordSchema), asyncWrapper(AuthController.resetPassword));

export default router;
