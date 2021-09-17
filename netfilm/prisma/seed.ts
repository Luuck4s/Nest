import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

async function main() {
  for (const r of roles) {
    await prisma.role.create({
      data: r,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
