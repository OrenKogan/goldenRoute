/*
  Warnings:

  - Added the required column `originCountry` to the `Friendly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendly" ADD COLUMN     "originCountry" TEXT NOT NULL;
