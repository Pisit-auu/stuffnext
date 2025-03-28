-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('w', 'c');

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "assetid" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "availableValue" INTEGER NOT NULL DEFAULT 0,
    "unavailableValue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "idname" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "namelocation" TEXT NOT NULL,
    "nameteacher" TEXT,
    "categoryIdroom" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoryroom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categoryroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetLocation" (
    "id" SERIAL NOT NULL,
    "assetId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "inRoomaunavailableValue" INTEGER NOT NULL DEFAULT 0,
    "inRoomavailableValue" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AssetLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "surname" TEXT,
    "tel" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "borrow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayReturn" TIMESTAMP(3),
    "Borrowstatus" "Status" NOT NULL DEFAULT 'w',
    "ReturnStatus" "Status" NOT NULL DEFAULT 'w',
    "userId" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "valueBorrow" INTEGER NOT NULL DEFAULT 1,
    "borrowLocationId" TEXT NOT NULL,
    "returnLocationId" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "borrow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetid_key" ON "Asset"("assetid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_idname_key" ON "Category"("idname");

-- CreateIndex
CREATE UNIQUE INDEX "Location_namelocation_key" ON "Location"("namelocation");

-- CreateIndex
CREATE UNIQUE INDEX "Categoryroom_name_key" ON "Categoryroom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AssetLocation_assetId_locationId_key" ON "AssetLocation"("assetId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("idname") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_categoryIdroom_fkey" FOREIGN KEY ("categoryIdroom") REFERENCES "Categoryroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetLocation" ADD CONSTRAINT "AssetLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("namelocation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_borrowLocationId_fkey" FOREIGN KEY ("borrowLocationId") REFERENCES "Location"("namelocation") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
