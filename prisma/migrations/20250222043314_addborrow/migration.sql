-- CreateEnum
CREATE TYPE "Status" AS ENUM ('w', 'c');

-- CreateTable
CREATE TABLE "borrow" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayReturn" TIMESTAMP(3),
    "Borrowstatus" "Status" NOT NULL DEFAULT 'w',
    "ReturnStatus" "Status" NOT NULL DEFAULT 'w',
    "userId" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "valueBorrow" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "borrow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borrow" ADD CONSTRAINT "borrow_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("namelocation") ON DELETE CASCADE ON UPDATE CASCADE;
