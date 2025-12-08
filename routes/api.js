import express from "express";
import authenticate from "../src/middleware/authenticate";
import authRoutes from "./authRoute";
import userRoutes from "./userRoute";
import { baseUrl } from "../src/config/constant";

const router = express.Router();

router.use("/", authRoutes);
router.use("/user", authenticate, userRoutes);

router.get("/changelog", (req, res) => {
    res.render("changelog", {
        swaggerUrl: baseUrl() + "/api/documentation",
        baseUrl: baseUrl() + "/api/v1",
    });
});

export default router;