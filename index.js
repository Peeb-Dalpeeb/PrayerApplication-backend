import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Activity from "./models/Activity";

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://prayerapplication.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---

// 1. GET ALL RECORDS: React will call this when the app first loads
app.get("/api/activities", async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }); // Get all, newest first
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. SAVE A NEW RECORD: React calls this after a spin or prayer
app.post("/api/activities", async (req, res) => {
  const activity = new Activity({
    id: req.body.id,
    student: req.body.student,
    action: req.body.action,
    timestamp: req.body.timestamp,
  });

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. DELETE A RECORD: React calls this when the trash can is clicked
app.delete("/api/activities/:id", async (req, res) => {
  try {
    // We look for the record using the custom ID we passed from React
    await Activity.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
