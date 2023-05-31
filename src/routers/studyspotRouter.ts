import express from "express";
import auth from "../middleware/auth";
import StudySpot, { IStudySpot } from "../models/studySpot";

const router = express.Router();

router.get("/studyspots", auth, async (req, res) => {
  try {
    const studySpots = await StudySpot.find();
    res.send(studySpots);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/studyspots/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;

    const studySpot = await StudySpot.findById(_id).populate("reviews");

    if (!studySpot) res.status(404).send();

    res.send(studySpot);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.post("/studyspots", auth, async (req, res) => {
  const studySpot = new StudySpot({
    ...req.body,
    partner: req.foundUser?._id,
  });

  try {
    await studySpot.save();
    res.status(201).send(studySpot);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/studyspots/:id", auth, async (req, res) => {
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
      partner: req.foundUser?._id,
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
      partner: req.foundUser?._id,
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
