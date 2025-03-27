import express from "express";
import {
  createSession,
  getUserSessions,
  getSessionById,
  deleteSession,
  addQuizToSession,
  deleteQuizFromSession,
  viewAllQuizzes,
  editQuizInSession,
} from "../controllers/sessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-session", authMiddleware, createSession);
router.get("/my-sessions", authMiddleware, getUserSessions);
router.get("/:id", authMiddleware, getSessionById);
router.delete("/:id", authMiddleware, deleteSession);

router.post("/add-quiz", authMiddleware, addQuizToSession);

router.delete(
  "/:sessionId/quiz/:quizId",
  authMiddleware,
  deleteQuizFromSession
);

router.get("/:sessionId/quizzes", authMiddleware, viewAllQuizzes);
router.put("/:sessionId/quiz/:quizId", authMiddleware, editQuizInSession);

export default router;
