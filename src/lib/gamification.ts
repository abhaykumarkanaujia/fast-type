export const SKILL_LEVELS = [
  { wpm: 0, title: "🐢 Beginner" },
  { wpm: 21, title: "✍️ Learner" },
  { wpm: 36, title: "🎯 Skilled" },
  { wpm: 51, title: "⚙️ Experienced" },
  { wpm: 66, title: "⚡ Fast" },
  { wpm: 81, title: "🔥 Advanced" },
  { wpm: 96, title: "🧠 Expert" },
  { wpm: 111, title: "👑 Pro / Legendary" },
];

const isConsecutiveDay = (date1: any, date2: any) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setDate(d1.getDate() + 1);
  return d1.toDateString() === d2.toDateString();
};

export const processTestResult = (currentUserStats: any, newWpm: number) => {
  const today = new Date();
  const newStats = { ...currentUserStats };

  newStats.racesCompleted = (currentUserStats.racesCompleted || 0) + 1;

  const lastTestDate = new Date(currentUserStats.lastTestDate);
  if (
    lastTestDate &&
    isConsecutiveDay(lastTestDate, today) &&
    newWpm >= currentUserStats.lastTestWPM
  ) {
    newStats.currentStreak = (currentUserStats.currentStreak || 0) + 1;
  } else if (currentUserStats.lastTestDate) {
    newStats.currentStreak = 1;
  } else {
    newStats.currentStreak = 1;
  }
  newStats.longestStreak = Math.max(
    newStats.longestStreak || 0,
    newStats.currentStreak
  );
  newStats.lastTestWPM = newWpm;
  newStats.lastTestDate = today;

  const newSkill = SKILL_LEVELS.slice()
    .reverse()
    .find((level) => newWpm >= level.wpm);
  if (newSkill) {
    newStats.skillLevel = newSkill.title;
  }
  newStats.xpPoints = (newStats.xpPoints || 0) + Math.round(newWpm);

  return newStats;
};
