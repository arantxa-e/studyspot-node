import mongoose from "mongoose";

export interface IReview {
  user: mongoose.Schema.Types.ObjectId;
  displayName: string;
  studySpot: mongoose.Schema.Types.ObjectId;
  rating: number;
  content: string;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    displayName: {
      type: String,
      required: true,
    },
    studySpot: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "StudySpot",
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
