"use client"

interface ReadingStreakCardProps {
  streak: number
}

export default function ReadingStreakCard({ streak }: ReadingStreakCardProps) {
  const getMotivationalMessage = (days: number) => {
    if (days === 0) return "Start your reading journey today!"
    if (days < 7) return "Great start! Keep it up!"
    if (days < 30) return "You're on fire! 🔥"
    if (days < 100) return "Incredible streak! Don't stop now!"
    return "Legend status! 🏆"
  }

  const getFlameIcon = (days: number) => {
    if (days === 0) return "📖"
    if (days < 7) return "🔥"
    if (days < 30) return "🔥🔥"
    return "🔥🔥🔥"
  }

  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-300">
      <div className="text-center">
        <div className="text-5xl mb-3">{getFlameIcon(streak)}</div>
        <div className="text-4xl font-bold text-white mb-2">{streak} Days</div>
        <div className="text-lg text-white/90 font-semibold mb-1">
          Reading Streak
        </div>
        <div className="text-sm text-white/60">
          {getMotivationalMessage(streak)}
        </div>
      </div>

      {streak > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs text-white/60">
            <span>Consistency is key 💪</span>
            <span>Keep reading!</span>
          </div>
        </div>
      )}
    </div>
  )
}
