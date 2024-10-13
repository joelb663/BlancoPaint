import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

const TimeSlotSelector = ({ selectedDate, availability, setFieldValue, selectedTimeSlot }) => {
    const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
    const availableTimeSlots = availability[dateKey] || [];

    const handleTimeSlotSelection = (timeSlot) => {
        setFieldValue("timeSlot", timeSlot);
    };

    return (
        <Box>
            <Typography variant="subtitle1">Select a Time Slot:</Typography>
            <Box display="flex" flexWrap="wrap">
                {availableTimeSlots.map((slot, index) => (
                    <Button
                        key={index}
                        variant={selectedTimeSlot === slot.time ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => handleTimeSlotSelection(slot.time)} // Pass the time string
                        disabled={!slot.available} // Disable if not available
                        sx={{ margin: "4px" }}
                    >
                        {slot.time} {/* Display the time of the slot */}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default TimeSlotSelector;