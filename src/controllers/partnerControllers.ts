import { RequestHandler } from "express";
import Partner, { IPartner } from "../models/partner";
import createError from "http-errors";
import { errorMessages } from "../utils/constants";
import { validateRequest } from "../utils/validateRequest";

export const createPartner: RequestHandler = async (req, res, next) => {
  try {
    const partner = new Partner(req.body);

    if (!partner) throw createError(400, errorMessages.notCreated);

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
      throw createError(400, errorMessages.missingFields);
    }

    const partner = await Partner.findByCredentials(email, password);

    if (!partner) throw createError(400, errorMessages.invalidLogin);

    const { isAlreadyLoggedIn, token: presentToken } =
      await partner.checkIfAlreadyLoggedIn(req);

    if (isAlreadyLoggedIn) {
      return res.send({
        partner,
        token: presentToken,
      });
    }

    const token = await partner.generateAuthToken();
    res.send({ partner, token });
  } catch (err) {
    next(err);
  }
};

export const logoutPartner: RequestHandler = async (req, res, next) => {
  try {
    if (!req.partner || !req.partner.tokens)
      throw createError(401, errorMessages.unauthorized);

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
    validateRequest(req, validParams);

    const updatedPartner = await Partner.findByIdAndUpdate(
      req.partner?._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPartner) {
      throw createError(404, errorMessages.invalidPatch);
    }
    res.send(updatedPartner);
  } catch (err) {
    next(err);
  }
};
