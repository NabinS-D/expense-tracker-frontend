import React, { useState, useEffect, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    return true;
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(userDetails);

      if (isMountedRef.current) {
        if (response.status === 200) {
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
      if (isMountedRef.current) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.";

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
            fullWidth
            className=" !bg-green-500 !text-white font-bold"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="flex justify-center mt-2">
          <a
            href="/register"
            className="text-blue-500 hover:focus-visible: font-bold"
          >
            Don't have an account?{" "}
            <span className="text-fuchsia-500">Sign Up</span>
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
