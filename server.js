import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import tripRoutes from "./routes/trip.route.js";
import userRoutes from "./routes/user.route.js";
import authenticate from "./middleware/authenticate.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URL);

const allowedOrigins = [
  "http://localhost:5173", // sviluppo locale
  "https://trip-planner-rust-gamma.vercel.app", // dominio deployato
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(`/api/trips`, tripRoutes);
app.use(`/api/users`, userRoutes);

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}`, user: req.user });
});

app.get("/", (req, res) => {
  res.send("✅ API is running");
});

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
