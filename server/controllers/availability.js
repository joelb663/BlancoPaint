import Availability from '../models/Availability.js';

/* CREATE */
export const createAvailability = async (req, res) => {
    try {
        const { weekStartDate, weekEndDate, days } = req.body;

        // Ensure required fields are present
        if (!weekStartDate || !weekEndDate || !days) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Normalize input for days and timeslots
        const normalizedDays = days.map(day => ({
            dayOfWeek: day.dayOfWeek,
            timeslots: day.timeslots.map(timeslot => ({
                time: timeslot.time, // Use the time field directly
                available: Boolean(timeslot.available) // Ensure this is a boolean
            }))
        }));

        // Check if availability for the given week already exists
        const existingAvailability = await Availability.findOne({
            weekStartDate: new Date(weekStartDate),
            weekEndDate: new Date(weekEndDate)
        });

        if (existingAvailability) {
            // If availability exists, update it
            existingAvailability.days = normalizedDays;
            await existingAvailability.save();
            return res.status(200).json({ message: 'Availability updated successfully', availability: existingAvailability });
        } else {
            // If availability doesn't exist, create a new one
            const newAvailability = new Availability({
                weekStartDate: new Date(weekStartDate),
                weekEndDate: new Date(weekEndDate),
                days: normalizedDays,
            });

            const savedAvailability = await newAvailability.save();
            return res.status(201).json({ message: 'Availability created successfully', availability: savedAvailability });
        }
    } catch (error) {
        console.error('Error creating availability:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/* READ */
export const getAllAvailabilities = async (req, res) => {
    try {
        // Retrieve all availability records from the database
        const availabilities = await Availability.find();

        // Return the results
        return res.status(200).json({ availabilities });
    } catch (error) {
        console.error('Error retrieving availabilities:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/* UPDATE */
export const updateTimeslot = async (req, res) => {
    const { selectedDate } = req.params;
    const { timeSlot, available } = req.body;

    try {
        // Find the availability by selected date
        const availability = await Availability.findOne({
            weekStartDate: { $lte: new Date(selectedDate) },
            weekEndDate: { $gte: new Date(selectedDate) }
        });

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found for the given date' });
        }

        // Find the corresponding day and timeslot
        const day = availability.days.find(day => day.dayOfWeek === new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' }));
        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        const timeslot = day.timeslots.find(slot => slot.time === timeSlot);
        if (!timeslot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }

        // Update the availability status of the timeslot
        timeslot.available = available;

        // Save the updated availability
        await availability.save();
        return res.status(200).json({ message: 'Timeslot updated successfully', availability });
    } catch (error) {
        console.error('Error updating timeslot:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const updateTimeslots = async (req, res) => {
    const { selectedDate } = req.params;
    const { oldTimeSlot, newTimeSlot } = req.body; // Get both old and new timeslots from the request body

    try {
        // Find the availability by selected date
        const availability = await Availability.findOne({
            weekStartDate: { $lte: new Date(selectedDate) },
            weekEndDate: { $gte: new Date(selectedDate) }
        });

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found for the given date' });
        }

        // Find the corresponding day
        const day = availability.days.find(day => day.dayOfWeek === new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' }));
        if (!day) {
            return res.status(404).json({ message: 'Day not found' });
        }

        // Find the old timeslot to be set as available
        const oldTimeslot = day.timeslots.find(slot => slot.time === oldTimeSlot);
        if (!oldTimeslot) {
            return res.status(404).json({ message: 'Old timeslot not found' });
        }

        // Find the new timeslot to be set as unavailable
        const newTimeslot = day.timeslots.find(slot => slot.time === newTimeSlot);
        if (!newTimeslot) {
            return res.status(404).json({ message: 'New timeslot not found' });
        }

        // Update the availability status of the old timeslot to available
        oldTimeslot.available = true;

        // Update the availability status of the new timeslot
        newTimeslot.available = false;

        // Save the updated availability
        await availability.save();
        return res.status(200).json({ message: 'Timeslot updated successfully', availability });
    } catch (error) {
        console.error('Error updating timeslot:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};