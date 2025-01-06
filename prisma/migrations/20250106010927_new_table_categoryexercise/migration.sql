/*
  Warnings:

  - You are about to drop the column `category_id` on the `exercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_category_id_fkey";

-- AlterTable
ALTER TABLE "exercise" DROP COLUMN "category_id";

-- CreateTable
CREATE TABLE "category_exercise" (
    "exercise_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "category_exercise_pkey" PRIMARY KEY ("exercise_id","category_id")
);

-- AddForeignKey
ALTER TABLE "category_exercise" ADD CONSTRAINT "category_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_exercise" ADD CONSTRAINT "category_exercise_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
