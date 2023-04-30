import User from "../models/user";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
}

const auth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch {
    res.status(401).send({ error: "Please authenticate." });
  }
};

export default auth;
