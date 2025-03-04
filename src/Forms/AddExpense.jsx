import React, { useEffect, useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { editExpense, storeExpense } from "../Api/ExpenseApi";

export const AddExpenseForm = ({
  onClose,
  setMessage,
  refreshExpenses,
  categories,
  editData = null,
  setisAddingExpense,
  isAddingExpense,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });

  useEffect(() => {
    editData &&
      setFormData({
        id: editData.id,
        category: editData.category_id,
        amount: editData.amount,
        description: editData.description,
        date: editData.date,
      });
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setisAddingExpense(true);
    try {
      const response = editData
        ? await editExpense(formData)
        : await storeExpense(formData);
      if (response.status === 201 || response.status === 200) {
        setMessage({
          text: response.data.message,
          severity: "success",
        });
        refreshExpenses();
        onClose(); // Close the modal after submission
      }
    } catch (error) {
      setMessage({ text: error.message, severity: "error" });
    } finally {
      setisAddingExpense(false);
    }
  };

  return (
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
        id="outlined-multiline-static"
        name="description"
        label="Description"
        type="text"
        fullWidth
        multiline
        rows={2}
        margin="dense"
        value={formData.description}
        onChange={handleInputChange}
      />

      <TextField
        name="date"
        label="Date"
        type="date"
        fullWidth
        margin="dense"
        value={formData.date}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isAddingExpense}
      >
        {editData ? "Edit" : "Save"}
      </Button>
    </form>
  );
};
