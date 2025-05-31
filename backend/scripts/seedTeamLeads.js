const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const teams = [
  { teamName: 'Alpha',   password: 'A7X9' },
  { teamName: 'Beta',    password: 'B4L2' },
  { teamName: 'Gamma',   password: 'G3M1' },
  { teamName: 'Delta',   password: 'D2K8' },
  { teamName: 'Epsilon', password: 'E9Q5' },
  { teamName: 'Zeta',    password: 'Z1R4' },
  { teamName: 'Omega',   password: 'O5T7' },
  { teamName: 'Sigma',   password: 'S8W3' },
  { teamName: 'Titan',   password: 'T6N0' },
  { teamName: 'Nova',    password: 'N2Y6' }
];

async function seed() {
  for (const team of teams) {
    await prisma.teamLead.create({
      data: {
        teamName: team.teamName,
        password: team.password,
      },
    });
    console.log(`Created team: ${team.teamName}`);
  }
}

seed()
  .then(() => {
    console.log('Seeding complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
