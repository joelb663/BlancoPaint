import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    zipcode: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    city: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    keywords: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;