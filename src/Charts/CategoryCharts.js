import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  {
    id: "background",
    beforeDraw: (chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  }
);

export const CategoryCharts = ({ chartData }) => {
  const pieData = {
    labels: chartData.map((datum) => datum.x),
    datasets: [
      {
        data: chartData.map((datum) => datum.y),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      background: true,
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
      legend: {
        position: "right", // Static position; responsiveness handled by container
        labels: {
          font: { size: 14, weight: "bold" }, // Static size, adjusted by container
          color: "black",
        },
      },
    },
  };

  const barData = {
    labels: chartData.map((datum) => datum.x),
    datasets: [
      {
        label: "Expenses by Category",
        data: chartData.map((datum) => datum.y),
        borderColor: "black",
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      background: true,
      legend: {
        display: true,
        position: "top",
        labels: { font: { size: 14, weight: "bold" }, color: "black" },
      },
      tooltip: {
        callbacks: { label: (context) => `Amount: ${context.raw}` },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Categories",
          font: { weight: "bold", size: 14, family: "Arial", color: "black" },
        },
        ticks: { font: { weight: "bold", size: 12, color: "black" } },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
          font: { weight: "bold", size: 14, family: "Arial", color: "black" },
        },
        ticks: { font: { weight: "bold", size: 12, color: "black" } },
        beginAtZero: true,
      },
    },
  };

  const lineData = {
    labels: chartData.map((datum) => datum.year),
    datasets: [
      {
        label: "Expenses Trend",
        data: chartData.map((datum) => datum.y),
        borderColor: "black",
        backgroundColor: "rgba(0, 0, 0, 0)",
        fill: false,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      background: true,
      tooltip: {
        callbacks: { label: (context) => `Total: ${context.raw}` },
      },
      legend: {
        position: "top",
        labels: { font: { size: 14, weight: "bold" }, color: "black" },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          font: { weight: "bold", size: 14, color: "black" },
        },
        ticks: { font: { weight: "bold", size: 12, color: "black" } },
      },
      y: {
        title: {
          display: true,
          text: "Total Amount",
          font: { weight: "bold", size: 14, color: "black" },
        },
        ticks: { font: { weight: "bold", size: 12, color: "black" } },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: { xs: 2, sm: 3 },
      }}
    >
      {/* Pie Chart */}
      <Box
        sx={{
          width: { xs: "100%", sm: "48%" },
          height: { xs: "300px", sm: "400px" },
          background: "linear-gradient(to bottom, #e6f2ff, #ffffff)",
          p: { xs: 1, sm: 2 },
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            mb: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textAlign: "center",
          }}
        >
          Pie Chart
        </Typography>
        <Box sx={{ flex: 1, position: "relative" }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </Box>

      {/* Bar Chart */}
      <Box
        sx={{
          width: { xs: "100%", sm: "48%" },
          height: { xs: "300px", sm: "400px" },
          background: "linear-gradient(to bottom, #e6f2ff, #ffffff)",
          p: { xs: 1, sm: 2 },
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            mb: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textAlign: "center",
          }}
        >
          Bar Chart
        </Typography>
        <Box sx={{ flex: 1, position: "relative" }}>
          <Bar data={barData} options={barOptions} />
        </Box>
      </Box>

      {/* Line Chart */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", sm: "400px" },
          background: "linear-gradient(to bottom, #e6f2ff, #ffffff)",
          p: { xs: 1, sm: 2 },
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          mt: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "black",
            mb: 1,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            textAlign: "center",
          }}
        >
          Line Chart (Expenses Trend)
        </Typography>
        <Box sx={{ flex: 1, position: "relative" }}>
          <Line data={lineData} options={lineOptions} />
        </Box>
      </Box>
    </Box>
  );
};