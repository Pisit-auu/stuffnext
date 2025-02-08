/*
  Warnings:

  - A unique constraint covering the columns `[assetid]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetid_key" ON "Asset"("assetid");
