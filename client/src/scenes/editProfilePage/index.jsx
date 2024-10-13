import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    const {
        name,
        phone,
        email,
        createdAt
    } = user;

    const profileSchema = yup.object().shape({
        name: yup.string().required("required"),
        phone: yup.string().required("required"),
        email: yup.string().required("required"),
    });

    const initialValuesProfile = {
        name,
        phone,
        email,
    };

    const updateUserProfile = async (values, onSubmitProps) => {
        const data = {
            name: values.name,
            phone: values.phone,
            email: values.email,
        };

        const savedUserResponse = await fetch(`http://localhost:3001/users/${userId}/updateUser`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            navigate("/");
        }
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        await updateUserProfile(values, onSubmitProps);
    };

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesProfile}
            validationSchema={profileSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <Box>
                    <Navbar />
                    <Box
                        width="100%"
                        padding="2rem 6%"
                        display="block"
                        gap="0.5rem"
                        justifyContent="space-between"
                    >
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    "& > div": { gridColumn: "span 4" },
                                }}
                            >
                                <TextField
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={Boolean(touched.name) && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <TextField
                                    label="Phone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phone}
                                    name="phone"
                                    error={Boolean(touched.phone) && Boolean(errors.phone)}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: "span 4" }}
                                    placeholder="(123)456-7890"
                                />

                                <TextField
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={Boolean(touched.email) && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: "span 4" }}
                                />

                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography
                                        variant="h4"
                                        fontWeight="500"
                                    >
                                        Joined {createdAt.substring(0, 10)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "2rem 0",
                                    p: "1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                Update Info
                            </Button>
                        </form>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};

export default EditProfilePage;