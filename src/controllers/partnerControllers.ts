import { Request, Response } from "express";
import Partner, { IPartner } from "../models/partner";

export const createPartner = async (req: Request, res: Response) => {
  try {
    const partner = new Partner(req.body);
    if (!partner) res.status(400).send();
    const token = await partner.generateAuthToken();
    res.status(201).send({ partner, token });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const loginPartner = async (req: Request, res: Response) => {
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
};

export const logoutPartner = async (req: Request, res: Response) => {
  try {
    if (!req.partner || !req.partner.tokens) return res.status(404).send();

    req.partner.tokens = req.partner.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.partner.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

export const getPartner = async (req: Request, res: Response) => {
  try {
    const id = req.partner?.id;
    const partner = await Partner.findById(id).populate("studySpots");
    if (!partner) return res.status(404).send();
    res.send(partner);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updatePartner = async (req: Request, res: Response) => {
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
};
