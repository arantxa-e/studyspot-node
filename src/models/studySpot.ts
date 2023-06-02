import mongoose from "mongoose";
import { HoursOfOperation, SocialMediaLinks, OpenClose } from "../types/common";

export interface IStudySpot {
  partner: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
  };
  phoneNumber: string;
  hours: HoursOfOperation;
  logo?: string;
  photos?: string[];
  hasFreeWifi: boolean;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

const openCloseSchema = new mongoose.Schema<OpenClose>({
  open: String,
  close: String,
});

const hoursOfOperationSchema = new mongoose.Schema<HoursOfOperation>({
  sunday: openCloseSchema,
  monday: openCloseSchema,
  tuesday: openCloseSchema,
  wednesday: openCloseSchema,
  thursday: openCloseSchema,
  friday: openCloseSchema,
  saturday: openCloseSchema,
});

const socialMediaLinksSchema = new mongoose.Schema<SocialMediaLinks>({
  twitter: String,
  facebook: String,
  instagram: String,
  snapchat: String,
});

const geoJSONSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const studySpotSchema = new mongoose.Schema<IStudySpot>(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Partner",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: geoJSONSchema,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    hours: {
      type: hoursOfOperationSchema,
      required: true,
    },
    logo: String,
    photos: [String],
    hasFreeWifi: {
      type: Boolean,
      required: true,
    },
    website: String,
    socialMedia: socialMediaLinksSchema,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

studySpotSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "studySpot",
});

const StudySpot = mongoose.model<IStudySpot>("StudySpot", studySpotSchema);

export default StudySpot;
