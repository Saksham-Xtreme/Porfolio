import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { title: "Test Project", desc: "Backend connected successfully" }
  ]);
});

export default router;