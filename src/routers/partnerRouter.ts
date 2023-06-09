import express from "express";
import { authPartner } from "../middleware/authPartner";
import { processFormData } from "../middleware/processFormData";
import {
  createPartner,
  getPartner,
  loginPartner,
  logoutPartner,
  updatePartner,
} from "../controllers/partnerControllers";

const router = express.Router();

router.post("/partner", processFormData, createPartner);
router.post("/partner/login", processFormData, loginPartner);
router.post("/partner/logout", authPartner, logoutPartner);
router.get("/partner/profile", authPartner, getPartner);
router.patch("/partner/profile", processFormData, authPartner, updatePartner);

export default router;
