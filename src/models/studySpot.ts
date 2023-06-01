import mongoose from "mongoose";
import { HoursOfOperation, SocialMediaLinks, OpenClose } from "../types/common";
import { GeocodedAddress } from "geocodio-library-node";

export interface IStudySpot {
  partner: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  coordinates: [number, number];
  phoneNumber: string;
  hours: HoursOfOperation;
  logo?: Buffer;
  photos?: Buffer[];
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
    address: {
      type: String,
      required: true,
    },
    coordinates: [
      {
        type: Number,
        required: true,
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
    },
    hours: {
      type: hoursOfOperationSchema,
      required: true,
    },
    logo: Buffer,
    photos: [Buffer],
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
