import express from "express";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../controllers/appointment.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", getAppointments);

/* CREATE */
router.post("/create", verifyToken, createAppointment);

/* UPDATE */
router.patch('/:id/updateAppointment', verifyToken, updateAppointment);

/* DELETE */
router.delete('/:id/deleteAppointment', verifyToken, deleteAppointment);

export default router;