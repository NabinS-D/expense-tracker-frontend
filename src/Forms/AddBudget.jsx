import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { editBudget, storeBudget } from "../Api/BudgetApi";
import { useEffect } from "react";

export const AddBudgetForm = ({ onClose, setMessage, refreshBudget, categories, editData = null }) => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() is zero-based
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        id: "",
        category: "",
        month: currentMonth.toString(), // Convert to string if needed
        year: currentYear.toString(), // Convert to string if needed
        amount: "",
    });

    useEffect(() => {
        editData && setFormData({
            id: editData.id,
            category: editData.category_id,
            month: editData.month,
            year: editData.year,
            amount: editData.amount
        })
    }, [editData])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing page
        try {
            const response = editData ? await editBudget(formData) : await storeBudget(formData);
            if (response.status === 201 || response.status === 200) {
                setMessage({
                    text: response.data.message,
                    severity: "success",
                });
                refreshBudget();
                onClose(); // Close the modal after submission
            }
        } catch (error) {
            setMessage({ text: error.message, severity: "error" });
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="category"
                    label="Category"
                    select
                    fullWidth
                    margin="dense"
                    value={formData.category}
                    onChange={handleInputChange}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={formData.amount}
                    onChange={handleInputChange}
                />
                <TextField
                    name="month"
                    label="Month"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={formData.month}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />

                {/* Year input with type="number" */}
                <TextField
                    name="year"
                    label="Year"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={formData.year}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" color="primary" type="submit" style={{ marginTop: "10px" }}>
                    {editData ? "Edit" : "Save"}
                </Button>
            </form>
        </>
    );
};
