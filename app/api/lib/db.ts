import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export const prisma = new PrismaClient({
   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

export async function connectToDatabase() : Promise<boolean> {
   try {
      await prisma.$connect();
      return true;
   } catch (error) {
      console.error("Database connection error:", error);
      return false;
   }
}