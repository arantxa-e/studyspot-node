import express from "express";
import auth from "../middleware/auth";
import { processFormData } from "../middleware/processFormData";
import {
  addFavorite,
  createUser,
  deleteFavorite,
  getUser,
  getUserById,
  getUserFavorites,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/user", processFormData, createUser);
router.post("/user/login", loginUser);
router.post("/user/logout", auth, logoutUser);
router.get("/user/profile", auth, getUser);
router.patch("/user/profile", auth, updateUser);
router.get("/user/favorites", auth, getUserFavorites);
router.post("/user/favorites/:studySpotId", auth, addFavorite);
router.delete("/user/favorites/:studySpotId", auth, deleteFavorite);
router.get("/user/:id", getUserById);

export default router;
