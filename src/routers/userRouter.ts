import express from "express";
import { authUser } from "../middleware/authUser";
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
router.post("/user/logout", authUser, logoutUser);
router.get("/user/profile", authUser, getUser);
router.patch("/user/profile", authUser, updateUser);
router.get("/user/favorites", authUser, getUserFavorites);
router.post("/user/favorites/:studySpotId", authUser, addFavorite);
router.delete("/user/favorites/:studySpotId", authUser, deleteFavorite);
router.get("/user/:id", getUserById);

export default router;
