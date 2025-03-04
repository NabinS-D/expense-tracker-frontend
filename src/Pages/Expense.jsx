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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: "center", // Center text horizontally
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // Hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const Expense = () => {
  const [expenses, setExpenses] = React.useState([]);
  const { isLoading, setIsLoading } = useLoading(); // Access loading state from context

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
    setEditData({
      id: expense.id,
    });
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setEditData({ id: "" });
    setOpenDelete(false);
  };

  const [message, setMessage] = React.useState({
    text: "",
    severity: "",
  });
  const [categories, setCategories] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clearMessage = () => {
    setMessage({
      severity: "",
      text: "",
    });
  };

  const getAllExpenses = async (categoryId = null) => {
    try {
      setIsLoading(true); // Hide loading spinner
      const response = await getExpenses(categoryId);
      setExpenses(response.data); // Assuming response.data contains the array of expenses
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  const getCategories = async () => {
    try {
      setIsLoading(true); // Hide loading spinner
      const response = await getCategory();
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  React.useEffect(() => {
    getAllExpenses();
    getCategories();
  }, []);

  const [selectedCategory, setSelectedCategory] = React.useState("");

  const handleFilter = (selectCategory) => {
    console.log(selectCategory);
    setSelectedCategory(selectCategory);
    getAllExpenses(selectCategory); // Fetch filtered expenses
  };

  // Calculate remaining budget dynamically
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
    return <Loading />; // Show loading spinner if data is being fetched
  }
  return (
    <TableContainer component={Paper}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <h1 style={{ margin: 0, fontFamily: "'Rowdies', sans-serif" }}>
          Expense Dashboard
        </h1>
        <Box sx={{ minWidth: 120 }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              label="Category"
              onChange={(e) => handleFilter(e.target.value)} // Pass selected value
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Expense
        </Button>
        <FlashMessage
          severity={message.severity}
          text={message.text}
          clearMessage={clearMessage}
        />

        {/* Reusable Modal */}
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

        <ModalDialog
          open={openEdit}
          onClose={handleCloseEdit}
          title="Edit Expense"
        >
          <AddExpenseForm
            onClose={handleCloseEdit}
            setMessage={setMessage}
            refreshExpenses={getAllExpenses}
            categories={categories}
            editData={editData}
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
      </Box>
      {expenses.length === 0 ? (
        <p style={{ textAlign: "center", margin: "20px 0" }}>
          No expenses found.
        </p>
      ) : (
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Description</StyledTableCell>
              <StyledTableCell align="center">Amount</StyledTableCell>
              <StyledTableCell align="center">Created Date</StyledTableCell>
              <StyledTableCell align="center">Budget Allocated</StyledTableCell>
              <StyledTableCell align="center">Remaining Budget</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{expense.category.name}</StyledTableCell>
                <StyledTableCell>{expense.description}</StyledTableCell>
                <StyledTableCell>{expense.amount}</StyledTableCell>
                <StyledTableCell>{expense.created_at}</StyledTableCell>
                <StyledTableCell>
                  {expense.category?.budget?.amount}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    margin: 0,
                    color:
                      calculateRemainingBudget(expense.category) < 0
                        ? "red"
                        : "inherit",
                  }}
                >
                  {calculateRemainingBudget(expense.category)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: "10px" }}
                    onClick={() => handleOpenEdit(expense)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDelete(expense)}
                  >
                    Delete
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};
