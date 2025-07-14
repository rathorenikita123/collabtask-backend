import { Router } from "express";
const router = Router();

import {
  registerUser,
  loginUser,
  getProfile,
  googleLogin,
  getAllUsers,
  getUserById,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getProfile);
router.get("/:userId", authMiddleware, getUserById);
router.get("/users", authMiddleware, getAllUsers);

export default router;
