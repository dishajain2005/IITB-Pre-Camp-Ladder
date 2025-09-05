/*
  Warnings:

  - A unique constraint covering the columns `[name,sport]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_name_sport_key" ON "public"."Player"("name", "sport");
