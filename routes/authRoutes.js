import { Router } from "express";
const router = Router();

import {
  registerUser,
  loginUser,
  getProfile,
  googleLogin,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getProfile);

export default router;
