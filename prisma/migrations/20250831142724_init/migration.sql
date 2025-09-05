/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `ranking` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rank` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Player_email_key";

-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "ranking",
DROP COLUMN "updatedAt",
ADD COLUMN     "rank" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Match";
