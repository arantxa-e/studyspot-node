import { RequestHandler } from "express";
import Partner, { IPartner } from "../models/partner";
import createError from "http-errors";

export const createPartner: RequestHandler = async (req, res, next) => {
  try {
    const partner = new Partner(req.body);

    if (!partner) throw createError(400, "The user could not be created.");

    const token = await partner.generateAuthToken();
    res.status(201).send({ partner, token });
  } catch (err) {
    next(err);
  }
};

export const loginPartner: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(
        400,
        `Please enter a valid ${!email ? "email." : "password."}`
      );
    }

    const partner = await Partner.findByCredentials(email, password);

    if (!partner)
      throw createError(
        400,
        "The email or password you entered was not correct. Please try again."
      );

    const token = await partner.generateAuthToken();
    res.send({ partner, token });
  } catch (err) {
    next(err);
  }
};

export const logoutPartner: RequestHandler = async (req, res, next) => {
  try {
    if (!req.partner || !req.partner.tokens)
      throw createError(401, "The user is not authenticated.");

    req.partner.tokens = req.partner.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.partner.save();
    res.send();
  } catch (err) {
    next(err);
  }
};

export const getPartner: RequestHandler = async (req, res, next) => {
  try {
    const partner = await req.partner!.populate("studySpots");
    res.send(partner);
  } catch (err) {
    next(err);
  }
};

export const updatePartner: RequestHandler = async (req, res, next) => {
  try {
    const validParams: Array<keyof IPartner> = ["company", "email", "password"];
    const isValidRequest = Object.keys(req.body).every((param) =>
      validParams.includes(param as keyof IPartner)
    );

    if (!isValidRequest) throw createError(400, "Invalid parameters provided.");

    const updatedPartner = await Partner.findByIdAndUpdate(
      req.partner?._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPartner) {
      throw createError(404, "Unable to find and update the user.");
    }
    res.send(updatedPartner);
  } catch (err) {
    next(err);
  }
};
