import mongoose from "mongoose";
import { type } from "node:os";

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
    users: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
