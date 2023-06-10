import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import StudySpot from "../models/studySpot";
import mongoose from "mongoose";
import { getQueryOptions } from "../utils/getQueryOptions";
import createError from "http-errors";
import { errorMessages } from "../utils/constants";
import { validateRequest } from "../utils/validateRequest";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const user = new User(req.body);

    if (!user) throw createError(400, errorMessages.notCreated);

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    next(err);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const validParams: Array<keyof IUser> = [
      "firstName",
      "lastName",
      "displayName",
      "email",
      "password",
    ];

    validateRequest(req, validParams);

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw createError(404, errorMessages.invalidPatch);

    res.send(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw createError(400, errorMessages.missingFields);

    const user = await User.findByCredentials(email, password);

    if (!user) throw createError(400, errorMessages.invalidLogin);

    const { isAlreadyLoggedIn, token: presentToken } =
      await user.checkIfAlreadyLoggedIn(req);

    if (isAlreadyLoggedIn) {
      return res.send({
        user,
        token: presentToken,
      });
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    next(err);
  }
};

export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user || !req.user.tokens)
      throw createError(401, errorMessages.unauthorized);

    // req.user.tokens = req.user.tokens.filter(
    //   (token) => token.token !== req.token
    // );
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (err) {
    next(err);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user?.favorites?.length) return res.send([]);

    const favoriteStudySpots = await StudySpot.find({
      _id: { $in: user.favorites },
    });

    if (!favoriteStudySpots) throw createError(404, errorMessages.notFound);

    res.send(favoriteStudySpots);
  } catch (err) {
    next(err);
  }
};

export const addFavorite: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params.studySpotId || req.params.studySpotId === ":studySpotId")
      throw createError(400, "Please provide a StudySpot ID");

    const studySpotId = new mongoose.Types.ObjectId(req.params.studySpotId);

    const user = req.user!;
    const favorites = user.favorites || [];
    favorites.push(studySpotId);
    user.favorites = favorites;

    await user.save();
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const deleteFavorite: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params.studySpotId || req.params.studySpotId === ":studySpotId")
      throw createError(400, "Please provide a StudySpot ID");

    const studySpotId = req.params.studySpotId;
    const user = req.user!;

    const filteredArr = user.favorites?.filter(
      (id) => id.toString() !== studySpotId
    );

    user.favorites = filteredArr;
    await user.save();

    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = getQueryOptions(req);

    const user = await User.findById(id).populate({
      path: "reviews",
      options,
    });

    if (!user) throw createError(404, errorMessages.notFound);
    res.send(user);
  } catch (err) {
    next(err);
  }
};
