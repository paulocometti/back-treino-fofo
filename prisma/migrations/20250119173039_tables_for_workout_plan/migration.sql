-- CreateTable
CREATE TABLE "workout_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "workout_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_day" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workout_plan_id" TEXT NOT NULL,

    CONSTRAINT "workout_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercise" (
    "id" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "observation" TEXT,
    "exercise_id" TEXT NOT NULL,
    "workout_day_id" TEXT NOT NULL,

    CONSTRAINT "workout_exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workout_plan_id_key" ON "workout_plan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_day_id_key" ON "workout_day"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workout_exercise_id_key" ON "workout_exercise"("id");

-- AddForeignKey
ALTER TABLE "workout_day" ADD CONSTRAINT "workout_day_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "workout_day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
