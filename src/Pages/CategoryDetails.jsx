import {
  Box,
  Paper,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const CategoryDetails = () => {
  const location = useLocation();
  const category = location.state?.category;

  const { totalExpense, remainingBudget } = useMemo(() => {
    const totalExpense =
      category?.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
    const remainingBudget = (category?.budget?.amount || 0) - totalExpense;
    return { totalExpense, remainingBudget };
  }, [category?.expenses, category?.budget?.amount]);

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: "1200px",
        mx: "auto",
        backgroundColor: "white",
        borderRadius: "5px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 2 },
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, m: 0 }}
        >
          {category?.name}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, m: 0 }}
        >
          Budget: Rs {category?.budget?.amount || 0}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, m: 0 }}
        >
          Total Expenses: Rs {totalExpense.toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", sm: "1.25rem" },
            m: 0,
            color: remainingBudget < 0 ? "red" : "inherit",
          }}
        >
          Remaining Budget: Rs {remainingBudget.toFixed(2)}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}>
        Created at: {category?.created_at}
      </Typography>

      {!category?.expenses || category.expenses.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            fontFamily: "'Rowdies', sans-serif",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No expenses found for this category.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {category?.expenses?.map((expense, index) => (
            <Paper key={index} sx={{ p: 2 }}>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Description: {expense.description || "N/A"}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Created At: {expense.created_at}
              </Typography>
              <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Amount: Rs {parseFloat(expense.amount).toFixed(2)}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};