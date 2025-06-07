import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    departureDate: {
      type: String,
      required: true,
    },
    returnDate: {
      type: String,
      required: true,
    },
    accessCode: {
      type: String,
      required: true,
    },
    usefulInfo: {
      type: String,
      required: false,
    },
    activities: {
      type: [String],
      required: false,
    },
    organizers: {
      type: [String],
      required: false,
    },
    participants: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
