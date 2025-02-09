/*
  Warnings:

  - A unique constraint covering the columns `[namelocation]` on the table `Location` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Location_namelocation_key" ON "Location"("namelocation");
