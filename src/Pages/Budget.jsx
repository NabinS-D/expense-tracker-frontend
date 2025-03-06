import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Typography } from "@mui/material";
import { FlashMessage } from "../components/FlashMessage";
import { ModalDialog } from "../components/ModalDialog";
import { getBudget } from "../Api/BudgetApi";
import { AddBudgetForm } from "../Forms/AddBudget";
import { getCategory } from "../Api/CategoryApi";
import { DeleteForm } from "../Forms/DeleteForm";
import { useLoading } from "../Context/LoadingContext";
import Loading from "../components/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: { xs: "0.75rem", sm: "0.9rem" }, // Smaller on mobile
    padding: { xs: "8px", sm: "16px" }, // Reduced padding on mobile
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: { xs: "0.7rem", sm: "0.875rem" }, // Adjust text size
    padding: { xs: "6px", sm: "16px" }, // Reduced padding
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

const initialEditData = {
  id: "",
  category_id: "",
  amount: "",
  month: "",
  year: "",
};

export const Budget = () => {
  const [budget, setBudget] = React.useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editData, setEditData] = React.useState(initialEditData);
  const [message, setMessage] = React.useState({ text: "", severity: "" });
  const [categories, setCategories] = React.useState([]);

  const getBudgets = React.useCallback(async () => {
    let isMounted = true;
    try {
      setIsLoading(true);
      const response = await getBudget();
      if (response.status === 200 && isMounted) {
        setBudget(response.data);
      }
    } catch (error) {
      if (isMounted) {
        setMessage({
          severity: "error",
          text: `Error fetching budgets: ${error.message || "Unknown error"}`,
        });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [setIsLoading]);

  const getCategories = React.useCallback(async () => {
    let isMounted = true;
    try {
      setIsLoading(true);
      const response = await getCategory();
      if (response.status === 200 && isMounted) {
        setCategories(response.data);
      }
    } catch (error) {
      if (isMounted) {
        setMessage({
          severity: "error",
          text: `Error fetching categories: ${error.message || "Unknown error"}`,
        });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [setIsLoading]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = (budget) => {
    setEditData({
      id: budget.id,
      category_id: budget.category_id,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setEditData(initialEditData);
    setOpenEdit(false);
  };

  const handleOpenDelete = (budget) => {
    setEditData({ id: budget.id });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setEditData(initialEditData);
    setOpenDelete(false);
  };

  const clearMessage = () => {
    setMessage({ severity: "", text: "" });
  };

  React.useEffect(() => {
    const budgetCleanup = getBudgets();
    const categoriesCleanup = getCategories();
    return () => {
      budgetCleanup && typeof budgetCleanup === "function" && budgetCleanup();
      categoriesCleanup && typeof categoriesCleanup === "function" && categoriesCleanup();
      clearMessage();
    };
  }, [getBudgets, getCategories]);

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
          Budget Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          size="small"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Add Budget
        </Button>
      </Box>

      <FlashMessage
        severity={message.severity}
        text={message.text}
        clearMessage={clearMessage}
      />

      <ModalDialog open={open} onClose={handleClose} title="Add Budget">
        <AddBudgetForm
          onClose={handleClose}
          setMessage={setMessage}
          refreshBudget={getBudgets}
          categories={categories}
        />
      </ModalDialog>

      <ModalDialog open={openEdit} onClose={handleCloseEdit} title="Edit Budget">
        <AddBudgetForm
          onClose={handleCloseEdit}
          setMessage={setMessage}
          refreshBudget={getBudgets}
          categories={categories}
          editData={editData}
        />
      </ModalDialog>

      <ModalDialog open={openDelete} onClose={handleCloseDelete} title="Delete Budget">
        <DeleteForm
          onClose={handleCloseDelete}
          setMessage={setMessage}
          refetch={getBudgets}
          title="Budget"
          deleteId={editData.id}
        />
      </ModalDialog>

      {budget.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No Budget found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: "auto", sm: 700 } }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Budget</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Month
                </StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Year
                </StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budget.map((b,index) => (
                <StyledTableRow key={b.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{b.category.name}</StyledTableCell>
                  <StyledTableCell>{b.amount}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {b.month}
                  </StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {b.year}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEdit(b)}
                      sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 }, fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDelete(b)}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                    >
                      Delete
                    </Button>
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