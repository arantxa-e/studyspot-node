import User from "../models/user";
import Partner from "../models/partner";
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
    const partner = await Partner.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user && !partner) throw new Error();
    const foundUser = user || partner;
    req.token = token;
    req.foundUser = foundUser!;
    next();
  } catch {
    res.status(401).send({ error: "Please authenticate." });
  }
};

export default auth;
