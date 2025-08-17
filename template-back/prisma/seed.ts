import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
      { email: 'bob@example.com', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
      { email: 'carol@example.com', name: 'Carol', avatarUrl: 'https://i.pravatar.cc/150?img=3' }
    ],
    skipDuplicates: true
  });
  console.log('Seeded users:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
