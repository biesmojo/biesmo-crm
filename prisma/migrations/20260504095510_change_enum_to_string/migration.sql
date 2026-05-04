/*
  Warnings:

  - The `status` column on the `clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stage` column on the `deals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PROSPECT';

-- AlterTable
ALTER TABLE "deals" DROP COLUMN "stage",
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'LEAD';

-- DropEnum
DROP TYPE "ClientStatus";

-- DropEnum
DROP TYPE "DealStage";
