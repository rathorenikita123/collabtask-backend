import { Router } from "express";
const router = Router();

import {
  createTask,
  getTasksByColumn,
  updateTask,
  moveTask,
} from "../controllers/taskController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, createTask);
router.get("/:columnId", authMiddleware, getTasksByColumn);
router.patch("/:taskId", authMiddleware, updateTask);
router.patch("/move", authMiddleware, moveTask);

export default router;
