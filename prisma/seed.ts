import { PrismaClient } from '@prisma/client';
// import { readReplicas } from '@prisma/extension-read-replicas';
// const replicaDb = process.env.DATABASE_URL_REPLICA;

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable query logging
})
// .$extends(
//   readReplicas({
//     url: replicaDb ? replicaDb : "",
//   }),
// )
async function main() {
  // Create a few categories
  const categories = await prisma.shopCategories.createMany({
    data: [
      { title: 'Electronics' },
      { title: 'Books' },
      { title: 'Clothing' },
    ],
  });

  const categoryIds = await prisma.shopCategories.findMany({
    select: { id: true },
  });

  // Seed 10 shop items
  for (let i = 1; i <= 10; i++) {
    await prisma.shopItems.create({
      data: {
        title: `Item ${i}`,
        description: `Description for item ${i}`,
        imageUrl: `https://via.placeholder.com/150?text=Item+${i}`,
        price: i * 100,
        saleCount: Math.floor(Math.random() * 50),
        startDate: new Date(),
        expireDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
        catty: {
          connect: {
            id: categoryIds[i % categoryIds.length].id, // Rotate through categories
          },
        },
        isActive: i % 2 === 0, // Alternate active state
      },
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
