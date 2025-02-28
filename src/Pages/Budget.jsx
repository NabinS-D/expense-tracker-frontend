import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button } from "@mui/material";
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

const initialEditData = {
  id: "",
  category_id: "",
  amount: "",
  month: "",
  year: "",
};

export const Budget = () => {
  const [budget, setBudget] = React.useState([]);
  const { isLoading, setIsLoading } = useLoading(); // Access loading state from context
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState({
    text: "",
    severity: "",
  });

  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [editData, setEditData] = React.useState(initialEditData);

  const [categories, setCategories] = React.useState([]);

  // Use useCallback to prevent recreating functions on each render
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
          text: `Error fetching categories: ${
            error.message || "Unknown error"
          }`,
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
    setEditData({
      id: budget.id,
    });
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setEditData(initialEditData);
    setOpenDelete(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const clearMessage = () => {
    setMessage({
      severity: "",
      text: "",
    });
  };

  React.useEffect(() => {
    const budgetCleanup = getBudgets();
    const categoriesCleanup = getCategories();

    // Cleanup function to handle component unmounting
    return () => {
      budgetCleanup && typeof budgetCleanup === "function" && budgetCleanup();
      categoriesCleanup &&
        typeof categoriesCleanup === "function" &&
        categoriesCleanup();
      clearMessage(); // Clear any lingering messages on unmount
    };
  }, []); // Empty dependency array means this effect runs once on mount

  if (isLoading) {
    return <Loading />;
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
        <h1 style={{ margin: 0 }}>Budget Dashboard</h1>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Budget
        </Button>
        <FlashMessage
          severity={message.severity}
          text={message.text}
          clearMessage={clearMessage}
        />

        {/* Reusable Modal */}
        <ModalDialog open={open} onClose={handleClose} title="Add Budget">
          <AddBudgetForm
            onClose={handleClose}
            setMessage={setMessage}
            refreshBudget={getBudgets}
            categories={categories}
          />
        </ModalDialog>

        <ModalDialog
          open={openEdit}
          onClose={handleCloseEdit}
          title="Edit Budget"
        >
          <AddBudgetForm
            onClose={handleCloseEdit}
            setMessage={setMessage}
            refreshBudget={getBudgets}
            categories={categories}
            editData={editData}
          />
        </ModalDialog>

        <ModalDialog
          open={openDelete}
          onClose={handleCloseDelete}
          title="Delete Budget"
        >
          <DeleteForm
            onClose={handleCloseDelete}
            setMessage={setMessage}
            refetch={getBudgets}
            title="Budget"
            deleteId={editData.id}
          />
        </ModalDialog>
      </Box>
      {budget.length === 0 ? (
        <p
          style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}
        >
          No Budget found.
        </p>
      ) : (
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell align="center">Category</StyledTableCell>
              <StyledTableCell align="center">Budget</StyledTableCell>
              <StyledTableCell align="center">Month</StyledTableCell>
              <StyledTableCell align="center">Year</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budget.map((b) => (
              <StyledTableRow key={b.id}>
                <StyledTableCell>{b.id}</StyledTableCell>
                <StyledTableCell>{b.category.name}</StyledTableCell>
                <StyledTableCell>{b.amount}</StyledTableCell>
                <StyledTableCell>{b.month}</StyledTableCell>
                <StyledTableCell>{b.year}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: "10px" }}
                    onClick={() => handleOpenEdit(b)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDelete(b)}
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
