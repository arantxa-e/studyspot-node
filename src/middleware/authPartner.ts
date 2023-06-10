import Partner from "../models/partner";
import { RequestHandler } from "express";
import createError from "http-errors";
import { processAuthToken } from "../utils/processAuthToken";

export const authPartner: RequestHandler = async (req, res, next) => {
  try {
    const { token, decodedToken } = processAuthToken(req);

    if (!token || !decodedToken) throw new Error();

    const partner = await Partner.findOne({
      _id: decodedToken._id,
      "tokens.token": token,
    });

    if (!partner) throw new Error();

    req.partner = partner;

    next();
  } catch {
    next(createError(401, "Please authenticate."));
  }
};
