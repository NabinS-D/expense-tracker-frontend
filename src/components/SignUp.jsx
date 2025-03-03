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
          border: "0px solid #3f51b5",
          boxShadow:
            "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 12px rgba(0, 0, 0, 0.15)",
          transform: "translateY(-2px)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Typography
          sx={{ fontFamily: "Rowdies, cursive" }}
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
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className=" !bg-green-500 !text-white font-bold"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Signup"}
          </Button>
        </form>
        <div className="flex justify-center mt-2">
          <a
            href="/login"
            className="text-blue-500 hover:focus-visible: font-bold"
          >
            Signed up? <span className="text-fuchsia-500">Go to login</span>
          </a>
        </div>

        <FlashMessage
          severity={message.severity}
          text={message.text}
          clearMessage={clearMessage}
        />
      </Box>
    </>
  );
};
