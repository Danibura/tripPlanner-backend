import Trip from "../models/trip.model.js";
import mongoose from "mongoose";

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.log("error in fetching trips");
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTripByCode = async (req, res) => {
  try {
    const code = req.params.code;
    const trip = await Trip.findOne({ accessCode: code });
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: "Error getting the trip" });
  }
};

export const createTrip = async (req, res) => {
  const trip = req.body;

  // Controllo dei campi obbligatori
  if (!trip.destination || !trip.departureDate || !trip.returnDate) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all fields" });
  }

  const newTrip = new Trip(trip);

  try {
    await newTrip.save();
    return res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    console.error("Error in Create Trip:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  const { code } = req.params;
  const trip = req.body;

  try {
    const updatedTrip = await Trip.findOneAndUpdate(
      { accessCode: code },
      trip,
      { new: true }
    );
    if (!updatedTrip) {
      return res
        .status(404)
        .json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: updatedTrip });
  } catch (error) {
    console.log("error in updating trip");
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  const code = req.params.code;

  try {
    await Trip.findOneAndDelete({ accessCode: code });
    res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    console.log("error in deliting trip");
    res.status(500).json({ success: false, message: error.message });
  }
};
