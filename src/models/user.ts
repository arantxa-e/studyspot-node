import mongoose, { Model, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  avatar?: string;
  location?: string;
  password: string;
  tokens?: Array<{ token: string }>;
}

interface UserMethods {
  generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<IUser, {}, UserMethods> {
  findByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser & UserMethods>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel, UserMethods>({
  firstName: String,
  lastName: String,
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: Buffer,
  location: String,
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

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj: IUser = user.toObject();

  delete userObj.tokens;

  return userObj;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
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
