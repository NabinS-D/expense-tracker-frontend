
import { Box, Button } from "@mui/material";
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
    const { isLoading, setIsLoading } = useLoading(); // Access loading state from context
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [editData, setEditData] = useState({
        'id': '',
        'name': '',
    })
    const [message, setMessage] = useState({
        severity: "",
        text: "",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenEdit = (category) => {
        setEditData({
            'id': category.id,
            'name': category.name,
        })
        setOpenEdit(true);

    }
    const handleCloseEdit = () => {
        setEditData({ 'name': '' })
        setOpenEdit(false);
    }

    const handleOpenDelete = (category) => {
        setEditData({
            'id': category.id,
        })
        setOpenDelete(true);

    }
    const handleCloseDelete = () => {
        setEditData({ 'id': '' })
        setOpenDelete(false);
    }

    const clearMessage = () => {
        setMessage({
            severity: "",
            text: "",
        });
    };

    const getCategories = async () => {
        try {
            setIsLoading(true); // Hide loading spinner
            const response = await getCategory();
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            throw new Error(error.message);
        }
        finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
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
        return <Loading />; // Show loading spinner if data is being fetched
    }
    return (

        <TableContainer
            component={Paper}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "20px"
                }}
            >
                <h1 style={{ margin: 0 }}>Category Dashboard</h1>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Category
                </Button>

                <FlashMessage
                    severity={message.severity}
                    text={message.text}
                    clearMessage={clearMessage}
                />

                {/* Reusable Modal */}
                <ModalDialog open={open} onClose={handleClose} title="Add Category">
                    <AddCategoryForm onClose={handleClose} setMessage={setMessage} refreshCategories={getCategories} />
                </ModalDialog>

                <ModalDialog open={openEdit} onClose={handleCloseEdit} title="Edit Category">
                    <AddCategoryForm onClose={handleCloseEdit} setMessage={setMessage} refreshCategories={getCategories} editData={editData} />
                </ModalDialog>

                <ModalDialog open={openDelete} onClose={handleCloseDelete} title="">
                    <DeleteForm onClose={handleCloseDelete} setMessage={setMessage} refetch={getCategories} title="Category" deleteId={editData.id} />
                </ModalDialog>
            </Box>

            {categories.length === 0 ? (
                <p style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}>No Category found.</p>
            ) :

                (<Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center" >ID</StyledTableCell>
                            <StyledTableCell align="center">Category</StyledTableCell>
                            <StyledTableCell align="center">Created At</StyledTableCell>
                            <StyledTableCell align="center">Last Updated</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <StyledTableRow key={category.id}>
                                <StyledTableCell align="center">{category.id}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <Link
                                        to="/app/category-details"
                                        state={{ category }}
                                        style={{ textDecoration: "none", color: "inherit" }} // Inline style to remove underline
                                    >
                                        {category.name}
                                    </Link>
                                </StyledTableCell>

                                <StyledTableCell align="center">{category.created_at}</StyledTableCell>
                                <StyledTableCell align="center">{category.updated_at}</StyledTableCell>
                                <StyledTableCell align="center" >
                                    <Button variant="contained" color="primary" sx={{ marginRight: "10px" }} onClick={() => handleOpenEdit(category)}>Edit</Button>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenDelete(category)} >Delete</Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                )
            }
        </TableContainer>

    );
};
