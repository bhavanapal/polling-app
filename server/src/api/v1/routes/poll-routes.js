import express from "express";
import protect,{adminOnly} from "../middlewares/auth-middleware.js";
import { closePoll, createPoll, deletePoll, getPolls, votePoll } from "../controllers/poll-Controller.js";

const router = express.Router();

// public/authenticated
router.get("/", protect, getPolls );

// voting
router.post("/vote/:id", protect, votePoll);

// Admin only
router.post("/create", protect, adminOnly, createPoll);
router.delete("/:id", protect, adminOnly, deletePoll);
router.patch("/close/:id", protect, adminOnly,closePoll);

export default router;
