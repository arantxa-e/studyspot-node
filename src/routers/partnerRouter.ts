import express from "express";

const router = express.Router();

router.get("/partner", (req, res) => {
  res.send("Hello world");
});

export default router;
