import { RequestHandler } from "express";
import Review, { IReview } from "../models/review";
import createError from "http-errors";
import { validateRequest } from "../utils/validateRequest";
import { errorMessages } from "../utils/constants";

export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.user?._id,
      displayName: req.user?.displayName,
    });

    if (!review) throw createError(400, errorMessages.notCreated);

    await review.save();
    await Review.updateStudySpotRating(review.studySpot);
    res.status(201).send(review);
  } catch (err) {
    next(err);
  }
};

export const updateReview: RequestHandler = async (req, res, next) => {
  try {
    const validParams: Array<keyof IReview> = ["rating", "content"];

    validateRequest(req, validParams);

    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user?._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) throw createError(404, errorMessages.invalidPatch);

    await Review.updateStudySpotRating(review.studySpot);

    res.send(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview: RequestHandler = async (req, res, next) => {
  const _id = req.params.id;

  try {
    const deletedReview = await Review.findOneAndDelete({
      _id,
      user: req.user?._id,
    });

    if (!deletedReview) throw createError(404, errorMessages.invalidDelete);

    await Review.updateStudySpotRating(deletedReview.studySpot);
    res.send(deletedReview);
  } catch (err) {
    next(err);
  }
};
