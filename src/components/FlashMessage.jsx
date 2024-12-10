import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";

export const FlashMessage = ({ severity, text, clearMessage }) => {
    const [alert, setAlert] = useState({
        show: false,
        severity: "",
        message: "",
    });

    useEffect(() => {
        if (text) {
            // Show the alert with new message
            setAlert({
                show: true,
                severity: severity,
                message: text,
            });

            // Set timeout to hide the alert after 1 second
            const timer = setTimeout(() => {
                setAlert({
                    show: false,
                    message: "",
                    severity: "",
                });
                clearMessage();  // Call the function passed from parent to clear the message
            }, 3000);

            // Cleanup the timer when the component is unmounted or text changes
            return () => clearTimeout(timer);
        }
    }, [text, severity, clearMessage]); // This effect runs whenever 'text' or 'severity' changes

    return (
        <>
            {alert.show && (
                <Alert
                    key={alert.message}
                    variant="filled"
                    severity={alert.severity}
                    sx={{
                        position: "fixed",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1300,
                        width: "fit-content",
                        boxShadow: 3,
                    }}
                >
                    {alert.message}
                </Alert>
            )}
        </>
    );
};
