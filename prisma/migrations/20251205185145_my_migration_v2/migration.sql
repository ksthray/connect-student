/*
  Warnings:

  - The values [STUDENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `studentId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `JobOffer` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `MonthlyApplication` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[candidateId,jobOfferId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `JobOffer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[candidateId,monthYear]` on the table `MonthlyApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `JobOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateId` to the `MonthlyApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CANDIDATE', 'COMPANY', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CANDIDATE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_studentId_fkey";

-- DropForeignKey
ALTER TABLE "JobOffer" DROP CONSTRAINT "JobOffer_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "MonthlyApplication" DROP CONSTRAINT "MonthlyApplication_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropIndex
DROP INDEX "Application_studentId_jobOfferId_key";

-- DropIndex
DROP INDEX "MonthlyApplication_studentId_monthYear_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "studentId",
ADD COLUMN     "candidateId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobOffer" DROP COLUMN "categoryId",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyApplication" DROP COLUMN "studentId",
ADD COLUMN     "candidateId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "fullname" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'CANDIDATE';

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "StudentProfile";

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "UserLevel" NOT NULL DEFAULT 'STUDENT',
    "university" TEXT,
    "skills" TEXT[],
    "cvUrl" TEXT,
    "birthday" TIMESTAMP(3),
    "city" TEXT,
    "commune" TEXT,
    "address" TEXT,
    "about" TEXT,
    "notificationPreferences" "JobType"[],
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMP(3),

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateProfileToSector" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidateProfileToSector_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobOfferToSector" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_JobOfferToSector_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_slug_key" ON "Sector"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_userId_key" ON "CandidateProfile"("userId");

-- CreateIndex
CREATE INDEX "_CandidateProfileToSector_B_index" ON "_CandidateProfileToSector"("B");

-- CreateIndex
CREATE INDEX "_JobOfferToSector_B_index" ON "_JobOfferToSector"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Application_candidateId_jobOfferId_key" ON "Application"("candidateId", "jobOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_slug_key" ON "JobOffer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyApplication_candidateId_monthYear_key" ON "MonthlyApplication"("candidateId", "monthYear");

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyApplication" ADD CONSTRAINT "MonthlyApplication_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateProfileToSector" ADD CONSTRAINT "_CandidateProfileToSector_A_fkey" FOREIGN KEY ("A") REFERENCES "CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateProfileToSector" ADD CONSTRAINT "_CandidateProfileToSector_B_fkey" FOREIGN KEY ("B") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobOfferToSector" ADD CONSTRAINT "_JobOfferToSector_A_fkey" FOREIGN KEY ("A") REFERENCES "JobOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobOfferToSector" ADD CONSTRAINT "_JobOfferToSector_B_fkey" FOREIGN KEY ("B") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;
