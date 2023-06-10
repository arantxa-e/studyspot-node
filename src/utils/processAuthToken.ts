import { Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types/common";

export const processAuthToken = (req: Request) => {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();

  const decodedToken =
    token && token !== "null"
      ? (jwt.verify(token, process.env.JWT_SECRET!) as unknown as DecodedToken)
      : undefined;

  return {
    token,
    decodedToken,
  };
};
