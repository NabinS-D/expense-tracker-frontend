/* eslint-disable no-unused-vars */
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ModalDialog } from "../components/ModalDialog";
import { AddCategoryForm } from "../Forms/AddCategory";
import { FlashMessage } from "../components/FlashMessage";
import { getCategory } from "../Api/CategoryApi";
import { DeleteForm } from "../Forms/DeleteForm";
import { Link } from "react-router-dom";
import { useLoading } from "../Context/LoadingContext";
import Loading from "../components/Loading";

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isAddingOrEditingCategory, setIsAddingOrEditingCategory] = useState(false);
  const [editData, setEditData] = useState({ id: "", name: "" });
  const [message, setMessage] = useState({ severity: "", text: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = (category) => {
    setEditData({ id: category.id, name: category.name });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setEditData({ id: "", name: "" });
    setOpenEdit(false);
  };

  const handleOpenDelete = (category) => {
    setEditData({ id: category.id });
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setEditData({ id: "" });
    setOpenDelete(false);
  };

  const clearMessage = () => {
    setMessage({ severity: "", text: "" });
  };

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategory();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      fontSize: { xs: "0.75rem", sm: "0.9rem" },
      padding: { xs: "8px", sm: "16px" },
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: { xs: "0.7rem", sm: "0.875rem" },
      padding: { xs: "6px", sm: "16px" },
      textAlign: "center",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "1200px", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontFamily: "'Rowdies', sans-serif",
            fontSize: { xs: "1.5rem", sm: "2rem" },
            m: 0,
          }}
        >
          Category Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          size="small"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Add Category
        </Button>
      </Box>

      <FlashMessage
        severity={message.severity}
        text={message.text}
        clearMessage={clearMessage}
      />

      <ModalDialog open={open} onClose={handleClose} title="Add Category">
        <AddCategoryForm
          onClose={handleClose}
          setMessage={setMessage}
          refreshCategories={getCategories}
          isAddingOrEditingCategory={isAddingOrEditingCategory}
          setIsAddingOrEditingCategory={setIsAddingOrEditingCategory}
        />
      </ModalDialog>

      <ModalDialog open={openEdit} onClose={handleCloseEdit} title="Edit Category">
        <AddCategoryForm
          onClose={handleCloseEdit}
          setMessage={setMessage}
          refreshCategories={getCategories}
          editData={editData}
          isAddingOrEditingCategory={isAddingOrEditingCategory}
          setIsAddingOrEditingCategory={setIsAddingOrEditingCategory}
        />
      </ModalDialog>

      <ModalDialog open={openDelete} onClose={handleCloseDelete} title="">
        <DeleteForm
          onClose={handleCloseDelete}
          setMessage={setMessage}
          refetch={getCategories}
          title="Category"
          deleteId={editData.id}
        />
      </ModalDialog>

      {categories.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No Category found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: "auto", sm: 700 } }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Created At
                </StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Last Updated
                </StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category,index) => (
                <StyledTableRow key={category.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    <Link
                      to="/app/category-details"
                      state={{ category }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {category.name}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {category.created_at}
                  </StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {category.updated_at}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 1 }, // Consistent gap for spacing
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEdit(category)}
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDelete(category)}
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};