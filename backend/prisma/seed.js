
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Insert Teams
  await prisma.team.createMany({
    data: [
      { team_name: 'Alpha', password: 'A7X9' },
      { team_name: 'Beta', password: 'B4L2' },
      { team_name: 'Gamma', password: 'G3M1' },
      { team_name: 'Delta', password: 'D2K8' },
      { team_name: 'Epsilon', password: 'E9Q5' },
      { team_name: 'Zeta', password: 'Z1R4' },
      { team_name: 'Omega', password: 'O5T7' },
      { team_name: 'Sigma', password: 'S8W3' },
      { team_name: 'Titan', password: 'T6N0' },
      { team_name: 'Nova', password: 'N2Y6' },
    ],
  });

  // Insert Stages
  await prisma.stage.createMany({
    data: [
      { stage_number: 1, stage_name: 'Warm Up', description: 'All', open_code: '1111', location_image: 'stage1.jpg' },
      { stage_number: 2, stage_name: 'Trạm Rắn', description: 'Tặng + CTV', open_code: '2222', location_image: 'stage2.jpg' },
      { stage_number: 3, stage_name: 'Trạm Mê Cung', description: 'Thành + CTV', open_code: '3333', location_image: 'stage3.jpg' },
      { stage_number: 4, stage_name: 'Trạm Cá Sấu', description: 'Bryan + CTV', open_code: '4444', location_image: 'stage3.jpg' },
      { stage_number: 5, stage_name: 'Trạm Vòng Xoay', description: 'Lân + Quốc Anh', open_code: '5555', location_image: 'stage3.jpg' },
      { stage_number: 6, stage_name: 'Trạm Hồ', description: 'Lâu + CTV', open_code: '6666', location_image: 'stage3.jpg' },
      { stage_number: 7, stage_name: 'Trạm Liên Hoàn', description: 'Tuyền + Thư', open_code: '7777', location_image: 'stage3.jpg' },
    ]
  });

  // Insert Questions
  await prisma.question.createMany({
    data: [
      { stage_id: 1, question_text: 'Question 1 for Stage 1?', answer: 'Answer1', hint1: 'Hint 1A', hint2: 'Hint 1B' },
      { stage_id: 1, question_text: 'Question 2 for Stage 1?', answer: 'Answer2', hint1: 'Hint 2A', hint2: 'Hint 2B' },
      { stage_id: 1, question_text: 'Question 3 for Stage 1?', answer: 'Answer3', hint1: 'Hint 3A', hint2: 'Hint 3B' },
      { stage_id: 1, question_text: 'Question 4 for Stage 1?', answer: 'Answer4', hint1: 'Hint 4A', hint2: 'Hint 4B' },
      { stage_id: 1, question_text: 'Question 5 for Stage 1?', answer: 'Answer5', hint1: 'Hint 5A', hint2: 'Hint 5B' },
      { stage_id: 1, question_text: 'Question 6 for Stage 1?', answer: 'Answer6', hint1: 'Hint 6A', hint2: 'Hint 6B' },
      { stage_id: 4, question_text: 'Question 7 for Stage 4?', answer: 'Answer7', hint1: 'Hint 7A', hint2: 'Hint 7B' },
      { stage_id: 4, question_text: 'Question 8 for Stage 4?', answer: 'Answer8', hint1: 'Hint 8A', hint2: 'Hint 8B' },
      { stage_id: 5, question_text: 'Question 9 for Stage 5?', answer: 'Answer9', hint1: 'Hint 9A', hint2: 'Hint 9B' },
      { stage_id: 5, question_text: 'Question 10 for Stage 5?', answer: 'Answer10', hint1: 'Hint 10A', hint2: 'Hint 10B' },
      { stage_id: 6, question_text: 'Question 11 for Stage 6?', answer: 'Answer11', hint1: 'Hint 11A', hint2: 'Hint 11B' },
      { stage_id: 6, question_text: 'Question 12 for Stage 6?', answer: 'Answer12', hint1: 'Hint 12A', hint2: 'Hint 12B' },
      { stage_id: 7, question_text: 'Question 13 for Stage 7?', answer: 'Answer13', hint1: 'Hint 13A', hint2: 'Hint 13B' },
      { stage_id: 7, question_text: 'Question 14 for Stage 7?', answer: 'Answer14', hint1: 'Hint 14A', hint2: 'Hint 14B' },
      { stage_id: 8, question_text: 'Question 15 for Stage 8?', answer: 'Answer15', hint1: 'Hint 15A', hint2: 'Hint 15B' },
      { stage_id: 8, question_text: 'Question 16 for Stage 8?', answer: 'Answer16', hint1: 'Hint 16A', hint2: 'Hint 16B' },
      { stage_id: 9, question_text: 'Question 17 for Stage 9?', answer: 'Answer17', hint1: 'Hint 17A', hint2: 'Hint 17B' },
      { stage_id: 9, question_text: 'Question 18 for Stage 9?', answer: 'Answer18', hint1: 'Hint 18A', hint2: 'Hint 18B' }
    ],
  });

  // Insert Team Routes
  await prisma.teamRoute.createMany({
    data: [
      { team_id: 1, stage_id: 1, route_order: 1 },
      { team_id: 1, stage_id: 2, route_order: 2 },
      { team_id: 1, stage_id: 3, route_order: 3 },
      { team_id: 1, stage_id: 4, route_order: 4 },
      { team_id: 1, stage_id: 5, route_order: 5 },
      { team_id: 1, stage_id: 6, route_order: 6 },
      { team_id: 1, stage_id: 7, route_order: 7 },
      { team_id: 2, stage_id: 1, route_order: 1 },
      { team_id: 2, stage_id: 3, route_order: 2 },
      { team_id: 2, stage_id: 4, route_order: 3 },
      { team_id: 2, stage_id: 5, route_order: 4 },
      { team_id: 2, stage_id: 6, route_order: 5 },
      { team_id: 2, stage_id: 7, route_order: 6 },
      { team_id: 2, stage_id: 2, route_order: 7 },
      { team_id: 3, stage_id: 1, route_order: 1 },
      { team_id: 3, stage_id: 4, route_order: 2 },
      { team_id: 3, stage_id: 5, route_order: 3 },
      { team_id: 3, stage_id: 6, route_order: 4 },
      { team_id: 3, stage_id: 7, route_order: 5 },
      { team_id: 3, stage_id: 2, route_order: 6 },
      { team_id: 3, stage_id: 3, route_order: 7 },
      { team_id: 4, stage_id: 1, route_order: 1 },
      { team_id: 4, stage_id: 5, route_order: 2 },
      { team_id: 4, stage_id: 6, route_order: 3 },
      { team_id: 4, stage_id: 7, route_order: 4 },
      { team_id: 4, stage_id: 2, route_order: 5 },
      { team_id: 4, stage_id: 3, route_order: 6 },
      { team_id: 4, stage_id: 4, route_order: 7 },
      { team_id: 5, stage_id: 1, route_order: 1 },
      { team_id: 5, stage_id: 6, route_order: 2 },
      { team_id: 5, stage_id: 7, route_order: 3 },
      { team_id: 5, stage_id: 2, route_order: 4 },
      { team_id: 5, stage_id: 3, route_order: 5 },
      { team_id: 5, stage_id: 4, route_order: 6 },
      { team_id: 5, stage_id: 5, route_order: 7 },
      { team_id: 6, stage_id: 1, route_order: 1 },
      { team_id: 6, stage_id: 7, route_order: 2 },
      { team_id: 6, stage_id: 2, route_order: 3 },
      { team_id: 6, stage_id: 3, route_order: 4 },
      { team_id: 6, stage_id: 4, route_order: 5 },
      { team_id: 6, stage_id: 5, route_order: 6 },
      { team_id: 6, stage_id: 6, route_order: 7 },
      { team_id: 7, stage_id: 1, route_order: 1 },
      { team_id: 7, stage_id: 2, route_order: 2 },
      { team_id: 7, stage_id: 3, route_order: 3 },
      { team_id: 7, stage_id: 4, route_order: 4 },
      { team_id: 7, stage_id: 5, route_order: 5 },
      { team_id: 7, stage_id: 6, route_order: 6 },
      { team_id: 7, stage_id: 7, route_order: 7 },
      { team_id: 8, stage_id: 1, route_order: 1 },
      { team_id: 8, stage_id: 3, route_order: 2 },
      { team_id: 8, stage_id: 4, route_order: 3 },
      { team_id: 8, stage_id: 5, route_order: 4 },
      { team_id: 8, stage_id: 6, route_order: 5 },
      { team_id: 8, stage_id: 7, route_order: 6 },
      { team_id: 8, stage_id: 2, route_order: 7 },
      { team_id: 9, stage_id: 1, route_order: 1 },
      { team_id: 9, stage_id: 4, route_order: 2 },
      { team_id: 9, stage_id: 5, route_order: 3 },
      { team_id: 9, stage_id: 6, route_order: 4 },
      { team_id: 9, stage_id: 7, route_order: 5 },
      { team_id: 9, stage_id: 2, route_order: 6 },
      { team_id: 9, stage_id: 3, route_order: 7 },
      { team_id: 10, stage_id: 1, route_order: 1 },
      { team_id: 10, stage_id: 5, route_order: 2 },
      { team_id: 10, stage_id: 6, route_order: 3 },
      { team_id: 10, stage_id: 7, route_order: 4 },
      { team_id: 10, stage_id: 2, route_order: 5 },
      { team_id: 10, stage_id: 3, route_order: 6 },
      { team_id: 10, stage_id: 4, route_order: 7 }
    ]
  });

  // Insert Team Question Assignments
  await prisma.teamQuestionAssignment.createMany({
    data: [
      { team_id: 1, stage_id: 1, question_id: 1, attempts: 0 },
      { team_id: 2, stage_id: 1, question_id: 2, attempts: 0 },
      { team_id: 3, stage_id: 1, question_id: 1, attempts: 0 },
      { team_id: 4, stage_id: 1, question_id: 2, attempts: 0 },
      { team_id: 5, stage_id: 1, question_id: 1, attempts: 0 },
      { team_id: 6, stage_id: 1, question_id: 2, attempts: 0 },
      { team_id: 7, stage_id: 1, question_id: 1, attempts: 0 },
      { team_id: 8, stage_id: 1, question_id: 2, attempts: 0 },
      { team_id: 9, stage_id: 1, question_id: 1, attempts: 0 },
      { team_id: 10, stage_id: 1, question_id: 2, attempts: 0 },
      { team_id: 1, stage_id: 2, question_id: 3, attempts: 0 },
      { team_id: 2, stage_id: 2, question_id: 4, attempts: 0 },
      { team_id: 3, stage_id: 2, question_id: 3, attempts: 0 },
      { team_id: 4, stage_id: 2, question_id: 4, attempts: 0 },
      { team_id: 5, stage_id: 2, question_id: 3, attempts: 0 },
      { team_id: 6, stage_id: 2, question_id: 4, attempts: 0 },
      { team_id: 7, stage_id: 2, question_id: 3, attempts: 0 },
      { team_id: 8, stage_id: 2, question_id: 4, attempts: 0 },
      { team_id: 9, stage_id: 2, question_id: 3, attempts: 0 },
      { team_id: 10, stage_id: 2, question_id: 4, attempts: 0 },
      { team_id: 1, stage_id: 3, question_id: 5, attempts: 0 },
      { team_id: 2, stage_id: 3, question_id: 6, attempts: 0 },
      { team_id: 3, stage_id: 3, question_id: 5, attempts: 0 },
      { team_id: 4, stage_id: 3, question_id: 6, attempts: 0 },
      { team_id: 5, stage_id: 3, question_id: 5, attempts: 0 },
      { team_id: 6, stage_id: 3, question_id: 6, attempts: 0 },
      { team_id: 7, stage_id: 3, question_id: 5, attempts: 0 },
      { team_id: 8, stage_id: 3, question_id: 6, attempts: 0 },
      { team_id: 9, stage_id: 3, question_id: 5, attempts: 0 },
      { team_id: 10, stage_id: 3, question_id: 6, attempts: 0 },
      { team_id: 1, stage_id: 4, question_id: 7, attempts: 0 },
      { team_id: 2, stage_id: 4, question_id: 8, attempts: 0 },
      { team_id: 3, stage_id: 4, question_id: 7, attempts: 0 },
      { team_id: 4, stage_id: 4, question_id: 8, attempts: 0 },
      { team_id: 5, stage_id: 4, question_id: 7, attempts: 0 },
      { team_id: 6, stage_id: 4, question_id: 8, attempts: 0 },
      { team_id: 7, stage_id: 4, question_id: 7, attempts: 0 },
      { team_id: 8, stage_id: 4, question_id: 8, attempts: 0 },
      { team_id: 9, stage_id: 4, question_id: 7, attempts: 0 },
      { team_id: 10, stage_id: 4, question_id: 8, attempts: 0 },
      { team_id: 1, stage_id: 5, question_id: 9, attempts: 0 },
      { team_id: 2, stage_id: 5, question_id: 10, attempts: 0 },
      { team_id: 3, stage_id: 5, question_id: 9, attempts: 0 },
      { team_id: 4, stage_id: 5, question_id: 10, attempts: 0 },
      { team_id: 5, stage_id: 5, question_id: 9, attempts: 0 },
      { team_id: 6, stage_id: 5, question_id: 10, attempts: 0 },
      { team_id: 7, stage_id: 5, question_id: 9, attempts: 0 },
      { team_id: 8, stage_id: 5, question_id: 10, attempts: 0 },
      { team_id: 9, stage_id: 5, question_id: 9, attempts: 0 },
      { team_id: 10, stage_id: 5, question_id: 10, attempts: 0 },
      { team_id: 1, stage_id: 6, question_id: 11, attempts: 0 },
      { team_id: 2, stage_id: 6, question_id: 12, attempts: 0 },
      { team_id: 3, stage_id: 6, question_id: 11, attempts: 0 },
      { team_id: 4, stage_id: 6, question_id: 12, attempts: 0 },
      { team_id: 5, stage_id: 6, question_id: 11, attempts: 0 },
      { team_id: 6, stage_id: 6, question_id: 12, attempts: 0 },
      { team_id: 7, stage_id: 6, question_id: 11, attempts: 0 },
      { team_id: 8, stage_id: 6, question_id: 12, attempts: 0 },
      { team_id: 9, stage_id: 6, question_id: 11, attempts: 0 },
      { team_id: 10, stage_id: 6, question_id: 12, attempts: 0 },
      { team_id: 1, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 2, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 3, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 4, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 5, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 6, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 7, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 8, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 9, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 10, stage_id: 7, question_id: 14, attempts: 0 }
    ]
  });
}

main()
  .then(() => {
    console.log('Seeding completed');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
