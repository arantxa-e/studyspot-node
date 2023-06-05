import express from "express";
import auth from "../middleware/auth";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers";

const router = express.Router();

router.post("/reviews", auth, createReview);
router.patch("/reviews/:id", auth, updateReview);
router.delete("/reviews/:id", auth, deleteReview);

export default router;
