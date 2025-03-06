import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

export const ModalDialog = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex", // Use flexbox to center the modal
        alignItems: "center", // Vertically center
        justifyContent: "center", // Horizontally center
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 }, // Responsive padding
          background: "white",
          width: { xs: "90%", sm: 400, md: 500 }, // Responsive width
          maxWidth: "100%", // Prevent overflow
          borderRadius: 2, // Rounded corners
          boxShadow: {
            xs: "0 2px 4px rgba(0, 0, 0, 0.2)", // Lighter shadow on mobile
            sm: "0 4px 8px rgba(0, 0, 0, 0.3)", // Fuller shadow on larger screens
          },
          // No need for margin-top here since flexbox centers it
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontSize: { xs: "18px", sm: "20px", md: "24px" }, // Responsive title size
          }}
        >
          {title}
        </Typography>
        {children}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: { xs: 0.5, sm: 1 }, // Responsive gap
            flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              fontSize: { xs: "14px", sm: "16px" }, // Responsive button text
              py: { xs: 0.5, sm: 1 }, // Responsive padding
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};