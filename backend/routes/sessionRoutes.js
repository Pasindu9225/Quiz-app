import express from "express";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router();

router.get("/profile", clerkMiddleware(), (req, res) => {
  const user = req.auth;
  res.json({ message: "Authenticated User", user });
});

export default router;
