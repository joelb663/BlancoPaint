import express from 'express';
import { createAvailability, getAllAvailabilities, updateTimeslot, updateTimeslots } from '../controllers/availability.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get('/', getAllAvailabilities);

/* CREATE */
router.post('/create', verifyToken, createAvailability);

/* UPDATE */
router.patch('/:selectedDate/updateTimeslot', verifyToken, updateTimeslot);

router.patch('/:selectedDate/updateTimeslots', verifyToken, updateTimeslots);

export default router;