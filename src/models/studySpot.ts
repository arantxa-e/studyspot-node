import mongoose from "mongoose";
import { HoursOfOperation, SocialMediaLinks, OpenClose } from "../types/common";
import validator from "validator";

export interface IStudySpot {
  partner: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  location: {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  address: string;
  phoneNumber: string;
  hours: HoursOfOperation;
  logo?: string;
  photos?: string[];
  hasFreeWifi: boolean;
  website?: string;
  socialMedia?: SocialMediaLinks;
  rating: number;
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
  twitter: {
    type: String,
    validate(value: string) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL.");
      }
    },
  },
  facebook: {
    type: String,
    validate(value: string) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL.");
      }
    },
  },
  instagram: {
    type: String,
    validate(value: string) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL.");
      }
    },
  },
  snapchat: {
    type: String,
    validate(value: string) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid URL.");
      }
    },
  },
});

const geometrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const geoJSONSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Feature"],
    required: true,
  },
  geometry: {
    type: geometrySchema,
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
      maxLength: [30, "Company name is too long"],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: geoJSONSchema,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate(value: string) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number.");
        }
      },
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
    website: {
      type: String,
      validate(value: string) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL.");
        }
      },
    },
    socialMedia: socialMediaLinksSchema,
    rating: {
      type: Number,
      default: 0,
    },
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
