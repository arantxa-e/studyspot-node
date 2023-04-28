import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: {
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
});

const User = mongoose.model("User", userSchema);

export default User;
