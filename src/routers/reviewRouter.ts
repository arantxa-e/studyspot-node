import express from "express";
import { authUser } from "../middleware/authUser";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers";

const router = express.Router();

router.post("/reviews", authUser, createReview);
router.patch("/reviews/:id", authUser, updateReview);
router.delete("/reviews/:id", authUser, deleteReview);

export default router;
