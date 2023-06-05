import express from "express";
import auth from "../middleware/auth";
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
  auth,
  processStudySpotImages,
  uploadStudySpotImagesToS3,
  addStudySpotImages
);
router.post("/studyspots", auth, geocodeAddress, createStudySpot);
router.patch("/studyspots/:id", auth, geocodeAddress, updateStudySpot);
router.delete("/studyspots/:id", auth, deleteStudySpot);

export default router;
