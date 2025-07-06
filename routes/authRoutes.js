import { Router } from "express";
const router = Router();

import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getProfile);

export default router;
