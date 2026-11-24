/*
  Warnings:

  - You are about to drop the column `estado` on the `learning_routes` table. All the data in the column will be lost.
  - You are about to drop the column `resultado` on the `recommendations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "learning_routes" DROP COLUMN "estado";

-- AlterTable
ALTER TABLE "recommendations" DROP COLUMN "resultado";
