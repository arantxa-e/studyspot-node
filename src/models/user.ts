import mongoose from "mongoose";
import jwt from "jsonwebtoken";

interface IUser {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  avatar?: string;
  location?: string;
  password?: string;
  tokens?: Array<{ token: string }>;
}

interface IUserMethods {
  generateAuthToken(): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser, {}, IUserMethods>({
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
  password: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET!);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
