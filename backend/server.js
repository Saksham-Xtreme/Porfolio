import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import contactRoutes from "./routes/contact.routes.js";
import projectRoutes from "./routes/projects.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/projects", projectRoutes);
app.get("/", (req, res) => {
  res.send("Page is Working");
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
