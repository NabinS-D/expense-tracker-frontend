import { Box, Button, Typography } from "@mui/material";
import { deleteCategory } from "../Api/CategoryApi";
import { deleteExpense } from "../Api/ExpenseApi";
import { deleteBudget } from "../Api/BudgetApi";
import { useEffect, useState } from "react";

export const DeleteForm = ({ onClose, refetch, setMessage, deleteId, title }) => {
    const [deleteid, setDeleteid] = useState(null)
    useEffect(() => {
        setDeleteid(deleteId)
    }, [deleteId]);
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page
        try {
            let response;
            if (title === "Expense") {
                response = await deleteExpense(deleteid);
            } else if (title === "Category") {
                response = await deleteCategory(deleteid);
            } else if (title === "Budget") {
                response = await deleteBudget(deleteid);
            } else {
                throw new Error("Invalid title provided for deletion");
            }

            // If the response is successful
            if (response.status === 200) {
                setMessage({
                    text: response.data.message,
                    severity: "success",
                });

                refetch();

                onClose(); // Close the modal after submission
            }
        } catch (error) {
            setMessage({
                text: error.response?.data?.message || error.message,
                severity: "error",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",  // Center content horizontally
                    justifyContent: "center", // Center content vertically
                    textAlign: "center", // Center the text
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold' }}  // Apply bold styling here
                >
                    Are you sure you want to delete this {title}?
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"  // A color that stands out for a delete action
                    type="submit"
                    sx={{ marginTop: "20px", padding: "10px 20px", fontWeight: "bold" }}
                >
                    Delete
                </Button>
            </Box>
        </form>
    );
};
