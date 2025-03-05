-- DropForeignKey
ALTER TABLE "workout_day" DROP CONSTRAINT "workout_day_workout_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "workout_exercise" DROP CONSTRAINT "workout_exercise_workout_day_id_fkey";

-- AddForeignKey
ALTER TABLE "workout_day" ADD CONSTRAINT "workout_day_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercise" ADD CONSTRAINT "workout_exercise_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "workout_day"("id") ON DELETE CASCADE ON UPDATE CASCADE;
