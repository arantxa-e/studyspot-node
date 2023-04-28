import express from "express";

const router = express.Router();

router.get("/review", (req, res) => {
  res.send("Hello world");
});

export default router;
