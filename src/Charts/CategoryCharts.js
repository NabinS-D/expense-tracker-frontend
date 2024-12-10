import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register required Chart.js elements
ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

export const CategoryCharts = ({ chartData }) => {
    // Prepare data for Pie Chart
    const pieData = {
        labels: chartData.map((datum) => datum.x), // Extract category names from chartData
        datasets: [
            {
                data: chartData.map((datum) => datum.y), // Extract total amounts for Pie Chart
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

    // Pie Chart options
    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}`; // Custom tooltip label format
                    },
                },
            },
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14, // Adjust font size for legend labels
                        weight: "bold", // Make legend labels bold
                    },
                    color: "black", // Set legend label color to black
                },
            },
        },
    };

    // Prepare data for Bar Chart
    const barData = {
        labels: chartData.map((datum) => datum.x), // Category names
        datasets: [
            {
                label: "Expenses by Category",
                data: chartData.map((datum) => datum.y), // Amounts
                borderColor: "white", // Change this to black
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

    // Bar Chart options
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    font: {
                        size: 14, // Adjust font size for legend labels
                        weight: "bold", // Make legend labels bold
                    },
                    color: "black", // Set legend label color to black
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Amount: ${context.raw}`, // Custom tooltip label format
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Categories",
                    font: {
                        weight: "bold",
                        size: 14, // Optional: adjust font size as needed
                        family: "Arial", // Optional: adjust font family
                        color: "white", // Set label color to black
                    },
                },
                ticks: {
                    font: {
                        weight: "bold",
                        size: 12, // Optional: adjust tick font size
                        color: "black", // Set tick label color to black
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Total Amount",
                    font: {
                        weight: "bold",
                        size: 14, // Optional: adjust font size as needed
                        family: "Arial", // Optional: adjust font family
                        color: "black", // Set label color to black
                    },
                },
                ticks: {
                    font: {
                        weight: "bold",
                        size: 12, // Optional: adjust tick font size
                        color: "black", // Set tick label color to black
                    },
                },
                beginAtZero: true,
            },
        },
    };

    // Prepare data for Line Chart (Trend of Total Expenses per Year)
    const lineData = {
        labels: chartData.map((datum) => datum.year), // Extract years from chartData
        datasets: [
            {
                label: "Expenses Trend",
                data: chartData.map((datum) => datum.y), // Data for the line chart
                borderColor: "white", // Change this to black
                backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
                fill: false, // Do not fill the area under the line
                tension: 0.4, // Optional: adjust line smoothness
                borderWidth: 2, // Line thickness
            },
        ],
    };

    // Line Chart options
    const lineOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Total: ${context.raw}`; // Custom tooltip label format for line chart
                    },
                },
            },
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14, // Adjust font size for legend labels
                        weight: "bold", // Make legend labels bold
                    },
                    color: "black", // Set legend label color to black
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Year",
                    font: {
                        weight: "bold",
                        size: 14,
                        color: "black",
                    },
                },
                ticks: {
                    font: {
                        weight: "bold",
                        size: 12,
                        color: "black",
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Total Amount",
                    font: {
                        weight: "bold",
                        size: 14,
                        color: "black",
                    },
                },
                ticks: {
                    font: {
                        weight: "bold",
                        size: 12,
                        color: "black",
                    },
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                {/* Pie Chart */}
                <div style={{ width: "48%", height: "400px", marginBottom: "30px" }}>
                    <h3 style={{ fontWeight: "bold", color: "black" }}>Pie Chart</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>

                {/* Bar Chart */}
                <div style={{ width: "48%", height: "400px", marginBottom: "30px" }}>
                    <h3 style={{ fontWeight: "bold", color: "black" }}>Bar Chart</h3>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            <div style={{ width: "100%", marginTop: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {/* Line Chart (Trend of Expenses per Year) */}
                <div style={{ width: "48%", height: "400px", marginBottom: "30px" }}>
                    <h3 style={{ fontWeight: "bold", color: "black", textAlign: "center" }}>Line Chart (Expenses Trend)</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>
            </div>

        </>
    );

};
