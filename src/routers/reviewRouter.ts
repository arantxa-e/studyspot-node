import express from "express";
import { authUser } from "../middleware/authUser";
import { processFormData } from "../middleware/processFormData";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers";

const router = express.Router();

router.post("/reviews", authUser, processFormData, createReview);
router.patch("/reviews/:id", authUser, processFormData, updateReview);
router.delete("/reviews/:id", authUser, deleteReview);

export default router;
