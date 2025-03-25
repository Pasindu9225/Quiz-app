import express from "express";
import {
  createSession,
  getUserSessions,
  getSessionById,
  deleteSession,
} from "../controllers/sessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-session", authMiddleware, createSession);
router.get("/my-sessions", authMiddleware, getUserSessions);
router.get("/:id", authMiddleware, getSessionById);
router.delete("/:id", authMiddleware, deleteSession);

export default router;
