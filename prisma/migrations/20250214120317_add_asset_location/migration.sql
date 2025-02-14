-- CreateTable
CREATE TABLE "AssetLocation" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AssetLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetLocation_assetId_locationId_key" ON "AssetLocation"("assetId", "locationId");

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
