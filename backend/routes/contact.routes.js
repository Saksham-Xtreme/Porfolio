import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = await Contact.create({ name, email, message });

    res.json({ success: true, data: newContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
});

export default router;