/*
  Warnings:

  - You are about to drop the column `clientIp` on the `Revision` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `flaggedIp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'QUEUED_FOR_AI';
ALTER TYPE "Status" ADD VALUE 'PROCESSING';

-- DropIndex
DROP INDEX "User_pHash_key";

-- DropIndex
DROP INDEX "User_telegramId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Revision" DROP COLUMN "clientIp",
ADD COLUMN     "hashedIp" TEXT,
ADD COLUMN     "priorityScore" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "flaggedIp",
DROP COLUMN "lastName",
DROP COLUMN "pHash",
DROP COLUMN "password",
DROP COLUMN "photoUrl",
DROP COLUMN "telegramId",
DROP COLUMN "username",
ADD COLUMN     "encryptedData" TEXT,
ADD COLUMN     "hashedFlaggedIp" TEXT;

-- CreateTable
CREATE TABLE "AiVote" (
    "id" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiVote_userId_revisionId_key" ON "AiVote"("userId", "revisionId");

-- AddForeignKey
ALTER TABLE "AiVote" ADD CONSTRAINT "AiVote_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "Revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiVote" ADD CONSTRAINT "AiVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
