import express from "express";
import User, { IUser } from "../models/user";
import auth from "../middleware/auth";

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
