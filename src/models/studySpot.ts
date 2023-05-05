import mongoose from "mongoose";
import { HoursOfOperation, SocialMediaLinks } from "../types/common";

export interface IStudySpot {
  partner: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  phoneNumber?: string;
  hours?: HoursOfOperation;
  logo?: Buffer;
  photos?: Buffer[];
  hasFreeWifi: boolean;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

const studySpotSchema = new mongoose.Schema<IStudySpot>({
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
  phoneNumber: String,
  hours: Object,
  logo: Buffer,
  photos: Array,
  hasFreeWifi: {
    type: Boolean,
    required: true,
  },
  website: String,
  socialMedia: Object,
});

const StudySpot = mongoose.model<IStudySpot>("StudySpot", studySpotSchema);

export default StudySpot;
