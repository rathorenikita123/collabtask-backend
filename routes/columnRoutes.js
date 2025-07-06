import { Router } from "express";
const router = Router();

import {
  createColumn,
  getColumnsByBoard,
  updateColumnOrder,
} from "../controllers/columnController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, createColumn);
router.get("/:boardId", authMiddleware, getColumnsByBoard);
router.patch("/reorder", authMiddleware, updateColumnOrder);

export default router;
