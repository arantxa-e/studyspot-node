import mongoose, { Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

export interface IPartner {
  company: string;
  email: string;
  password: string;
  tokens?: Array<{ token: string }>;
}

interface PartnerMethods {
  generateAuthToken(): Promise<string>;
}

interface PartnerModel extends Model<IPartner, {}, PartnerMethods> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IPartner & PartnerMethods>>;
}

const partnerSchema = new mongoose.Schema<
  IPartner,
  PartnerModel,
  PartnerMethods
>(
  {
    company: {
      type: String,
      maxLength: [30, "Company name is too long."],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "The password is too short."],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

partnerSchema.virtual("studySpots", {
  ref: "StudySpot",
  localField: "_id",
  foreignField: "partner",
});

partnerSchema.methods.toJSON = function () {
  const partner = this;
  const partnerObj = partner.toObject();

  delete partnerObj.tokens;
  delete partnerObj.password;

  return partnerObj;
};

partnerSchema.methods.generateAuthToken = async function () {
  const partner = this;
  const token = jwt.sign(
    { _id: partner._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  partner.tokens = partner.tokens.concat({ token });
  await partner.save();
  return token;
};

partnerSchema.pre("save", function (next) {
  const partner = this;

  if (partner.isModified("password")) {
    partner.password = bcrypt.hashSync(partner.password, 8);
  }

  next();
});

partnerSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const partner = await Partner.findOne({ email });

  if (!partner) {
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, partner.password);

  if (isPasswordMatch) {
    return partner;
  }
};

const Partner = mongoose.model<IPartner, PartnerModel>(
  "Partner",
  partnerSchema
);

export default Partner;
