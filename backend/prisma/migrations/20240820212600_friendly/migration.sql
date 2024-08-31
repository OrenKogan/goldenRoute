/*
  Warnings:

  - You are about to drop the column `latitude` on the `Friendly` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Friendly` table. All the data in the column will be lost.
  - You are about to drop the column `originCountry` on the `Friendly` table. All the data in the column will be lost.
  - Added the required column `LastContact` to the `Friendly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Latitude` to the `Friendly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Longitude` to the `Friendly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OriginCountry` to the `Friendly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendly" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "originCountry",
ADD COLUMN     "LastContact" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "OriginCountry" TEXT NOT NULL;
