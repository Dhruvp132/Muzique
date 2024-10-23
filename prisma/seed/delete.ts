// prisma/deleteUser.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllStreams() {
  try {
    // Deletes all records in the "User" model
    await prisma.stream.deleteMany();
    console.log('All users deleted successfully');
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllStreams();