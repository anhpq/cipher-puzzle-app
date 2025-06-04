// const { PrismaClient } = require("@prisma/client");
const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

function loadImage(filename) {
  return fs.readFileSync(path.join(__dirname, "images", filename));
}

async function main() {
  // Insert Teams
  await prisma.teams.createMany({
    data: [
      { team_name: "Alpha", password: "A7X9" },
      { team_name: "Beta", password: "B4L2" },
      { team_name: "Gamma", password: "G3M1" },
      { team_name: "Delta", password: "D2K8" },
      { team_name: "Epsilon", password: "E9Q5" },
      { team_name: "Zeta", password: "Z1R4" },
      { team_name: "Omega", password: "O5T7" },
      { team_name: "Sigma", password: "S8W3" },
      { team_name: "Titan", password: "T6N0" },
      { team_name: "Nova", password: "N2Y6" },
    ],
  });

  // Insert Stages
  await prisma.stages.createMany({
    data: [
      {
        stage_number: 1,
        stage_name: "Warm Up",
        description: "All",
        open_code: "1111",
        location_image: loadImage("1.png"),
      },
      {
        stage_number: 2,
        stage_name: "Trạm Mê Cung",
        description: "Thành + CTV",
        open_code: "2222",
        location_image: loadImage("2.png"),
      },
      {
        stage_number: 3,
        stage_name: "Trạm Rắn",
        description: "Tặng + CTV",
        open_code: "3333",
        location_image: loadImage("3.png"),
      },
      {
        stage_number: 4,
        stage_name: "Trạm Liên Hoàn",
        description: "Tuyền + Thư",
        open_code: "4444",
        location_image: loadImage("4.png"),
      },
      {
        stage_number: 5,
        stage_name: "Trạm Vòng Xoay",
        description: "Lân + Quốc Anh",
        open_code: "5555",
        location_image: loadImage("5.png"),
      },
      {
        stage_number: 6,
        stage_name: "Trạm Cá Sấu",
        description: "Bryan + CTV",
        open_code: "6666",
        location_image: loadImage("6.png"),
      },
      {
        stage_number: 7,
        stage_name: "Trạm Hồ",
        description: "Lâu + CTV",
        open_code: "7777",
        location_image: loadImage("7.png"),
      },
      {
        stage_number: 8,
        stage_name: "Trạm Sân Khấu",
        description: "All",
        open_code: "8888",
        location_image: loadImage("7.png"),
      },
    ],
  });

  // Insert Questions
  await prisma.questions.createMany({
    data: [
      // Stage 1 - Warm Up
      {
        stage_id: 1,
        question_text: "Warm Up - Answer1.1",
        answer: "Answer1.1",
        hint1: loadImage("1.png"),
        hint2: loadImage("1.png"),
      },
      {
        stage_id: 1,
        question_text: "Warm Up - Answer1.2",
        answer: "Answer1.2",
        hint1: loadImage("1.png"),
        hint2: loadImage("1.png"),
      },

      // Stage 2 - Trạm Mê Cung
      {
        stage_id: 2,
        question_text: "Trạm Mê Cung - Answer2.1",
        answer: "Answer2.1",
        hint1: loadImage("2.png"),
        hint2: loadImage("2.png"),
      },
      {
        stage_id: 2,
        question_text: "Trạm Mê Cung - Answer2.2",
        answer: "Answer2.2",
        hint1: loadImage("2.png"),
        hint2: loadImage("2.png"),
      },

      // Stage 3 - Trạm Rắn
      {
        stage_id: 3,
        question_text: "Trạm Rắn - Answer3.1",
        answer: "Answer3.1",
        hint1: loadImage("3.png"),
        hint2: loadImage("3.png"),
      },
      {
        stage_id: 3,
        question_text: "Trạm Rắn - Answer3.2",
        answer: "Answer3.2",
        hint1: loadImage("3.png"),
        hint2: loadImage("3.png"),
      },

      // Stage 4 - Trạm Liên Hoàn
      {
        stage_id: 4,
        question_text: "Trạm Liên Hoàn - Answer4.1",
        answer: "Answer4.1",
        hint1: loadImage("4.png"),
        hint2: loadImage("4.png"),
      },
      {
        stage_id: 4,
        question_text: "Trạm Liên Hoàn - Answer4.2",
        answer: "Answer4.2",
        hint1: loadImage("4.png"),
        hint2: loadImage("4.png"),
      },

      // Stage 5 - Trạm Vòng Xoay
      {
        stage_id: 5,
        question_text: "Trạm Vòng Xoay - Answer5.1",
        answer: "Answer5.1",
        hint1: loadImage("5.png"),
        hint2: loadImage("5.png"),
      },
      {
        stage_id: 5,
        question_text: "Trạm Vòng Xoay - Answer5.2",
        answer: "Answer5.2",
        hint1: loadImage("5.png"),
        hint2: loadImage("5.png"),
      },

      // Stage 6 - Trạm Cá Sấu
      {
        stage_id: 6,
        question_text: "Trạm Cá Sấu - Answer6.1",
        answer: "Answer6.1",
        hint1: loadImage("6.png"),
        hint2: loadImage("6.png"),
      },
      {
        stage_id: 6,
        question_text: "Trạm Cá Sấu - Answer6.2",
        answer: "Answer6.2",
        hint1: loadImage("6.png"),
        hint2: loadImage("6.png"),
      },

      // Stage 7 - Trạm Hồ
      {
        stage_id: 7,
        question_text: "Trạm Hồ - Answer7.1",
        answer: "Answer7.1",
        hint1: loadImage("7.png"),
        hint2: loadImage("7.png"),
      },
      {
        stage_id: 7,
        question_text: "Trạm Hồ - Answer7.2",
        answer: "Answer7.2",
        hint1: loadImage("7.png"),
        hint2: loadImage("7.png"),
      },
      
      // Stage 8 - Finish Line
      {
        stage_id: 8,
        question_text: "Finish Line - STMOVEMENT2025",
        answer: "STMOVEMENT2025",
        hint1: loadImage("1.png"),
        hint2: loadImage("1.png"),
      }
    ],
  });

  // Insert Team Routes
  await prisma.team_routes.createMany({
    data: [
      // Team 1
      { team_id: 1, stage_id: 1, route_order: 1 },
      { team_id: 1, stage_id: 2, route_order: 2 },
      { team_id: 1, stage_id: 3, route_order: 3 },
      { team_id: 1, stage_id: 4, route_order: 4 },
      { team_id: 1, stage_id: 5, route_order: 5 },
      { team_id: 1, stage_id: 6, route_order: 6 },
      { team_id: 1, stage_id: 7, route_order: 7 },
      { team_id: 1, stage_id: 8, route_order: 8 },

      // Team 2
      { team_id: 2, stage_id: 1, route_order: 1 },
      { team_id: 2, stage_id: 3, route_order: 2 },
      { team_id: 2, stage_id: 4, route_order: 3 },
      { team_id: 2, stage_id: 5, route_order: 4 },
      { team_id: 2, stage_id: 6, route_order: 5 },
      { team_id: 2, stage_id: 7, route_order: 6 },
      { team_id: 2, stage_id: 2, route_order: 7 },
      { team_id: 2, stage_id: 8, route_order: 8 },

      // Team 3
      { team_id: 3, stage_id: 1, route_order: 1 },
      { team_id: 3, stage_id: 4, route_order: 2 },
      { team_id: 3, stage_id: 5, route_order: 3 },
      { team_id: 3, stage_id: 6, route_order: 4 },
      { team_id: 3, stage_id: 7, route_order: 5 },
      { team_id: 3, stage_id: 2, route_order: 6 },
      { team_id: 3, stage_id: 3, route_order: 7 },
      { team_id: 3, stage_id: 8, route_order: 8 },

      // Team 4
      { team_id: 4, stage_id: 1, route_order: 1 },
      { team_id: 4, stage_id: 5, route_order: 2 },
      { team_id: 4, stage_id: 6, route_order: 3 },
      { team_id: 4, stage_id: 7, route_order: 4 },
      { team_id: 4, stage_id: 2, route_order: 5 },
      { team_id: 4, stage_id: 3, route_order: 6 },
      { team_id: 4, stage_id: 4, route_order: 7 },
      { team_id: 4, stage_id: 8, route_order: 8 },

      // Team 5
      { team_id: 5, stage_id: 1, route_order: 1 },
      { team_id: 5, stage_id: 6, route_order: 2 },
      { team_id: 5, stage_id: 7, route_order: 3 },
      { team_id: 5, stage_id: 2, route_order: 4 },
      { team_id: 5, stage_id: 3, route_order: 5 },
      { team_id: 5, stage_id: 4, route_order: 6 },
      { team_id: 5, stage_id: 5, route_order: 7 },
      { team_id: 5, stage_id: 8, route_order: 8 },

      // Team 6
      { team_id: 6, stage_id: 1, route_order: 1 },
      { team_id: 6, stage_id: 7, route_order: 2 },
      { team_id: 6, stage_id: 2, route_order: 3 },
      { team_id: 6, stage_id: 3, route_order: 4 },
      { team_id: 6, stage_id: 4, route_order: 5 },
      { team_id: 6, stage_id: 5, route_order: 6 },
      { team_id: 6, stage_id: 6, route_order: 7 },
      { team_id: 6, stage_id: 8, route_order: 8 },

      // Team 7
      { team_id: 7, stage_id: 1, route_order: 1 },
      { team_id: 7, stage_id: 2, route_order: 2 },
      { team_id: 7, stage_id: 3, route_order: 3 },
      { team_id: 7, stage_id: 4, route_order: 4 },
      { team_id: 7, stage_id: 5, route_order: 5 },
      { team_id: 7, stage_id: 6, route_order: 6 },
      { team_id: 7, stage_id: 7, route_order: 7 },
      { team_id: 7, stage_id: 8, route_order: 8 },

      // Team 8
      { team_id: 8, stage_id: 1, route_order: 1 },
      { team_id: 8, stage_id: 3, route_order: 2 },
      { team_id: 8, stage_id: 4, route_order: 3 },
      { team_id: 8, stage_id: 5, route_order: 4 },
      { team_id: 8, stage_id: 6, route_order: 5 },
      { team_id: 8, stage_id: 7, route_order: 6 },
      { team_id: 8, stage_id: 2, route_order: 7 },
      { team_id: 8, stage_id: 8, route_order: 8 },

      // Team 9
      { team_id: 9, stage_id: 1, route_order: 1 },
      { team_id: 9, stage_id: 4, route_order: 2 },
      { team_id: 9, stage_id: 5, route_order: 3 },
      { team_id: 9, stage_id: 6, route_order: 4 },
      { team_id: 9, stage_id: 7, route_order: 5 },
      { team_id: 9, stage_id: 2, route_order: 6 },
      { team_id: 9, stage_id: 3, route_order: 7 },
      { team_id: 9, stage_id: 8, route_order: 8 },

      // Team 10
      { team_id: 10, stage_id: 1, route_order: 1 },
      { team_id: 10, stage_id: 5, route_order: 2 },
      { team_id: 10, stage_id: 6, route_order: 3 },
      { team_id: 10, stage_id: 7, route_order: 4 },
      { team_id: 10, stage_id: 2, route_order: 5 },
      { team_id: 10, stage_id: 3, route_order: 6 },
      { team_id: 10, stage_id: 4, route_order: 7 },
      { team_id: 10, stage_id: 8, route_order: 8 },
    ],
  });

  // Insert Team Question Assignments
  await prisma.team_question_assignments.createMany({
    data: [
      // Stage 1
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

      // Stage 2
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

      // Stage 3
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

      // Stage 4
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

      // Stage 5
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

      // Stage 6
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

      // Stage 7
      { team_id: 1, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 2, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 3, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 4, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 5, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 6, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 7, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 8, stage_id: 7, question_id: 14, attempts: 0 },
      { team_id: 9, stage_id: 7, question_id: 13, attempts: 0 },
      { team_id: 10, stage_id: 7, question_id: 14, attempts: 0 },

      // Stage 8
      { team_id: 1, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 2, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 3, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 4, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 5, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 6, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 7, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 8, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 9, stage_id: 8, question_id: 15, attempts: 0 },
      { team_id: 10, stage_id: 8, question_id: 15, attempts: 0 },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeding completed");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
