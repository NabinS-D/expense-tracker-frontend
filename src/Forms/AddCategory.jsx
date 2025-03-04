import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { editCategory, storeCategory } from "../Api/CategoryApi";

export const AddCategoryForm = ({
  onClose,
  setMessage,
  refreshCategories,
  editData = null,
  isAddingCategory,
  setisAddingCategory,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    editData &&
      setFormData({
        id: editData.id,
        name: editData.name,
      });
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    setisAddingCategory(true);
    try {
      const response = editData
        ? await editCategory(formData)
        : await storeCategory(formData);
      if (response.status === 201 || response.status === 200) {
        setMessage({
          text: response.data.message,
          severity: "success",
        });
        refreshCategories();
        onClose(); // Close the modal after submission
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || error.message,
        severity: "error",
      });
    } finally {
      setisAddingCategory(false); // Re-enable the button after operation completes
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Category"
          type="text"
          fullWidth
          margin="dense"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "10px" }}
          disabled={isAddingCategory}
        >
          {editData ? "Edit" : "Save"}
        </Button>
      </form>
    </>
  );
};
