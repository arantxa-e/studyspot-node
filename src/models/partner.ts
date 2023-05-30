import mongoose, { Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
>({
  company: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

partnerSchema.virtual("studySpots", {
  ref: "StudySpot",
  localField: "_id",
  foreignField: "partner",
});

partnerSchema.methods.toJSON = function () {
  const partner = this;
  const partnerObj: IPartner = partner.toObject();

  delete partnerObj.tokens;

  return partnerObj;
};

partnerSchema.methods.generateAuthToken = async function () {
  const partner = this;
  const token = jwt.sign(
    { _id: partner._id.toString() },
    process.env.JWT_SECRET!
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
    throw new Error();
  }

  return bcrypt.compare(password, partner.password).then((res) => {
    if (res === true) {
      return partner;
    }

    return Promise.reject();
  });
};

const Partner = mongoose.model<IPartner, PartnerModel>(
  "Partner",
  partnerSchema
);

export default Partner;