"use client"

import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

interface GenrePieChartProps {
  data: Array<{
    genre: string
    count: number
    percentage: number
  }>
}

export default function GenrePieChart({ data }: GenrePieChartProps) {
  const chartData = {
    labels: data.map((item) => item.genre),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: [
          "rgba(201, 168, 106, 0.8)", // Gold
          "rgba(184, 152, 88, 0.8)", // Darker gold
          "rgba(160, 136, 71, 0.8)", // Bronze
          "rgba(139, 119, 60, 0.8)", // Darker bronze
          "rgba(120, 102, 50, 0.8)", // Dark gold
          "rgba(100, 85, 40, 0.8)", // Very dark gold
        ],
        borderColor: [
          "rgba(201, 168, 106, 1)",
          "rgba(184, 152, 88, 1)",
          "rgba(160, 136, 71, 1)",
          "rgba(139, 119, 60, 1)",
          "rgba(120, 102, 50, 1)",
          "rgba(100, 85, 40, 1)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          padding: 15,
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#C9A86A",
        bodyColor: "#ffffff",
        padding: 12,
        borderColor: "rgba(201, 168, 106, 0.3)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || ""
            const value = context.parsed
            const percentage = data[context.dataIndex].percentage
            return `${label}: ${value} books (${percentage}%)`
          },
        },
      },
    },
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center">
        <p className="text-white/60">No genre data yet. Start reading books!</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <h3 className="text-xl font-bold text-white mb-4">Favorite Genres</h3>
      <div className="w-full max-w-sm mx-auto">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          Based on {data.reduce((sum, item) => sum + item.count, 0)} books read
        </p>
      </div>
    </div>
  )
}
