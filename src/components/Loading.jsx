// components/Loading.js
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Loading = () => {
  // Animation variants for the "building blocks"
  const blockVariants = {
    animate: {
      y: [0, -15, 0], // Smaller bounce for content area
      opacity: [0.4, 1, 0.4],
      transition: {
        repeat: Infinity,
        duration: 1.2,
        ease: "easeInOut",
        staggerChildren: 0.15,
      },
    },
  };

  const dotVariants = {
    animate: {
      opacity: [0, 1, 0],
      transition: {
        repeat: Infinity,
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      sx={{
        position: "absolute", // Relative to the main content Box
        top: 0,
        left: 0,
        width: "100%", // Fill the main content width
        height: "100%", // Fill the main content height
        backgroundColor: "rgba(245, 247, 250, 0.9)", // Light backdrop matching your main content
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10, // Above content but below drawer/app bar
      }}
    >
      {/* Animated "building blocks" */}
      <motion.div
        variants={blockVariants}
        animate="animate"
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "90%",
        }}
      >
        <motion.div
          variants={blockVariants}
          style={{
            width: "100px",
            height: "60px",
            backgroundColor: "#42a5f5",
            borderRadius: "6px",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
        <motion.div
          variants={blockVariants}
          style={{
            width: "70px",
            height: "120px",
            backgroundColor: "#1976d2",
            borderRadius: "6px",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
        <motion.div
          variants={blockVariants}
          style={{
            width: "150px",
            height: "50px",
            backgroundColor: "#90caf9",
            borderRadius: "6px",
            boxShadow: "0 3px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      </motion.div>

      {/* Loading text with animated dots */}
      <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: "6px" }}>
        <Typography
          variant="h5"
          sx={{
            color: "#1976d2", // Match your primary theme
            fontWeight: "bold",
            fontFamily: "'Courier New', monospace",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Building Content
        </Typography>
        <motion.span variants={dotVariants} animate="animate">
          <Typography variant="h5" sx={{ color: "#1976d2" }}>
            .
          </Typography>
        </motion.span>
        <motion.span
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.15 }}
        >
          <Typography variant="h5" sx={{ color: "#1976d2" }}>
            .
          </Typography>
        </motion.span>
        <motion.span
          variants={dotVariants}
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <Typography variant="h5" sx={{ color: "#1976d2" }}>
            .
          </Typography>
        </motion.span>
      </Box>
    </Box>
  );
};

export default Loading;
