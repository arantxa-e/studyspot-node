import Partner from "../models/partner";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  _id: string;
}

export const authPartner: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) throw new Error();

    req.token = token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    const partner = await Partner.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (partner) {
      req.partner = partner;
    } else {
      throw new Error();
    }

    next();
  } catch {
    res.status(401).send({ error: "Please authenticate." });
  }
};
