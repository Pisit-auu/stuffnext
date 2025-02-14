/*
  Warnings:

  - You are about to drop the column `quantity` on the `AssetLocation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetLocation" DROP CONSTRAINT "AssetLocation_assetId_fkey";

-- DropForeignKey
ALTER TABLE "AssetLocation" DROP CONSTRAINT "AssetLocation_locationId_fkey";

-- AlterTable
ALTER TABLE "AssetLocation" DROP COLUMN "quantity",
ADD COLUMN     "inRoomaunavailableValue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "inRoomavailableValue" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "assetId" SET DATA TYPE TEXT,
ALTER COLUMN "locationId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("namelocation") ON DELETE CASCADE ON UPDATE CASCADE;
