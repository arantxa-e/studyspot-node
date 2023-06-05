import { Request, Response } from "express";
import Review, { IReview } from "../models/review";

export const createReview = async (req: Request, res: Response) => {
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
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const validParams: Array<keyof IReview> = ["rating", "content"];
    const updates = Object.keys(req.body);
    const isValidRequest = updates.every((param) =>
      validParams.includes(param as keyof IReview)
    );

    if (!isValidRequest)
      return res.status(400).send({ error: "Invalid params" });

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user?._id,
    });

    if (!review) return res.status(404).send();

    updates.forEach(
      // @ts-ignore
      (update) => (review[update as keyof IReview] = req.body[update])
    );

    await review.save();

    res.send(review);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const _id = req.params.id;

  try {
    const deletedReview = await Review.findOneAndDelete({
      _id,
      user: req.user?._id,
    });
    if (!deletedReview) {
      res.status(404).send();
    }
    res.send(deletedReview);
  } catch (err) {
    res.status(500).send();
  }
};
