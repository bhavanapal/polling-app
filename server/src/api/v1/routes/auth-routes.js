import express from "express";
import protect from "../middlewares/auth-middleware.js";
import {registerUser, loginUser, userProfile, updatePassword} from "../controllers/user-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, userProfile);
router.put("/update-password", protect, updatePassword);

export default router;