export function getStageName(stageNumber) {
  switch (stageNumber) {
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
    default:
      return "Unknown Stage - Contact admin";
  }
}