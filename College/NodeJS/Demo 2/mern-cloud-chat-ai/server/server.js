import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLPath } from "url";

import authRoutes from "./routes/auth.js";
import fileRoutes from "./routes/files.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT , () => console.log(`Server running on port ${PORT}`));