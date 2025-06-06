export function getStageName(stageNumber) {
  // Ensure stageNumber is a valid number
  const stage = parseInt(stageNumber);

  // Handle invalid or missing stage numbers
  if (!stage || isNaN(stage) || stage < 1) {
    console.warn(`Invalid stage number received: ${stageNumber}`);
    return "Unknown Stage - Contact admin";
  }

  switch (stage) {
    case 1:
      return "Warm-Up";
    case 2:
      return "Acceleration";
    case 3:
      return "Sharp Turn";
    case 4:
      return "Obstacle Run";
    case 5:
      return "Breakaway";
    case 6:
      return "Final Sprint";
    case 7:
      return "Finish Line";
    case 8:
      // Handle stage 8 explicitly if it exists in your system
      return "Victory Lap";
    default:
      console.warn(`Unknown stage number: ${stage}`);
      return "Unknown Stage - Contact admin";
  }
}

export function getStageColor(teamId) {
  // Ensure teamId is a valid number
  const team = parseInt(teamId);

  // Handle invalid or missing team numbers
  if (!team || isNaN(team) || team < 1) {
    console.warn(`Invalid team id received: ${teamId}`);
    return "#000000"; // Default black for unknown teams
  }
  
  switch (team) {
    case 1: // Alpha - Đỏ
      return "#e30615";
    case 2: // Beta - Tím
      return "#9943b0";
    case 3: // Gamma - Vàng
      return "#fad02c";
    case 4: // Delta - Xanh lá
      return "#0b7442";
    case 5: // Epsilon - Xanh dương nhạt
      return "#03a2d9";
    case 6: // Zeta - Xanh dương đậm
      return "#004aad";
    case 7: // Eta - Hồng
      return "#e61193";
    case 8: // Theta - Tím đậm
      return "#800080";
    default:
      console.warn(`Unknown Team: ${team}`);
      return "#000000"; // Unknown - Đen
  }
}

export function getTeamName(teamId) {
  const team = parseInt(teamId);
  
  const teamNames = {
    1: 'Alpha',
    2: 'Beta', 
    3: 'Gamma',
    4: 'Delta',
    5: 'Epsilon',
    6: 'Zeta',
    7: 'Eta',
    8: 'Theta'
  };
  
  return teamNames[team] || `Team ${team}`;
}