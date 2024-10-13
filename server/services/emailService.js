import nodemailer from 'nodemailer';
import User from "../models/User.js";

// Function to send appointment notifications
export const sendAppointmentNotification = async (userId, appointmentDetails, action) => {
    try {
        const user = await User.findById(userId).select('email');
        if (!user) {
            throw new Error('User not found.');
        }
        const userEmail = user.email;

        // Destructure the appointment details
        const { date, timeSlot, address, city, zipcode } = appointmentDetails;

        // Customize email subject and body based on action
        let subject;
        let body;

        switch (action) {
            case 'create':
                subject = 'Appointment Confirmation';
                body = `
                    Dear customer,
                    
                    Your appointment has been successfully created.
                    
                    Appointment Details:
                    - Date: ${date}
                    - Time Slot: ${timeSlot}
                    - Address: ${address}, ${city}, ${zipcode}
                    
                    Thank you for scheduling an appointment with us.
                    
                    Best regards,
                    Blanco Paint
                `;
                break;

            case 'update':
                subject = 'Appointment Update';
                body = `
                    Dear customer,

                    Your appointment has been successfully updated.

                    Updated Appointment Details:
                    - Date: ${date}
                    - Time Slot: ${timeSlot}
                    - Address: ${address}, ${city}, ${zipcode}

                    Thank you for your attention to this matter.

                    Best regards,
                    Blanco Paint
                `;
                break;

            case 'delete':
                subject = 'Appointment Cancellation';
                body = `
                    Dear customer,

                    Your appointment has been canceled.

                    Original Appointment Details:
                    - Date: ${date}
                    - Time Slot: ${timeSlot}
                    - Address: ${address}, ${city}, ${zipcode}

                    If you have any questions or need to reschedule, please feel free to contact us or rebook on our website.

                    Best regards,
                    Blanco Paint
                `;
                break;

            default:
                throw new Error('Invalid action for email notification.');
        }

        // Send the email
        await sendAppointmentEmail(userEmail, subject, body);

    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email notification.');
    }
};

// Function to send email
export const sendAppointmentEmail = async (email, subject, body) => {
    try {
        // Configure the email transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // Change to 465 if using secure: true
            secure: false, // Set to true if using port 465
            auth: {
                user: process.env.EMAIL_USER, // Make sure this is set correctly
                pass: process.env.EMAIL_PASS, // Use your App Password here
            },
            logger: true, // Enable logging
            debug: true,  // Enable debug output
        });

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Send email to the user who made the appointment
            subject: subject,
            text: body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new Error('Failed to send confirmation email.');
    }
};