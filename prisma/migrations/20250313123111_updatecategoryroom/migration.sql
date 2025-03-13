/*
  Warnings:

  - You are about to drop the column `idname` on the `Categoryroom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categoryroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryIdroom` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_id_fkey";

-- DropIndex
DROP INDEX "Categoryroom_idname_key";

-- AlterTable
ALTER TABLE "Categoryroom" DROP COLUMN "idname";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "categoryIdroom" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categoryroom_name_key" ON "Categoryroom"("name");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_categoryIdroom_fkey" FOREIGN KEY ("categoryIdroom") REFERENCES "Categoryroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
