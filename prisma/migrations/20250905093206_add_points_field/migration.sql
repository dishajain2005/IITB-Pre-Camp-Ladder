/*
  Warnings:

  - You are about to drop the column `rank` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Player" DROP COLUMN "rank",
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
