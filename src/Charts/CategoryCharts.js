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

// Register required Chart.js elements and custom background plugin
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
      ctx.fillStyle = "#ffffff"; // Match gradient end
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
        position: "right",
        labels: {
          font: { size: 14, weight: "bold" },
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

  const chartContainerStyle = {
    width: "48%",
    height: "400px",
    marginBottom: "30px",
    background: "linear-gradient(to bottom, #e6f2ff, #ffffff)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div style={chartContainerStyle}>
          <h3
            style={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}
          >
            Pie Chart
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div style={chartContainerStyle}>
          <h3
            style={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}
          >
            Bar Chart
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={chartContainerStyle}>
          <h3
            style={{ fontWeight: "bold", color: "black", marginBottom: "10px" }}
          >
            Line Chart (Expenses Trend)
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
    </>
  );
};
