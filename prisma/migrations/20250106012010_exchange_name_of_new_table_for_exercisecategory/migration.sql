/*
  Warnings:

  - You are about to drop the `category_exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "category_exercise" DROP CONSTRAINT "category_exercise_category_id_fkey";

-- DropForeignKey
ALTER TABLE "category_exercise" DROP CONSTRAINT "category_exercise_exercise_id_fkey";

-- DropTable
DROP TABLE "category_exercise";

-- CreateTable
CREATE TABLE "exercise_category" (
    "exercise_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "exercise_category_pkey" PRIMARY KEY ("exercise_id","category_id")
);

-- AddForeignKey
ALTER TABLE "exercise_category" ADD CONSTRAINT "exercise_category_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_category" ADD CONSTRAINT "exercise_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
