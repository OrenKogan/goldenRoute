/*
  Warnings:

  - Added the required column `OnGround` to the `Friendly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendly" ADD COLUMN     "OnGround" BOOLEAN NOT NULL;
