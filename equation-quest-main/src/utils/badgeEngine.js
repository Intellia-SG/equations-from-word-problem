// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for EquationQuest (Grade 7)

export const BADGES = [
  {
    id: 'first_clue',
    icon: '🔍',
    label: 'First Clue Found',
    description: 'Answered your very first equation question correctly!',
  },
  {
    id: 'hot_streak',
    icon: '🔥',
    label: 'Hot on the Trail',
    description: 'Achieved a streak of 5 correct answers!',
  },
  {
    id: 'super_streak',
    icon: '🕵️',
    label: 'Master Detective Streak',
    description: 'Achieved a 10-question winning streak!',
  },
  {
    id: 'forensics_kit',
    icon: '🧰',
    label: 'Full Forensics Kit',
    description: 'Completed all 4 interactive simulation stations!',
  },
  {
    id: 'case_closed',
    icon: '⭐',
    label: 'Case Closed',
    description: 'Scored 3 stars in a Practice World!',
  },
  {
    id: 'suspect_cracked',
    icon: '🚨',
    label: 'Suspect Cracked',
    description: 'Defeated a World Boss in battle!',
  },
  {
    id: 'seasoned_investigator',
    icon: '📋',
    label: 'Seasoned Investigator',
    description: 'Answered 20 or more questions in Practice!',
  },
  {
    id: 'chief_detective',
    icon: '🏅',
    label: 'Chief Detective Badge',
    description: 'Completed the full 5-phase EquationQuest journey!',
  },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_clue');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  // Simulation completion (all 4 stations)
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('forensics_kit');
  }

  // 3-star district check (9-10 correct = 3 stars)
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('case_closed');
  }

  // Seasoned investigator
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('seasoned_investigator');
  }

  // Boss slayer / Suspect cracked
  if (state.bossDefeated) {
    unlocked.push('suspect_cracked');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('chief_detective');
  }

  return unlocked;
}

export default { BADGES, checkBadges };
