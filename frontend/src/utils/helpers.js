// Enhanced helpers.js with better error handling and performance
export const STAGE_NAMES = {
  1: "Warm Up",
  2: "Acceleration",
  3: "Sharp Turn",
  4: "Obstacle Run",
  5: "Breakaway",
  6: "Final Sprint",
  7: "Finish Line",
  8: "Victory Lap"
};

export const TEAM_COLORS = {
  1: "#e30615", // Alpha - Đỏ
  2: "#FE6603", // Beta - Cam
  3: "#FFC100", // Gamma - Vàng
  4: "#0b7442", // Delta - Xanh lá
  5: "#03a2d9", // Epsilon - Xanh dương nhạt
  6: "#004aad", // Zeta - Xanh dương đậm
  7: "#e61f93", // Omega - Hồng
  8: "#800080",  // Sigma - Tím đậm
  9: "#8f5d46", // Titan - Nâu
  10: "#000000",  // Nova - Đen
};

export const TEAM_NAMES = {
  1: 'Alpha',
  2: 'Beta',
  3: 'Gamma',
  4: 'Delta',
  5: 'Epsilon',
  6: 'Zeta',
  7: 'Omega',
  8: 'Sigma',
  9: 'Titan',
  10: 'Nova',
};

export function getStageName(stageNumber) {
  const stage = parseInt(stageNumber);

  if (!Number.isInteger(stage) || stage < 1) {
    console.warn(`Invalid stage number received: ${stageNumber}`);
    return "Unknown Stage - Contact admin";
  }

  return STAGE_NAMES[stage] || (() => {
    console.warn(`Unknown stage number: ${stage}`);
    return "Unknown Stage - Contact admin";
  })();
}

export function getTeamColor(teamId) {
  const team = parseInt(teamId);

  if (!Number.isInteger(team) || team < 1) {
    console.warn(`Invalid team id received: ${teamId}`);
    return "#000000"; // Default black for unknown teams
  }

  return TEAM_COLORS[team] || (() => {
    console.warn(`Unknown Team: ${team}`);
    return "#000000"; // Unknown - Đen
  })();
}

export function getTeamName(teamId) {
  const team = parseInt(teamId);
  return TEAM_NAMES[team] || `Team ${team}`;
}

// New utility functions for better code organization
export function isValidStageNumber(stageNumber) {
  const stage = parseInt(stageNumber);
  return Number.isInteger(stage) && stage >= 1 && stage <= 8;
}

export function isValidTeamId(teamId) {
  const team = parseInt(teamId);
  return Number.isInteger(team) && team >= 1 && team <= 8;
}

export function getAllStageNames() {
  return Object.values(STAGE_NAMES);
}

export function getAllTeamNames() {
  return Object.values(TEAM_NAMES);
}