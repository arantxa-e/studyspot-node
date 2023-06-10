import mongoose, { Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { Request } from "express";
import { processAuthToken } from "../utils/processAuthToken";

export interface IUser {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  avatar?: string;
  location?: string;
  favorites?: Array<mongoose.Types.ObjectId>;
  password: string;
  tokens?: Array<{ token: string }>;
}

interface UserMethods {
  generateAuthToken(): Promise<string>;
  checkIfAlreadyLoggedIn(req: Request): Promise<{
    isAlreadyLoggedIn: boolean;
    token: string | undefined;
  }>;
}

interface UserModel extends Model<IUser, {}, UserMethods> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser & UserMethods>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel, UserMethods>(
  {
    firstName: String,
    lastName: String,
    displayName: {
      type: String,
      required: true,
      maxLength: [20, "Display name is too long."],
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
    avatar: Buffer,
    location: String,
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "StudySpot",
      },
    ],
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.tokens;
  delete userObj.password;

  return userObj;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "1 week" }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.checkIfAlreadyLoggedIn = async function (req: Request) {
  const partner = this;

  const { token, decodedToken } = processAuthToken(req);

  if (!token || !decodedToken)
    return {
      isAlreadyLoggedIn: false,
      token: undefined,
    };

  // @ts-ignore
  const isAlreadyLoggedIn = partner.tokens.some((tokenObj) => {
    return tokenObj.token === token;
  });

  return { isAlreadyLoggedIn, token };
};

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 8);
  }

  next();
});

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error();
  }

  return bcrypt.compare(password, user.password).then((res) => {
    if (res === true) {
      return user;
    }

    return Promise.reject();
  });
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
