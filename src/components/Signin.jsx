import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { login } from "../Api/UserApi";
import { FlashMessage } from "./FlashMessage";
import { useNavigate } from "react-router-dom";
import { useAuth, setIsAuthenticated } from "../Hooks/useAuth";

export const Signin = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({
    text: "",
    severity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const clearMessage = () => {
    setMessage({
      severity: "",
      text: "",
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setMessage({
        text: "Please enter a valid email address",
        severity: "error",
      });
      return false;
    }
    if (userDetails.password.length < 6) {
      setMessage({
        text: "Password must be at least 6 characters",
        severity: "error",
      });
      return false;
    }
    return true;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    let isMounted = true; // For tracking component mount state

    try {
      const response = await login(userDetails);

      if (isMounted) {
        if (response.status === 200) {
          // Use sessionStorage for better security or consider HTTP-only cookies
          localStorage.setItem("authToken", response.data.token);

          setMessage({
            text: response.data.message || "Login successful!",
            severity: "success",
          });

          setIsAuthenticated(true);
          navigate("/app/dashboard");
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error("Error logging in:", error);

        // Extract more meaningful error message from API response if available
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.";

        setMessage({
          text: errorMessage,
          severity: "error",
        });
        // No need to navigate on error - already on login page
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }

    return () => {
      isMounted = false;
    };
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
          fontSize: "60px",
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
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)", // 3D shadow effect
          transform: "translateY(-2px)", // Lifting effect
          transition: "all 0.3s ease-in-out", // Smooth transition
          "&:hover": {
            transform: "translateY(-4px)", // Enhanced lifting effect on hover
            boxShadow:
              "0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)", // Stronger shadow on hover
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
