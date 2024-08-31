/*
  Warnings:

  - Changed the type of `LastContact` on the `Friendly` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Friendly" DROP COLUMN "LastContact",
ADD COLUMN     "LastContact" TIMESTAMP(3) NOT NULL;
