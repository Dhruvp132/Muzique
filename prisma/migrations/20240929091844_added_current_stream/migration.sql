/*
  Warnings:

  - The primary key for the `CurrentStream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userid` on the `CurrentStream` table. All the data in the column will be lost.
  - Added the required column `userId` to the `CurrentStream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CurrentStream" DROP CONSTRAINT "CurrentStream_pkey",
DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "CurrentStream_pkey" PRIMARY KEY ("userId");
