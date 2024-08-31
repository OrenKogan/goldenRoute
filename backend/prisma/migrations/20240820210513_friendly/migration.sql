/*
  Warnings:

  - Added the required column `friendlyId` to the `Attacks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attacks" ADD COLUMN     "friendlyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Friendly" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "Callsign" TEXT NOT NULL,
    "Closest_Airport" TEXT NOT NULL,
    "ICAO24" TEXT NOT NULL,

    CONSTRAINT "Friendly_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attacks_friendlyId_idx" ON "Attacks"("friendlyId");
