import { Router } from "express";
const router = Router();

import {
  createBoard,
  getBoardsByWorkspace,
} from "../controllers/boradController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, createBoard);
router.get("/:workspaceId", authMiddleware, getBoardsByWorkspace);

export default router;
