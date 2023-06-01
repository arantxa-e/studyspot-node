import express from "express";
import auth from "../middleware/auth";
import { geocodeAddress } from "../middleware/geocodeAddress";
import StudySpot, { IStudySpot } from "../models/studySpot";

const router = express.Router();

router.get("/studyspots", async (req, res) => {
  const { lat, lng, miles } = req.query;

  let studySpots;

  try {
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
    console.log(err);
    res.status(500).send();
  }
});

router.get("/studyspots/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const { limit, skip, sortBy } = req.query;
    const sort: { [key: string]: 1 | -1 } = {};

    if (sortBy && typeof sortBy === "string") {
      if (sortBy.startsWith("-")) {
        sort[sortBy.slice(1)] = -1;
      } else {
        sort[sortBy] = 1;
      }
    }

    const studySpot = await StudySpot.findById(_id).populate({
      path: "reviews",
      options: {
        limit: Number(limit),
        skip: Number(skip),
        sort,
      },
    });

    if (!studySpot) res.status(404).send();

    res.send(studySpot);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.post("/studyspots", auth, geocodeAddress, async (req, res) => {
  const studySpot = new StudySpot({
    partner: req.partner?._id,
    location: {
      type: "Point",
      address: req.body.address,
      coordinates: req.coordinates,
    },
    ...req.body,
  });

  try {
    await studySpot.save();
    res.status(201).send(studySpot);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/studyspots/:id", auth, geocodeAddress, async (req, res) => {
  try {
    const validParams = Object.keys(StudySpot.schema.obj).filter(
      (param) => param !== "partner"
    );

    const updates = Object.keys(req.body);
    const isValidRequest = updates.every((param) =>
      validParams.includes(param as keyof IStudySpot)
    );

    if (!isValidRequest)
      return res.status(400).send({ error: "Invalid params" });

    const studySpot = await StudySpot.findOne({
      _id: req.params.id,
      partner: req.partner?._id,
    });

    if (!studySpot) return res.status(404).send();

    updates.forEach(
      // @ts-ignore
      (update) => (studySpot[update] = req.body[update])
    );

    await studySpot.save();

    res.send(studySpot);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/studyspots/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedStudySpot = await StudySpot.findOneAndDelete({
      _id,
      partner: req.partner?._id,
    });
    if (!deletedStudySpot) {
      res.status(404).send();
    }
    res.send(deletedStudySpot);
  } catch (err) {
    res.status(500).send();
  }
});

export default router;
