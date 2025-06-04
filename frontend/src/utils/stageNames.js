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