import express from "express";
import auth from "../middleware/auth";
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
router.post("/partner/logout", auth, logoutPartner);
router.get("/partner/profile", auth, getPartner);
router.patch("/partner/profile", auth, updatePartner);

export default router;
