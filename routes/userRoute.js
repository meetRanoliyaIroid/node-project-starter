import express from "express";
import UserController from "../src/controllers/userController";
import asyncWrapper from "express-async-wrapper";
import validator from "../src/config/joiValidator";
import { storeFile } from "../src/helpers/storeFile";
import changePasswordSchema from "../src/dtos/changePassword.dto";

const router = express.Router();

router.get("/profile", asyncWrapper(UserController.profile));

router.post("/info-update", storeFile("profile", "media/profile", "image", true), asyncWrapper(UserController.infoUpdate));

router.post("/change-password", validator.body(changePasswordSchema), asyncWrapper(UserController.changePassword));

router.delete("/delete-account", asyncWrapper(UserController.deleteAccount));

export default router;
