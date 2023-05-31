import express from "express";
import Partner, { IPartner } from "../models/partner";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/partner", async (req, res) => {
  try {
    const partner = new Partner(req.body);
    if (!partner) res.status(400).send();
    const token = await partner.generateAuthToken();
    res.status(201).send({ partner, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/partner/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send(`Please enter a valid ${!email ? "email" : "password"}`);
    }
    const partner = await Partner.findByCredentials(email, password);
    const token = await partner.generateAuthToken();
    res.send({ partner, token });
  } catch (err) {
    res.status(400).send({ error: "Unable to login" });
  }
});

router.get("/partner/profile", auth, async (req, res) => {
  try {
    const id = req.partner?.id;
    const partner = await Partner.findById(id).populate("studySpots");
    if (!partner) return res.status(404).send();
    res.send(partner);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/partner/profile", auth, async (req, res) => {
  try {
    const validParams: Array<keyof IPartner> = ["company", "email", "password"];
    const isValidRequest = Object.keys(req.body).every((param) =>
      validParams.includes(param as keyof IPartner)
    );
    if (!isValidRequest)
      return res.status(400).send({ error: "Invalid params" });

    const updatedPartner = await Partner.findByIdAndUpdate(
      req.partner?._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPartner) {
      res.status(404).send();
    }
    res.send(updatedPartner);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
