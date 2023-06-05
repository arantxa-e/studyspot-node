import express from "express";
import User, { IUser } from "../models/user";
import StudySpot from "../models/studySpot";
import auth from "../middleware/auth";
import mongoose from "mongoose";
import { processFormData } from "../middleware/processFormData";

const router = express.Router();

router.post("/user", processFormData, async (req, res) => {
  try {
    const user = new User(req.body);
    if (!user) res.status(400).send();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send(`Please enter a valid ${!email ? "email" : "password"}`);
    }
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: "Unable to login" });
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.tokens) return res.status(404).send();

    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/user/profile", auth, async (req, res) => {
  try {
    if (!req.user) return res.status(404).send();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/favorites", auth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(400).send("Not a valid user.");

    if (!user.favorites?.length) return res.send([]);

    const favoriteStudySpots = await StudySpot.find({
      _id: { $in: user.favorites },
    });

    res.send(favoriteStudySpots);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/user/favorites/:studySpotId", auth, async (req, res) => {
  try {
    if (!req.params.studySpotId || req.params.studySpotId === ":studySpotId")
      return res.status(400).send("Please provide a StudySpot ID");

    if (!req.user) return res.status(400).send("Not a valid user.");

    const studySpotId = new mongoose.Types.ObjectId(req.params.studySpotId);

    req.user.favorites?.push(studySpotId);
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/user/favorites/:studySpotId", auth, async (req, res) => {
  try {
    if (!req.params.studySpotId || req.params.studySpotId === ":studySpotId")
      return res.status(400).send("Please provide a StudySpot ID");

    if (!req.user) return res.status(400).send("Not a valid user.");

    const studySpotId = req.params.studySpotId;

    const filteredArr = req.user.favorites?.filter(
      (id) => id.toString() !== studySpotId
    );

    req.user.favorites = filteredArr;
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const { limit, skip, sortBy } = req.query;
    const sort: { [key: string]: 1 | -1 } = {};

    if (sortBy && typeof sortBy === "string") {
      if (sortBy.startsWith("-")) {
        sort[sortBy.slice(1)] = -1;
      } else {
        sort[sortBy] = 1;
      }
    }

    const user = await User.findById(id).populate({
      path: "reviews",
      options: {
        limit: Number(limit),
        skip: Number(skip),
        sort,
      },
    });

    if (!user) return res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/user/profile", auth, async (req, res) => {
  try {
    const validParams: Array<keyof IUser> = [
      "firstName",
      "lastName",
      "displayName",
      "email",
      "password",
    ];
    const isValidRequest = Object.keys(req.body).every((param) =>
      validParams.includes(param as keyof IUser)
    );

    if (!isValidRequest)
      return res.status(400).send({ error: "Invalid params" });

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).send();
    }

    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
