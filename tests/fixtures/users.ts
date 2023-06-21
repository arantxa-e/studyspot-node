import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../../src/models/user";

type User = IUser & { _id: mongoose.Types.ObjectId };

export const mockUserId = "648fc12fbb66289c9295b5db";

export const mockUser = {
  _id: mockUserId,
  firstName: "Mike",
  lastName: "Wazawski",
  displayName: "mikewazzit",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: mockUserId }, process.env.JWT_SECRET!),
    },
  ],
};

export const users = { mockUser };
