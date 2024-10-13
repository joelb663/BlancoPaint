import React, { useState } from 'react';
import { Button, TextField, Box, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useTheme } from '@mui/material';
import { Formik, FieldArray } from 'formik';
import { useSelector } from "react-redux";
import * as yup from 'yup';
import { format, addDays } from 'date-fns';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

const availabilitySchema = yup.object().shape({
    weekStartDate: yup.date().required("Start date is required"),
    weekEndDate: yup.date().required("End date is required"),
    days: yup.array().of(
        yup.object().shape({
            dayOfWeek: yup.string().required("Day is required"),
            timeslots: yup.array().of(
                yup.object().shape({
                    startTime: yup.string().required("Start time is required"),
                    endTime: yup.string().required("End time is required"),
                })
            )
        })
    ),
});

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialValues = {
    weekStartDate: format(new Date(), 'yyyy-MM-dd'),
    weekEndDate: format(new Date(), 'yyyy-MM-dd'),
    days: [{ dayOfWeek: '', timeslots: [{ startTime: '', endTime: '' }] }],
};

const AvailabilityEntry = () => {
    const token = useSelector((state) => state.token);

    const [open, setOpen] = useState(false);
    const handleDialogOpen = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    // Get tomorrow's date for the `min` attribute
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

    // Extract theme and palette
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;

    const handleSubmitForm = async (values, { resetForm }) => {
        const transformedValues = {
            ...values,
            days: values.days.map(day => ({
                ...day,
                timeslots: day.timeslots.map(timeslot => {
                    // Parse 24-hour time format and convert to 12-hour format with AM/PM
                    const formattedStartTime = format(
                        new Date(`1970-01-01T${timeslot.startTime}:00`),
                        'hh:mm a'
                    );
                    const formattedEndTime = format(
                        new Date(`1970-01-01T${timeslot.endTime}:00`),
                        'hh:mm a'
                    );
                    // Combine formatted start and end times into the required format
                    const time = `${formattedStartTime} - ${formattedEndTime}`;

                    return {
                        time: time, // Set the time field as required by your model
                        available: true // Default availability to true
                    };
                })
            })),
        };

        try {
            const response = await fetch("http://localhost:3001/availability/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(transformedValues), // Send the entire transformedValues object
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json();
            resetForm();
            handleDialogClose();

            // Refresh the page after deleting
            window.location.reload();
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    return (
        <div>
            <IconButton onClick={handleDialogOpen}>
                <EditCalendarIcon fontSize="large" sx={{ color: dark }} />
            </IconButton>
            <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>Create Weekly Availability</DialogTitle>
                <Formik
                    initialValues={initialValues}
                    validationSchema={availabilitySchema}
                    onSubmit={handleSubmitForm}
                >
                    {({ values, handleChange, handleSubmit, errors, touched }) => (
                        <form onSubmit={handleSubmit}>
                            <DialogContent>
                                <Box display="flex" justifyContent="space-between">
                                    <TextField
                                        label="Week Start Date"
                                        type="date"
                                        name="weekStartDate"
                                        value={values.weekStartDate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            min: tomorrow, // Prevents selection of past and current day
                                        }}
                                        error={touched.weekStartDate && Boolean(errors.weekStartDate)}
                                        helperText={touched.weekStartDate && errors.weekStartDate}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Week End Date"
                                        type="date"
                                        name="weekEndDate"
                                        value={values.weekEndDate}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{
                                            min: values.weekStartDate || tomorrow, // Prevents selection of past, current day, or before the start date
                                        }}
                                        error={touched.weekEndDate && Boolean(errors.weekEndDate)}
                                        helperText={touched.weekEndDate && errors.weekEndDate}
                                        fullWidth
                                        margin="dense"
                                    />
                                </Box>
                                <FieldArray name="days">
                                    {({ push, remove }) => (
                                        <>
                                            {values.days.map((day, dayIndex) => (
                                                <Box key={dayIndex} mb={3}>
                                                    <TextField
                                                        label="Day of the Week"
                                                        select
                                                        name={`days[${dayIndex}].dayOfWeek`}
                                                        value={day.dayOfWeek}
                                                        onChange={handleChange}
                                                        error={touched.days?.[dayIndex]?.dayOfWeek && Boolean(errors.days?.[dayIndex]?.dayOfWeek)}
                                                        helperText={touched.days?.[dayIndex]?.dayOfWeek && errors.days?.[dayIndex]?.dayOfWeek}
                                                        fullWidth
                                                        margin="dense"
                                                    >
                                                        {daysOfWeek.map((day, index) => (
                                                            <MenuItem key={index} value={day}>
                                                                {day}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>

                                                    <FieldArray name={`days[${dayIndex}].timeslots`}>
                                                        {({ push: pushTimeslot, remove: removeTimeslot }) => (
                                                            <>
                                                                {day.timeslots.map((timeslot, timeslotIndex) => (
                                                                    <Box display="flex" alignItems="center" key={timeslotIndex} mt={2}>
                                                                        <TextField
                                                                            label="Start Time"
                                                                            type="time"
                                                                            name={`days[${dayIndex}].timeslots[${timeslotIndex}].startTime`}
                                                                            value={timeslot.startTime}
                                                                            onChange={handleChange}
                                                                            InputLabelProps={{ shrink: true }}
                                                                            error={touched.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.startTime && Boolean(errors.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.startTime)}
                                                                            helperText={touched.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.startTime && errors.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.startTime}
                                                                            margin="dense"
                                                                        />
                                                                        <TextField
                                                                            label="End Time"
                                                                            type="time"
                                                                            name={`days[${dayIndex}].timeslots[${timeslotIndex}].endTime`}
                                                                            value={timeslot.endTime}
                                                                            onChange={handleChange}
                                                                            InputLabelProps={{ shrink: true }}
                                                                            error={touched.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.endTime && Boolean(errors.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.endTime)}
                                                                            helperText={touched.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.endTime && errors.days?.[dayIndex]?.timeslots?.[timeslotIndex]?.endTime}
                                                                            margin="dense"
                                                                        />
                                                                        <Button
                                                                            onClick={() => removeTimeslot(timeslotIndex)}
                                                                            variant="outlined"
                                                                            color="error"
                                                                            sx={{ ml: 2 }}
                                                                        >
                                                                            Remove Timeslot
                                                                        </Button>
                                                                    </Box>
                                                                ))}
                                                                <Button
                                                                    onClick={() => pushTimeslot({ startTime: '', endTime: '' })}
                                                                    variant="outlined"
                                                                    sx={{ mt: 2 }}
                                                                >
                                                                    Add Timeslot
                                                                </Button>
                                                            </>
                                                        )}
                                                    </FieldArray>

                                                    <Button
                                                        onClick={() => remove(dayIndex)}
                                                        variant="outlined"
                                                        color="error"
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Remove Day
                                                    </Button>
                                                </Box>
                                            ))}
                                            <Button
                                                onClick={() => push({ dayOfWeek: '', timeslots: [{ startTime: '', endTime: '' }] })}
                                                variant="outlined"
                                                sx={{ mt: 2 }}
                                            >
                                                Add Day
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose}>Cancel</Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Save Availability
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};

export default AvailabilityEntry;