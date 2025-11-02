// components/StreakBanner.js
export default function StreakBanner({ currentStreak }: any) {
  if (!currentStreak || currentStreak < 2) {
    return null;
  }

  return (
    <div className="streak-banner">
      🔥 You’re on a <strong>{currentStreak}-day</strong> Speed Streak!
    </div>
  );
}
