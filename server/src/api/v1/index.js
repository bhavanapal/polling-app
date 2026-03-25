import express from 'express';
import authRoutes from "./routes/auth-routes.js";
import pollRoutes from "./routes/poll-routes.js";

const router = express.Router();

router.use("/user", authRoutes);
router.use("/polls", pollRoutes);

export default router;