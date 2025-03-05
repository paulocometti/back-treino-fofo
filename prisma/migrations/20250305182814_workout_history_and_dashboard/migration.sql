-- CreateTable
CREATE TABLE "workout_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workout_plan" TEXT,
    "workout_day" TEXT,
    "duration" INTEGER,
    "observation" VARCHAR(250),

    CONSTRAINT "workout_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workout_history_id_key" ON "workout_history"("id");

-- CreateIndex
CREATE INDEX "workout_history_user_id_created_date_idx" ON "workout_history"("user_id", "created_date");
