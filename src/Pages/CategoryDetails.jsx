import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const CategoryDetails = () => {
  const location = useLocation();
  const category = location.state?.category; // Access the passed category object
  // Calculate total expenses
  const { totalExpense, remainingBudget } = useMemo(() => {
    const totalExpense =
      category?.expenses?.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      ) || 0;

    const remainingBudget = category?.budget?.amount - totalExpense;

    return { totalExpense, remainingBudget }; // Return both values as an object
  }, [category?.expenses, category?.budget?.amount]);

  return (
    <Box
      sx={{
        margin: "20px",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "5px",
      }}
    >
      {/* Inline header with space between */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>{category?.name}</h2>
        <h3 style={{ margin: 0 }}>Budget : Rs {category?.budget?.amount}</h3>
        <h3 style={{ margin: 0 }}>
          Total Expenses : Rs {totalExpense.toFixed(2)}
        </h3>
        <h3
          style={{
            margin: 0,
            color: remainingBudget < 0 ? "red" : "inherit",
          }}
        >
          Remaining Budget : Rs {remainingBudget}
        </h3>
      </Box>
      <div>Created at: {category?.created_at}</div>
      <br />

      {/* Display expenses in a table */}
      {!category?.expenses || category.expenses.length === 0 ? (
        <p
          style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}
        >
          No expenses found for this category.
        </p>
      ) : (
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "black",
                "& th": { color: "white" },
              }}
            >
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Created At</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Amount</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category?.expenses?.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.description || "N/A"}</TableCell>
                <TableCell align="center">{expense.created_at}</TableCell>
                <TableCell align="center">
                  Rs {parseFloat(expense.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
