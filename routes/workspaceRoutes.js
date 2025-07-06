import { Router } from "express";
const router = Router();

import {
  createWorkspace,
  getUserWorkspaces,
  addMember,
  removeMember,
} from "../controllers/workSpaceController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getUserWorkspaces);
router.post("/add-member", authMiddleware, addMember);
router.post("/remove-member", authMiddleware, removeMember);

export default router;
