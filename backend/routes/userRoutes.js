import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUser);
router.delete("/profile", authMiddleware, deleteUser);

export default router;
