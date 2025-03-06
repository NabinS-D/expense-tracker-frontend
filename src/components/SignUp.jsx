import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { storeUser } from "../Api/UserApi";
import { FlashMessage } from "./FlashMessage";
import { useAuth } from "../Hooks/useAuth";

export const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({
    text: "",
    severity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
    if (!userDetails.name) {
      setMessage({
        text: "Username cannot be empty.",
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

    try {
      const response = await storeUser(userDetails);

      if (isMountedRef.current) {
        if (response.status === 201) {
          setMessage({
            text: response.data.message || "Signup successful!",
            severity: "success",
          });

          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Sign up failed. Please try again.";

        setMessage({
          text: errorMessage,
          severity: "error",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  return (
    <>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "'Honk', sans-serif",
          fontSize: { xs: "40px", sm: "50px", md: "60px" }, // Responsive font size
          mt: { xs: 2, sm: 3 }, // Adjust margin-top for smaller screens
        }}
      >
        Expense Tracker
      </Typography>
      <Box
        sx={{
          width: { xs: "90%", sm: 400, md: 450 }, // Responsive width
          maxWidth: "100%", // Prevent overflow
          margin: "0 auto", // Center horizontally
          padding: { xs: 2, sm: 3 }, // Responsive padding
          borderRadius: 2,
          backgroundColor: "skyblue",
          border: "0px solid #3f51b5",
          boxShadow: {
            xs: "0 2px 4px rgba(0, 0, 0, 0.2)", // Lighter shadow on mobile
            sm: "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)", // Full shadow on larger screens
          },
          transform: "translateY(-2px)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: { sm: "translateY(-4px)" }, // Hover effect only on larger screens
            boxShadow: {
              sm: "0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)",
            },
          },
          mt: { xs: 2, sm: 5 }, // Responsive top margin
        }}
      >
        <Typography
          sx={{
            fontFamily: "Rowdies, cursive",
            fontSize: { xs: "24px", sm: "28px", md: "32px" }, // Responsive font size
          }}
          variant="h4"
          align="center"
          gutterBottom
        >
          Signup
        </Typography>
        <form onSubmit={handleForm}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            name="name"
            type="name"
            margin="normal"
            fullWidth
            required
            onChange={handleInput}
            value={userDetails.name}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" }, // Responsive input text size
              },
            }}
          />
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
            value={userDetails.email}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" }, // Responsive input text size
              },
            }}
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
            value={userDetails.password}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "14px", sm: "16px" }, // Responsive input text size
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="!bg-green-500 !text-white font-bold"
            fullWidth
            sx={{
              mt: 2,
              py: { xs: 1, sm: 1.5 }, // Responsive padding
              fontSize: { xs: "14px", sm: "16px" }, // Responsive button text size
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </Button>
        </form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
            textAlign: { xs: "center", sm: "left" }, // Center text on mobile
          }}
        >
          <a
            href="/login"
            className="text-blue-500 hover:focus-visible: font-bold"
            style={{ fontSize: "clamp(12px, 4vw, 16px)" }} // Responsive font size with clamp
          >
            Signed up? <span className="text-fuchsia-500">Go to login</span>
          </a>
        </Box>

        <FlashMessage
          severity={message.severity}
          text={message.text}
          clearMessage={clearMessage}
        />
      </Box>
    </>
  );
};
