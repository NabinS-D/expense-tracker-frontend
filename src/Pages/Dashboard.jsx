import { useEffect, useState } from "react";
import { getExpenses } from "../Api/ExpenseApi";
import { CategoryCharts } from "../Charts/CategoryCharts";
import { useLoading } from "../Context/LoadingContext";
import Loading from "../components/Loading";
import { Box, Typography } from "@mui/material";

export const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const { isLoading, setIsLoading } = useLoading();

  const getAllExpenses = async (categoryId = null) => {
    try {
      setIsLoading(true);
      const response = await getExpenses(categoryId);
      setExpenses(response.data || []); // Default to empty array if no data
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
      setExpenses([]); // Fallback to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const categoryTotals = expenses.reduce((acc, curr) => {
    const categoryName = curr.category?.name || "Unknown"; // Fallback for missing category
    const amount = parseFloat(curr.amount) || 0; // Fallback for invalid amount
    const year = new Date(curr.date).getFullYear() || "N/A"; // Fallback for invalid date
    const key = `${categoryName}_${year}`;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += amount;
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((key) => {
    const [categoryName, year] = key.split("_");
    return {
      x: categoryName,
      y: categoryTotals[key],
      year: year,
    };
  });

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: "1200px", mx: "auto" }}>
      {chartData.length > 0 ? (
        <CategoryCharts chartData={chartData} />
      ) : (
        <Typography
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          No expense data available.
        </Typography>
      )}
    </Box>
  );
};