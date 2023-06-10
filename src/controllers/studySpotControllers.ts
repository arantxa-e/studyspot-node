import { RequestHandler } from "express";
import StudySpot, { IStudySpot } from "../models/studySpot";
import createError from "http-errors";
import { errorMessages } from "../utils/constants";
import { validateRequest } from "../utils/validateRequest";
import { getQueryOptions } from "../utils/getQueryOptions";

export const getStudySpots: RequestHandler = async (req, res, next) => {
  try {
    const { lat, lng, miles } = req.query;
    let studySpots;

    if (lat && lng && miles) {
      const radius = Number(miles) / 3963.2;
      const coords = [Number(lng), Number(lat)];

      studySpots = await StudySpot.find({
        location: {
          $geoWithin: {
            $centerSphere: [coords, radius],
          },
        },
      });
    } else {
      studySpots = await StudySpot.find();
    }

    res.send(studySpots);
  } catch (err) {
    next(err);
  }
};

export const getStudySpotById: RequestHandler = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const options = getQueryOptions(req);

    const studySpot = await StudySpot.findById(_id).populate({
      path: "reviews",
      options,
    });

    if (!studySpot) throw createError(404, errorMessages.notFound);

    res.send(studySpot);
  } catch (err) {
    next(err);
  }
};

export const addStudySpotImages: RequestHandler = async (req, res, next) => {
  try {
    const studySpot = await StudySpot.findOne({
      _id: req.params.id,
      partner: req.partner?._id,
    });

    if (!studySpot) throw createError(404, errorMessages.notFound);

    studySpot.logo = req.logo;
    studySpot.photos = req.photos;

    res.send(studySpot);
  } catch (err) {
    next(err);
  }
};

export const createStudySpot: RequestHandler = async (req, res, next) => {
  try {
    const studySpot = new StudySpot({
      partner: req.partner?._id,
      location: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: req.coordinates,
        },
      },
      ...req.body,
    });

    if (!studySpot) throw createError(400, errorMessages.notCreated);

    await studySpot.save();
    res.status(201).send(studySpot);
  } catch (err) {
    next(err);
  }
};

export const updateStudySpot: RequestHandler = async (req, res, next) => {
  try {
    const validParams: Array<keyof IStudySpot> = [
      "name",
      "description",
      "address",
      "phoneNumber",
      "hours",
      "hasFreeWifi",
      "website",
      "socialMedia",
    ];

    validateRequest(req, validParams);

    const studySpot = await StudySpot.findOneAndUpdate(
      {
        _id: req.params.id,
        partner: req.partner?._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!studySpot) throw createError(404, errorMessages.notFound);

    res.send(studySpot);
  } catch (err) {
    next(err);
  }
};

export const deleteStudySpot: RequestHandler = async (req, res, next) => {
  try {
    const _id = req.params.id;

    const deletedStudySpot = await StudySpot.findOneAndDelete({
      _id,
      partner: req.partner?._id,
    });

    if (!deletedStudySpot) throw createError(404, errorMessages.notFound);

    res.send(deletedStudySpot);
  } catch (err) {
    next(err);
  }
};
