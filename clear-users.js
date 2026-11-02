const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.inspectionTest.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.materialPassport.deleteMany();
  await prisma.material.deleteMany();
  await prisma.standard.deleteMany();
  await prisma.materialCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const userCount = await prisma.user.count();
  const companyCount = await prisma.company.count();

  console.log(`Users remaining: ${userCount}`);
  console.log(`Companies remaining: ${companyCount}`);
}

main()
  .catch((error) => {
    console.error('Failed to clear users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
