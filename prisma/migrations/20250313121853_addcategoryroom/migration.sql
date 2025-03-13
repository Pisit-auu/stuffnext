-- CreateTable
CREATE TABLE "Categoryroom" (
    "id" SERIAL NOT NULL,
    "idname" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categoryroom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoryroom_idname_key" ON "Categoryroom"("idname");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_id_fkey" FOREIGN KEY ("id") REFERENCES "Categoryroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
