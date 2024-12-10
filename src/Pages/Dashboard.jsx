import { useEffect, useState } from "react";
import { getExpenses } from "../Api/ExpenseApi";
import { CategoryCharts } from "../Charts/CategoryCharts";
import { useLoading } from "../Context/LoadingContext";
import Loading from "../components/Loading";

export const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const { isLoading, setIsLoading } = useLoading(); // Access loading state from context

    // Fetch expenses from API
    const getAllExpenses = async (categoryId = null) => {
        try {
            setIsLoading(true)
            const response = await getExpenses(categoryId);
            setExpenses(response.data); // Assuming response.data contains the array of expenses
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
        }
        finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    useEffect(() => {
        getAllExpenses();
    }, []);

    if (isLoading) {
        return <Loading />; // Show loading spinner if data is being fetched
    }
    // Calculate totals by category and year
    const categoryTotals = expenses.reduce((acc, curr) => {
        const categoryName = curr.category.name; // Use the category name as the key
        const amount = parseFloat(curr.amount);
        const year = new Date(curr.date).getFullYear(); // Extract the year from the date

        // Create a key for each category and year
        const key = `${categoryName}_${year}`;

        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += amount;
        return acc;
    }, {});

    // Prepare chart data
    const chartData = Object.keys(categoryTotals).map((key) => {
        const [categoryName, year] = key.split("_"); // Extract category name and year
        return {
            x: categoryName, // Category name as the label
            y: categoryTotals[key], // Total amount as the value
            year: year, // Add year to the data
        };
    });

    return (
        <>
            {/* Display Chart on Dashboard */}
            <CategoryCharts chartData={chartData} />
        </>
    );
};
