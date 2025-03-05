import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getExpenses } from "../Api/ExpenseApi";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { FlashMessage } from "../components/FlashMessage";
import { ModalDialog } from "../components/ModalDialog";
import { AddExpenseForm } from "../Forms/AddExpense";
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

export const Expense = () => {
  const [expenses, setExpenses] = React.useState([]);
  const { isLoading, setIsLoading } = useLoading();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editData, setEditData] = React.useState({
    id: "",
    category_id: "",
    amount: "",
    description: "",
    date: "",
  });
  const [isAddingExpense, setisAddingExpense] = React.useState(false);
  const [message, setMessage] = React.useState({ text: "", severity: "" });
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = (expense) => {
    setEditData({
      id: expense.id,
      category_id: expense.category_id,
      amount: expense.amount,
      description: expense.description,
      date: expense.date,
    });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setEditData({});
    setOpenEdit(false);
  };

  const handleOpenDelete = (expense) => {
    setEditData({ id: expense.id });
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setEditData({ id: "" });
    setOpenDelete(false);
  };

  const clearMessage = () => {
    setMessage({ severity: "", text: "" });
  };

  const getAllExpenses = async (categoryId = null) => {
    try {
      setIsLoading(true);
      const response = await getExpenses(categoryId);
      setExpenses(response.data);
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getCategory();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getAllExpenses();
    getCategories();
  }, []);

  const handleFilter = (selectCategory) => {
    setSelectedCategory(selectCategory);
    getAllExpenses(selectCategory);
  };

  const calculateRemainingBudget = (category) => {
    const categoryExpenses = expenses.filter(
      (expense) => expense.category.id === category.id
    );
    const totalExpense = categoryExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    return (category?.budget?.amount - totalExpense).toFixed(2);
  };

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
          gap: { xs: 1, sm: 2 },
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
          Expense Dashboard
        </Typography>
        <FormControl
          variant="standard"
          sx={{ minWidth: { xs: 100, sm: 120 }, m: 1 }}
        >
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={selectedCategory}
            label="Category"
            onChange={(e) => handleFilter(e.target.value)}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          size="small"
          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          Add Expense
        </Button>
      </Box>

      <FlashMessage
        severity={message.severity}
        text={message.text}
        clearMessage={clearMessage}
      />

      <ModalDialog open={open} onClose={handleClose} title="Add Expense">
        <AddExpenseForm
          onClose={handleClose}
          setMessage={setMessage}
          refreshExpenses={getAllExpenses}
          categories={categories}
          setisAddingExpense={setisAddingExpense}
          isAddingExpense={isAddingExpense}
        />
      </ModalDialog>

      <ModalDialog open={openEdit} onClose={handleCloseEdit} title="Edit Expense">
        <AddExpenseForm
          onClose={handleCloseEdit}
          setMessage={setMessage}
          refreshExpenses={getAllExpenses}
          categories={categories}
          editData={editData}
          setisAddingExpense={setisAddingExpense}
          isAddingExpense={isAddingExpense}
        />
      </ModalDialog>

      <ModalDialog open={openDelete} onClose={handleCloseDelete} title="">
        <DeleteForm
          onClose={handleCloseDelete}
          setMessage={setMessage}
          refetch={getAllExpenses}
          deleteId={editData.id}
          title="Expense"
        />
      </ModalDialog>

      {expenses.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No expenses found.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: { xs: "auto", sm: 700 } }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Description
                </StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Created Date
                </StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Budget Allocated
                </StyledTableCell>
                <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Remaining Budget
                </StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{expense.category.name}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {expense.description}
                  </StyledTableCell>
                  <StyledTableCell>{expense.amount}</StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {expense.created_at}
                  </StyledTableCell>
                  <StyledTableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    {expense.category?.budget?.amount}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                      color: calculateRemainingBudget(expense.category) < 0 ? "red" : "inherit",
                    }}
                  >
                    {calculateRemainingBudget(expense.category)}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEdit(expense)}
                      sx={{ mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 }, fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDelete(expense)}
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