import express from "express";

import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripByCode,
} from "../controllers/trip.controller.js";

const router = express.Router();

router.get("/", getTrips);

router.post("/", createTrip);

router.put("/:code", updateTrip);

router.delete("/:id", deleteTrip);

router.get("/:code", getTripByCode);
export default router;
