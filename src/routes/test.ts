import prisma from "../config/prisma";


async function main() {
  await prisma.$connect();
  console.log("✅ Database Connected");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });