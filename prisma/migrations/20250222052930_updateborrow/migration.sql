/*
  Warnings:

  - You are about to drop the column `locationId` on the `borrow` table. All the data in the column will be lost.
  - Added the required column `borrowLocationId` to the `borrow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnLocationId` to the `borrow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "borrow" DROP CONSTRAINT "borrow_locationId_fkey";

-- AlterTable
ALTER TABLE "borrow" DROP COLUMN "locationId",
ADD COLUMN     "borrowLocationId" TEXT NOT NULL,
ADD COLUMN     "returnLocationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_borrowLocationId_fkey" FOREIGN KEY ("borrowLocationId") REFERENCES "Location"("namelocation") ON DELETE CASCADE ON UPDATE CASCADE;
