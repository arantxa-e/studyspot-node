import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../../src/models/user";

type User = IUser & { _id: mongoose.Types.ObjectId };

const userOneId = new mongoose.Types.ObjectId();

const userOne: User = {
  _id: userOneId,
  firstName: "Mike",
  lastName: "Wazawski",
  displayName: "mikewazzit",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET!),
    },
  ],
};

export const users = { userOne };
