/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT,
    "category_id" TEXT,

    CONSTRAINT "exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exercise_id_key" ON "exercise"("id");

-- CreateIndex
CREATE UNIQUE INDEX "category_id_key" ON "category"("id");

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
