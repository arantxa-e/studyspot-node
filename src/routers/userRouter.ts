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
