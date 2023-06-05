import express from "express";
import { authPartner } from "../middleware/authPartner";
import {
  createPartner,
  getPartner,
  loginPartner,
  logoutPartner,
  updatePartner,
} from "../controllers/partnerControllers";

const router = express.Router();

router.post("/partner", createPartner);
router.post("/partner/login", loginPartner);
router.post("/partner/logout", authPartner, logoutPartner);
router.get("/partner/profile", authPartner, getPartner);
router.patch("/partner/profile", authPartner, updatePartner);

export default router;
