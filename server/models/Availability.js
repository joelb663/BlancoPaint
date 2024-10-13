import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
    weekStartDate: {
        type: Date, // Start date of the week (e.g., "2024-09-04")
        required: true,
    },
    weekEndDate: {
        type: Date, // End date of the week (e.g., "2024-09-10")
        required: true,
    },
    days: [{
        dayOfWeek: {
            type: String, // Example: "Monday", "Tuesday", etc.
            required: true,
        },
        timeslots: [{
            time: {
                type: String, // Example: "10:00 AM - 11:00 AM"
                required: true,
            },
            available: {
                type: Boolean, // true for available, false for booked
                required: true,
                default: true // Set default value to true
            }
        }]
    }]
}, { timestamps: true });

const Availability = mongoose.model("Availability", AvailabilitySchema);
export default Availability;