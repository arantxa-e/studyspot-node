import mongoose from "mongoose";
import StudySpot from "./studySpot";

export interface IReview {
  user: mongoose.Schema.Types.ObjectId;
  displayName: string;
  studySpot: mongoose.Schema.Types.ObjectId;
  rating: number;
  content: string;
}

interface ReviewModel extends mongoose.Model<IReview> {
  updateStudySpotRating: (id: mongoose.Schema.Types.ObjectId) => Promise<void>;
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

reviewSchema.statics.updateStudySpotRating = async function (
  studySpotId: mongoose.Schema.Types.ObjectId
) {
  const aggregate = await Review.aggregate([
    {
      $match: { studySpot: studySpotId },
    },
    {
      $group: {
        _id: "$studySpot",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  const rating = aggregate[0]?.averageRating;

  await StudySpot.findByIdAndUpdate(studySpotId, {
    rating,
  });
};

const Review = mongoose.model<IReview, ReviewModel>("Review", reviewSchema);

export default Review;
