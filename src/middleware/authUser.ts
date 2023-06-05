import User from "../models/user";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
}

export const authUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) throw new Error();

    req.token = token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (user) {
      req.user = user;
    } else {
      throw new Error();
    }

    next();
  } catch {
    res.status(401).send({ error: "Please authenticate." });
  }
};
