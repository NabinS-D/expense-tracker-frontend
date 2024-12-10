import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { login } from "../Api/UserApi";
import { FlashMessage } from "./FlashMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

export const Signin = () => {
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState({
        text: "",
        severity: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false); // State for handling submission process

    const { setIsAuthenticated } = useAuth(); // Use the authentication hook
    const navigate = useNavigate();

    const clearMessage = () => {
        setMessage({
            severity: "",
            text: "",
        });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await login(userDetails);
            // console.log("API Response:", response.data);
            if (response.status === 200) {
                localStorage.setItem("authToken", response.data.token);
                setMessage({
                    text: response.data.message,
                    severity: "success",
                });

                // Set authenticated state only if it's not already true

                setIsAuthenticated(true);

                navigate('/app/dashboard'); // Navigate without delay
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            setMessage({
                text: error.message,
                severity: "error",
            });
            navigate('/'); // Redirect to login page on error
        } finally {
            setIsSubmitting(false);
        }
    };

    function handleInput(e) {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value,
        });
    }



    return (
        <>
            <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                    fontFamily: "'Honk', sans-serif", // Apply custom font here
                }}
            >
                Expense Tracker
            </Typography>
            <Box
                sx={{
                    width: 400,
                    margin: "50px auto",
                    padding: 3,
                    borderRadius: 2,
                    backgroundColor: "skyblue",
                    // 3D effect for border and box shadow
                    border: "0px solid #3f51b5", // Blue border for contrast
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)", // 3D shadow effect
                    transform: "translateY(-2px)", // Lifting effect
                    transition: "all 0.3s ease-in-out", // Smooth transition
                    "&:hover": {
                        transform: "translateY(-4px)", // Enhanced lifting effect on hover
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)", // Stronger shadow on hover
                    },
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleForm}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        margin="normal"
                        fullWidth
                        required
                        onChange={handleInput}
                    />

                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        margin="normal"
                        fullWidth
                        required
                        onChange={handleInput}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={isSubmitting} // Disable button while submitting
                    >
                        {isSubmitting ? "Logging in..." : "Login"} {/* Show loading text */}
                    </Button>
                </form>
                <FlashMessage
                    severity={message.severity}
                    text={message.text}
                    clearMessage={clearMessage}
                />
            </Box>
        </>
    );

};
