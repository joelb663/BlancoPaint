import React, { useState, useEffect } from "react";
import { Button, Box, Typography, TextField } from "@mui/material";

const services = ["Interior", "Exterior", "Paint", "Stain", "Oil Base", "Water Base", "Doors", "Trim", "Baseboards", "Walls", "Ceilings", "Siding", "Stucco", "Fence", "Deck", "Other"];

const KeywordsSelector = ({ keywords, setFieldValue }) => {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [otherComment, setOtherComment] = useState("");

    // Initialize otherComment and showOtherInput with the existing "Other" keyword if present
    useEffect(() => {
        const existingOther = keywords.find(k => k.startsWith("Other: "));
        if (existingOther) {
            setOtherComment(existingOther.replace("Other: ", ""));
            setShowOtherInput(true);  // Ensure the input field is shown
        } else {
            setOtherComment("");
            setShowOtherInput(false);
        }
    }, [keywords]);

    const toggleKeyword = (service) => {
        if (service === "Other") {
            setShowOtherInput(true);
        } else {
            const newKeywords = keywords.includes(service)
                ? keywords.filter(k => k !== service)
                : [...keywords, service];
            setFieldValue("keywords", newKeywords);
        }
    };

    const handleOtherCommentChange = (e) => {
        setOtherComment(e.target.value);
    };

    const handleBlurOtherComment = () => {
        if (otherComment.trim() === "") {
            setFieldValue("keywords", keywords.filter(k => !k.startsWith("Other: ")));
        } else {
            setFieldValue("keywords", [...keywords.filter(k => !k.startsWith("Other: ")), "Other: " + otherComment]);
        }
    };

    // Determine if the "Other" button should be styled as active
    const isOtherActive = showOtherInput || otherComment.trim() !== "";

    return (
        <Box>
            <Typography variant="subtitle1">Job Description: (Select all that apply)</Typography>
            <Box display="flex" flexWrap="wrap">
                {services.map((service) => (
                    <Button
                        key={service}
                        onClick={() => toggleKeyword(service)}
                        variant={keywords.includes(service) || (service === "Other" && isOtherActive) ? "contained" : "outlined"}
                        color={service === "Other" && isOtherActive ? "primary" : "primary"}
                        sx={{ margin: "4px" }}
                    >
                        {service}
                    </Button>
                ))}
            </Box>
            {showOtherInput && (
                <TextField
                    label="Please specify"
                    value={otherComment}
                    onChange={handleOtherCommentChange}
                    onBlur={handleBlurOtherComment}
                    fullWidth
                    margin="dense"
                    sx={{ marginTop: "16px" }}
                />
            )}
        </Box>
    );
};

export default KeywordsSelector;