/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "usuario_id",
ADD COLUMN     "user_id" TEXT;
