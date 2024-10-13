import Appointment from "../models/Appointment.js";
import { sendAppointmentNotification } from "../services/emailService.js";

/* CREATE */
export const createAppointment = async (req, res) => {
    try {
        const { 
            userId, 
            address, 
            zipcode,
            city,
            timeSlot, 
            date, 
            keywords 
        } = req.body;

        const existingAppointment = await Appointment.findOne({ date, timeSlot });
        if (existingAppointment) {
            return res.status(409).json({ message: "This time slot is already booked." });
        }

        const newAppointment = new Appointment({
            userId,
            address,
            zipcode,
            city,
            timeSlot,
            date,
            keywords,
        });

        const savedAppointment = await newAppointment.save();

        // Send confirmation email
        await sendAppointmentNotification(userId, {
            date,
            timeSlot,
            address,
            city,
            zipcode
        }, 'create');
    
        res.status(201).json(savedAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* READ */
export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* UPDATE */
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params; // Get the appointment ID from the request parameters
        const appointment = await Appointment.findById(id);
  
        const { 
            address, 
            zipcode,
            city,
            timeSlot, 
            keywords 
        } = req.body;
    
        appointment.address = address;
        appointment.zipcode = zipcode;
        appointment.city = city;
        appointment.timeSlot = timeSlot;
        appointment.keywords = keywords;
        const updatedAppointment = await appointment.save();

        // Send update email
        await sendAppointmentNotification(updatedAppointment.userId, {
            date: updatedAppointment.date,
            timeSlot: updatedAppointment.timeSlot,
            address: updatedAppointment.address,
            city: updatedAppointment.city,
            zipcode: updatedAppointment.zipcode
        }, 'update');
    
        res.status(200).json(appointment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* DELETE */
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params; // Get the appointment ID from the request parameters

        // Find and delete the appointment
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        // If appointment not found
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        // Send cancellation email
        await sendAppointmentNotification(deletedAppointment.userId, {
            date: deletedAppointment.date,
            timeSlot: deletedAppointment.timeSlot,
            address: deletedAppointment.address,
            city: deletedAppointment.city,
            zipcode: deletedAppointment.zipcode
        }, 'delete');

        res.status(200).json({ message: "Appointment deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};