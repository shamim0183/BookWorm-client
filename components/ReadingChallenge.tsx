"use client"

import { ArcElement, Chart as ChartJS, ChartOptions, Tooltip } from "chart.js"
import { useState } from "react"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip)

interface ReadingChallengeProps {
  currentBooks: number
  targetBooks: number
  year: number
  onUpdateGoal: (target: number) => void
}

export default function ReadingChallenge({
  currentBooks,
  targetBooks,
  year,
  onUpdateGoal,
}: ReadingChallengeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTarget, setNewTarget] = useState(targetBooks || 50)

  const percentage = targetBooks > 0 ? (currentBooks / targetBooks) * 100 : 0
  const remaining = Math.max(0, targetBooks - currentBooks)

  const chartData = {
    datasets: [
      {
        data: [currentBooks, remaining],
        backgroundColor: [
          "rgba(201, 168, 106, 0.9)",
          "rgba(255, 255, 255, 0.1)",
        ],
        borderColor: ["rgba(201, 168, 106, 1)", "rgba(255, 255, 255, 0.2)"],
        borderWidth: 2,
        cutout: "75%",
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
  }

  const handleSaveGoal = () => {
    if (newTarget >= 1) {
      onUpdateGoal(newTarget)
      setIsEditing(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-[#C9A86A]/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          📚 {year} Reading Challenge
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#C9A86A] hover:text-[#B89858] text-sm font-semibold transition"
          >
            Edit Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm block mb-2">
              Books to read in {year}:
            </label>
            <input
              type="number"
              min="1"
              value={newTarget}
              onChange={(e) => setNewTarget(parseInt(e.target.value) || 1)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#C9A86A] transition"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveGoal}
              className="flex-1 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold py-2 rounded-xl transition"
            >
              Save Goal
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setNewTarget(targetBooks || 50)
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 relative">
              <Doughnut data={chartData} options={options} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-[#C9A86A]">
                  {Math.round(percentage)}%
                </div>
                <div className="text-xs text-white/60">complete</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-3xl font-bold text-white mb-1">
                {currentBooks} / {targetBooks}
              </div>
              <div className="text-white/70 text-sm mb-3">books read</div>
              {remaining > 0 ? (
                <div className="text-white/60 text-sm">
                  {remaining} {remaining === 1 ? "book" : "books"} to go! 💪
                </div>
              ) : (
                <div className="text-[#C9A86A] text-sm font-semibold">
                  🎉 Goal achieved! Amazing!
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
