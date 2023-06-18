import User from "../models/user";
import { RequestHandler } from "express";
import createError from "http-errors";
import { processAuthToken } from "../utils/processAuthToken";

export const authUser: RequestHandler = async (req, res, next) => {
  try {
    const { token, decodedToken } = processAuthToken(req);

    if (!token || !decodedToken) throw new Error();

    const user = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });

    if (!user) throw new Error();

    req.user = user;

    next();
  } catch {
    next(createError(401, "Please authenticate."));
  }
};
