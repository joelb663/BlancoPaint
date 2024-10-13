import React, { useState, useEffect } from "react";
import { format, startOfWeek, addDays, startOfMonth } from "date-fns";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import KeywordsSelector from "./KeywordsSelector";
import TimeSlotSelector from "./TimeSlotSelector";

const appointmentSchema = yup.object().shape({
    address: yup.string().required("Address is required").min(2).max(20),
    zipcode: yup.string().required("Zipcode is required").min(5).max(5),
    city: yup.string().required("City is required").min(2).max(20),
    timeSlot: yup.string().required("Time slot is required"),
    keywords: yup.array().of(yup.string()),
});

const initialValues = {
    address: "",
    zipcode: "",
    city: "",
    timeSlot: "",
    keywords: [],
};

const Calendar = () => {
    const userId = useSelector((state) => state.userId);
    const token = useSelector((state) => state.token);
    const isAdmin = useSelector((state) => state.isAdmin);

    const [availability, setAvailability] = useState({});
    const [appointments, setAppointments] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [open, setOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchAppointments = async () => {
            const response = await fetch("http://localhost:3001/appointments", {
                method: "GET",
            });
            const data = await response.json();

            // Map the appointments by date
            const appointmentsByDate = data.reduce((acc, appointment) => {
                const dateKey = appointment.date;
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push({
                    _id: appointment._id,
                    userId: appointment.userId,
                    timeSlot: appointment.timeSlot,
                    address: appointment.address,
                    city: appointment.city,
                    zipcode: appointment.zipcode,
                    keywords: appointment.keywords,
                });
                return acc;
            }, {});

            setAppointments(appointmentsByDate);
        };

        const fetchAvailability = async () => {
            try {
                const response = await fetch("http://localhost:3001/availability", {
                    method: "GET",
                });
                const data = await response.json();
        
                const availabilityByDate = data.availabilities.reduce((acc, avail) => {
                    const startDate = new Date(avail.weekStartDate);
                    const endDate = new Date(avail.weekEndDate);
        
                    for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const dayAvailability = avail.days.find(d => d.dayOfWeek === format(day, "EEEE"));
        
                        if (dayAvailability) {
                            acc[dateKey] = dayAvailability.timeslots;
                        }
                    }
                    return acc;
                }, {});
        
                setAvailability(availabilityByDate);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAppointments();
        fetchAvailability();
    }, [token]);

    const handleDateClick = (day, appointment = null) => {
        if (!userId) {
            setLoginDialogOpen(true); // Show login dialog if not logged in
            return;
        }

        const isOwner = appointment?.userId === userId;
        if (appointment && !isOwner && !isAdmin) {
            return; // Do not allow clicking if not admin or owner
        }

        setSelectedDate(day);
        setEditingAppointment(appointment);
        setOpen(true);
    };

    const handleCreateOrEditAppointment = async (values, onSubmitProps) => {
        const dateKey = format(selectedDate, "yyyy-MM-dd");
    
        const appointmentData = {
            userId: userId,
            address: values.address,
            zipcode: values.zipcode,
            city: values.city,
            timeSlot: values.timeSlot,
            date: dateKey,
            keywords: values.keywords,
        };

        // Store the old time slot before updating
        const oldTimeSlot = editingAppointment ? editingAppointment.timeSlot : null;
    
        if (editingAppointment) {
            const response = await fetch(`http://localhost:3001/appointments/${editingAppointment._id}/updateAppointment`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            });
            await response.json();    
        } else {
            // Create new appointment and mark the timeslot as unavailable
            const response = await fetch("http://localhost:3001/appointments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            });
            await response.json();
        }

        if (!oldTimeSlot) {
            // If oldTimeslot is null, mark the new timeslot as unavailable
            await fetch(`http://localhost:3001/availability/${selectedDate}/updateTimeslot`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    timeSlot: values.timeSlot,
                    available: false,
                }),
            });
        } else {
            // If oldTimeslot is not null, update the timeslot
            await fetch(`http://localhost:3001/availability/${selectedDate}/updateTimeslots`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldTimeSlot: oldTimeSlot,
                    newTimeSlot: values.timeSlot,
                }),
            });
        }
    
        setOpen(false);
        onSubmitProps.resetForm();
        setEditingAppointment(null);

        // Refresh the page after deleting
        window.location.reload();
    };

    const handleDeleteAppointment = async () => {
        await fetch(`http://localhost:3001/appointments/${editingAppointment._id}/deleteAppointment`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        // Restore the timeslot as available
        await fetch(`http://localhost:3001/availability/${selectedDate}/updateTimeslot`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                timeSlot: editingAppointment.timeSlot,
                available: true,
            }),
        });
    
        setOpen(false);
        setEditingAppointment(null);

        // Refresh the page after deleting
        window.location.reload();
    };

    const renderHeader = () => {
        return (
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button onClick={() => setCurrentMonth(addDays(currentMonth, -31))}>Previous</Button>
                <Typography variant="h4">{format(currentMonth, "MMMM yyyy")}</Typography>
                <Button onClick={() => setCurrentMonth(addDays(currentMonth, 31))}>Next</Button>
            </Box>
        );
    };

    const renderDays = () => {
        const days = [];
        const dateFormat = "iiii";
        let startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <Box key={i} sx={{ width: "14.28%", textAlign: "center" }}>
                    {format(addDays(startDate, i), dateFormat)}
                </Box>
            );
        }

        return <Box display="flex">{days}</Box>;
    };
    
    const renderCells = () => {
        const rows = [];
        const dateFormat = "d";
        const startWeek = startOfWeek(startOfMonth(currentMonth));
        let day = startWeek;
        let formattedDate = "";

        for (let i = 0; i < 5; i++) {
            const cells = [];
    
            for (let j = 0; j < 7; j++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;
                const dateKey = format(day, "yyyy-MM-dd");

                const availableSlots = availability[dateKey]?.flatMap(dayAvailability => 
                    dayAvailability.available ? // Check if the time slot is available
                        [{ time: dayAvailability.time, available: dayAvailability.available }] : [] // Return the time and availability as an object
                ) || [];
                
                const isAvailable = availableSlots.length > 0;

                cells.push(
                    <Box
                        key={day}
                        onClick={isAvailable ? () => handleDateClick(cloneDay) : null}  // Disable click if no available slots
                        sx={{
                            width: "14.28%",
                            textAlign: "center",
                            cursor: isAvailable ? "pointer" : "default",
                            backgroundColor: isAvailable ? "white" : "#d3d3d3", // Gray out if no availability
                            border: appointments[dateKey] ? "1px solid #ccc" : "1px solid transparent",
                            borderColor: isAvailable ? "green" : "transparent",
                            opacity: isAvailable ? 1 : 0.5,
                        }}
                    >
                        <Box>{formattedDate}</Box>
                        {appointments[dateKey] && (
                            <Box>
                                {appointments[dateKey].map((appointment, index) => {
                                    const isOwner = appointment.userId === userId;
                                    return (
                                        <Typography
                                            key={index}
                                            variant="body2"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering date click
                                                handleDateClick(cloneDay, appointment);
                                            }}
                                            sx={{
                                                backgroundColor: isOwner ? "#FF5722" : "#1976d2", // Use orange for user's appointments
                                                color: "white",
                                                mb: .1,
                                                borderRadius: '50px', // Rounded corners for pill shape
                                            }}
                                        >
                                            {appointment.timeSlot}
                                        </Typography>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <Box display="flex" key={i} sx={{ height: "75px" }}>
                    {cells}
                </Box>
            );
        }
        return <Box>{rows}</Box>;
    };

    // Render the login dialog
    const renderLoginDialog = () => (
        <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
            <DialogTitle>Login Required</DialogTitle>
            <DialogContent>
                <Typography>You must be logged in to make an appointment.</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setLoginDialogOpen(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );
 
    return (
        <Box>
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingAppointment ? "Edit Appointment" : "Create Appointment"}</DialogTitle>
                <DialogContent>
                    
                    <Formik
                        enableReinitialize // Add this to reinitialize the form when `editingAppointment` changes
                        initialValues={
                            editingAppointment
                                ? {
                                    address: editingAppointment.address || "",
                                    zipcode: editingAppointment.zipcode || "",
                                    city: editingAppointment.city || "",
                                    timeSlot: editingAppointment.timeSlot || "",
                                    keywords: editingAppointment.keywords || [],
                                }
                                : initialValues
                        }
                        validationSchema={appointmentSchema}
                        onSubmit={handleCreateOrEditAppointment}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Address"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.address && Boolean(errors.address)}
                                    helperText={touched.address && errors.address}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Zipcode"
                                    name="zipcode"
                                    value={values.zipcode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.zipcode && Boolean(errors.zipcode)}
                                    helperText={touched.zipcode && errors.zipcode}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="City"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.city && Boolean(errors.city)}
                                    helperText={touched.city && errors.city}
                                    margin="normal"
                                />
                                <TimeSlotSelector 
                                    selectedDate={selectedDate}
                                    availability={availability}
                                    setFieldValue={setFieldValue}
                                    selectedTimeSlot={values.timeSlot}
                                />
                                <KeywordsSelector 
                                    keywords={values.keywords}
                                    setFieldValue={setFieldValue}
                                />
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                    {editingAppointment && (
                                        <Button color="error" onClick={handleDeleteAppointment}>
                                            Delete
                                        </Button>
                                    )}
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
            {renderLoginDialog()} {/* Include the login dialog */}
        </Box>
    );
};

export default Calendar;