import express from "express";
import User from "../models/user";

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    if (!user) res.status(400).send();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
