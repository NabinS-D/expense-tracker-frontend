import React from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

export const ModalDialog = ({ open, onClose, title, children }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 3, background: "white", maxWidth: 500, margin: "auto", mt: "10%" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                {children}
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={onClose} variant="outlined">Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};
