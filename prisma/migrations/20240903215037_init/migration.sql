-- CreateTable
CREATE TABLE "Measure" (
    "id" SERIAL NOT NULL,
    "customerCode" TEXT NOT NULL,
    "measureDatetime" TIMESTAMP(3) NOT NULL,
    "measureType" TEXT NOT NULL,
    "measureValue" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "measureUuid" TEXT NOT NULL,
    "confirmedValue" INTEGER,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Measure_measureUuid_key" ON "Measure"("measureUuid");
