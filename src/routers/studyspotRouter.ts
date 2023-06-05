import express from "express";
import { authPartner } from "../middleware/authPartner";
import { geocodeAddress } from "../middleware/geocodeAddress";
import { processStudySpotImages } from "../middleware/processStudySpotImages";
import { uploadStudySpotImagesToS3 } from "../middleware/uploadStudySpotImagesToS3";
import {
  createStudySpot,
  deleteStudySpot,
  getStudySpotById,
  getStudySpots,
  updateStudySpot,
  addStudySpotImages,
} from "../controllers/studySpotControllers";

const router = express.Router();

router.get("/studyspots", getStudySpots);
router.get("/studyspots/:id", getStudySpotById);
router.post(
  "/studyspots/:id/upload",
  authPartner,
  processStudySpotImages,
  uploadStudySpotImagesToS3,
  addStudySpotImages
);
router.post("/studyspots", authPartner, geocodeAddress, createStudySpot);
router.patch("/studyspots/:id", authPartner, geocodeAddress, updateStudySpot);
router.delete("/studyspots/:id", authPartner, deleteStudySpot);

export default router;
