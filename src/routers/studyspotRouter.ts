import express from "express";
import auth from "../middleware/auth";
import { geocodeAddress } from "../middleware/geocodeAddress";
import { imageUpload } from "../middleware/uploadImages";
import {
  createStudySpot,
  deleteStudySpot,
  getStudySpotById,
  getStudySpots,
  updateStudySpot,
  uploadStudySpotImages,
} from "../controllers/studySpotControllers";

const router = express.Router();

router.get("/studyspots", getStudySpots);
router.get("/studyspots/:id", getStudySpotById);
router.post("/studyspots/:id/upload", auth, imageUpload, uploadStudySpotImages);
router.post("/studyspots", auth, geocodeAddress, createStudySpot);
router.patch("/studyspots/:id", auth, geocodeAddress, updateStudySpot);
router.delete("/studyspots/:id", auth, deleteStudySpot);

export default router;
