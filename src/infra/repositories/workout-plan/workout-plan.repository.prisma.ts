import { PrismaClient } from "@prisma/client";
import { WorkoutPlan } from "../../../domain/workout-plan/entities/workout-plan";
import { WorkoutPlanGateway, WorkoutPlanGatewayDeleteInputDTO, WorkoutPlanGatewayListInputDTO, WorkoutPlanGatewaySelectInputDTO } from "../../../domain/workout-plan/workout-plan.gateway";
import { WorkoutExercise } from "../../../domain/workout-exercise/entities/workout-exercise";
import { WorkoutDay } from "../../../domain/workout-day/entities/workout-day";

export class WorkoutPlanRepositoryPrisma implements WorkoutPlanGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new WorkoutPlanRepositoryPrisma(prismaClient);
    };

    public async insert(input: WorkoutPlan): Promise<WorkoutPlan | null> {
        const { id: workoutPlanId, name: workoutPlanName, description: workoutDescription, user_id, workoutDays } = input;

        const dataWorkout = { id: workoutPlanId, name: workoutPlanName, description: workoutDescription, user_id };

        const workoutPlan = await this.prismaClient.workoutPlan.create({ data: dataWorkout });

        for (const t of workoutDays) {
            const { id: workoutDayId, name: workoutDayName, workoutExercises } = t;
            const workoutDay = await this.prismaClient.workoutDay.create({
                data: {
                    id: workoutDayId,
                    name: workoutDayName,
                    workoutPlan: { connect: { id: workoutPlan.id } }
                }
            });

            for (const th of workoutExercises) {
                const { id: workoutExerciseId, sets, reps, observation, exercise_id } = th;
                await this.prismaClient.workoutExercise.create({
                    data: {
                        id: workoutExerciseId,
                        sets,
                        reps,
                        observation,
                        exercise: { connect: { id: exercise_id } },
                        workoutDay: { connect: { id: workoutDay.id } }
                    }
                });
            };
        };

        const result = await this.prismaClient.workoutPlan.findUnique({
            where: { id: workoutPlan.id },
            include: {
                workoutDay: {
                    include: {
                        workoutExercise: {
                            include: {
                                exercise: {
                                    include: {
                                        categoryExercise: {
                                            include: {
                                                category: {
                                                    select: { name: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (result === null) return null;

        let resultWorkoutDays: WorkoutDay[] = [];
        let resultWorkoutExercises: WorkoutExercise[] = [];
        let resultCategoriesOfWorkoutExercises: string[] = [];
        for (const t of result.workoutDay) {

            for (const th of t.workoutExercise) {
                for (const tha of th.exercise.categoryExercise) {
                    resultCategoriesOfWorkoutExercises.push(tha.category.name);
                };
                const wExercise = WorkoutExercise.with({
                    id: th.id,
                    sets: th.sets,
                    reps: th.reps,
                    observation: th.observation,
                    exercise_id: th.exercise_id,
                    exercise: {
                        name: th.exercise.name,
                        categories: resultCategoriesOfWorkoutExercises
                    }
                });
                resultWorkoutExercises.push(wExercise);
            };

            const wDay = WorkoutDay.with({
                id: t.id,
                name: t.name,
                workoutExercises: resultWorkoutExercises
            });
            resultWorkoutDays.push(wDay);
        };

        const output = WorkoutPlan.with({
            id: result.id,
            name: result.name,
            description: result.description,
            user_id: result.user_id,
            workoutDays: resultWorkoutDays
        });

        return output;
    };

    public async delete(input: WorkoutPlanGatewayDeleteInputDTO): Promise<boolean> {
        const { id: workoutPlanId, user_id: userId } = input;
        const whereUserId = (userId) ? { user_id: userId } : {};

        const test = await this.prismaClient.workoutPlan.findUnique({
            where: { id: workoutPlanId, ...whereUserId },
        });
        if (test === null) return false;

        const result = await this.prismaClient.workoutPlan.delete({
            where: { id: workoutPlanId, ...whereUserId },
        });

        if (result === null) return false;
        return true;
    };

    public async select(input: WorkoutPlanGatewaySelectInputDTO): Promise<WorkoutPlan | null> {
        const { id: workoutPlanId, user_id: userId } = input;
        const whereUserId = (userId) ? { user_id: userId } : {};

        const result = await this.prismaClient.workoutPlan.findUnique({
            where: { id: workoutPlanId, ...whereUserId },
            include: {
                workoutDay: {
                    include: {
                        workoutExercise: {
                            include: {
                                exercise: {
                                    include: {
                                        categoryExercise: {
                                            include: {
                                                category: {
                                                    select: { name: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (result === null) return null;

        let resultWorkoutDays: WorkoutDay[] = [];
        let resultWorkoutExercises: WorkoutExercise[] = [];
        let resultCategoriesOfWorkoutExercises: string[] = [];
        for (const t of result.workoutDay) {

            for (const th of t.workoutExercise) {
                for (const tha of th.exercise.categoryExercise) {
                    resultCategoriesOfWorkoutExercises.push(tha.category.name);
                };
                const wExercise = WorkoutExercise.with({
                    id: th.id,
                    sets: th.sets,
                    reps: th.reps,
                    observation: th.observation,
                    exercise_id: th.exercise_id,
                    exercise: {
                        name: th.exercise.name,
                        categories: resultCategoriesOfWorkoutExercises
                    }
                });
                resultWorkoutExercises.push(wExercise);
            };

            const wDay = WorkoutDay.with({
                id: t.id,
                name: t.name,
                workoutExercises: resultWorkoutExercises
            });
            resultWorkoutDays.push(wDay);
        };

        const output = WorkoutPlan.with({
            id: result.id,
            name: result.name,
            description: result.description,
            user_id: result.user_id,
            workoutDays: resultWorkoutDays
        });

        return output;
    };

    public async list(input: WorkoutPlanGatewayListInputDTO): Promise<WorkoutPlan[]> {
        const { user_id: userId } = input;
        const whereUserId = (userId) ? { OR: [{ user_id: userId }, { user_id: null }] } : { user_id: null };

        const result = await this.prismaClient.workoutPlan.findMany({
            where: whereUserId,
            include: {
                workoutDay: {
                    include: {
                        workoutExercise: {
                            include: {
                                exercise: {
                                    include: {
                                        categoryExercise: {
                                            include: {
                                                category: {
                                                    select: { name: true }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        let output = [];
        for (const workout of result) {
            let resultWorkoutDays: WorkoutDay[] = [];
            let resultWorkoutExercises: WorkoutExercise[] = [];
            let resultCategoriesOfWorkoutExercises: string[] = [];
            for (const t of workout.workoutDay) {

                for (const th of t.workoutExercise) {
                    for (const tha of th.exercise.categoryExercise) {
                        resultCategoriesOfWorkoutExercises.push(tha.category.name);
                    };
                    const wExercise = WorkoutExercise.with({
                        id: th.id,
                        sets: th.sets,
                        reps: th.reps,
                        observation: th.observation,
                        exercise_id: th.exercise_id,
                        exercise: {
                            name: th.exercise.name,
                            categories: resultCategoriesOfWorkoutExercises
                        }
                    });
                    resultWorkoutExercises.push(wExercise);
                };

                const wDay = WorkoutDay.with({
                    id: t.id,
                    name: t.name,
                    workoutExercises: resultWorkoutExercises
                });
                resultWorkoutDays.push(wDay);
            };

            const workoutPlan = WorkoutPlan.with({
                id: workout.id,
                name: workout.name,
                description: workout.description,
                user_id: workout.user_id,
                workoutDays: resultWorkoutDays
            });
            output.push(workoutPlan);
        };

        return output;
    };
};
