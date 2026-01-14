"use client"

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface MonthlyBooksChartProps {
  data: Array<{
    month: string
    year: number
    count: number
  }>
}

export default function MonthlyBooksChart({ data }: MonthlyBooksChartProps) {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Books Read",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(201, 168, 106, 0.8)",
        borderColor: "rgba(201, 168, 106, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#C9A86A",
        bodyColor: "#ffffff",
        padding: 12,
        borderColor: "rgba(201, 168, 106, 0.3)",
        borderWidth: 1,
        callbacks: {
          title: function (context) {
            const index = context[0].dataIndex
            return `${data[index].month} ${data[index].year}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          display: false,
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 11,
          },
          stepSize: 1,
        },
      },
    },
  }

  const totalBooks = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-2">Reading Trends</h3>
      <p className="text-white/60 text-sm mb-4">
        {totalBooks} books read in the last 12 months
      </p>
      <div className="w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
