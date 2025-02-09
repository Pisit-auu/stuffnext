-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "namelocation" TEXT NOT NULL,
    "nameteacher" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);
