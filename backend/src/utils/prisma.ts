import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function initializePrisma(): Promise<PrismaClient> {
  try {
    await prisma.$connect();
    console.log("Database connection is successful");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
