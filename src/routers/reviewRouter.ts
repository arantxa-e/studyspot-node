import express from "express";
import auth from "../middleware/auth";
import Review from "../models/review";

const router = express.Router();

router.post("/reviews", auth, async (req, res) => {
  const review = new Review({
    ...req.body,
    user: req.user?._id,
  });

  try {
    await review.save();
    res.status(201).send(review);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
