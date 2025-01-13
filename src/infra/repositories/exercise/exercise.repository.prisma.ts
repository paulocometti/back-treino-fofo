import { PrismaClient } from "@prisma/client";
import { ExerciseGateway, ExerciseGatewayExistsxistsByNameInputDTO, ExerciseGatewayFindByIdAndUserIdInputDTO, ExerciseGatewayListInputDTO, ExerciseGatewaySelectInputDTO } from "../../../domain/exercise/gateway/exercise.gateway";
import { Exercise } from "../../../domain/exercise/entities/exercise";
import { Category } from "../../../domain/category/entities/category";

export class ExerciseRepositoryPrisma implements ExerciseGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new ExerciseRepositoryPrisma(prismaClient);
    };

    private async transformCategoryExerciseInCategory(categoryExercise: { exercise_id: string; category_id: string; category: { id: string; name: string; user_id: string | null; }; }[]): Promise<Category[]> {
        let resultCategories: Category[] = [];
        for (const t of categoryExercise) {
            const aCategory: Category = Category.with(t.category);
            resultCategories.push(aCategory);
        };
        return resultCategories;
    };

    public async existsByName(input: ExerciseGatewayExistsxistsByNameInputDTO): Promise<boolean> {
        const { id, name, user_id } = input;

        const whereSameName = { name };

        const whereSameIdWhenUpdate = { not: id };
        const whereSameAdminOrUser = [{ user_id: null }, { user_id }];

        let where: any = whereSameName;
        if (id) where.id = whereSameIdWhenUpdate;
        if (user_id) where.OR = whereSameAdminOrUser;

        const result = await this.prismaClient.exercise.findFirst({ where });
        if (result === null) return false;
        return true;
    };

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        const where = { id, user_id };
        const result = await this.prismaClient.exercise.findUnique({ where });
        if (result === null) return false;
        return true;
    };

    public async insert(input: Exercise): Promise<Exercise | null> {
        const { id, name, user_id, categories } = input;
        const data = { id, name, user_id };

        const exercise = await this.prismaClient.exercise.create({ data });

        for (const t of categories) {
            await this.prismaClient.exerciseCategory.create({
                data: {
                    exercise: { connect: { id: exercise.id }},
                    category: { connect: { id: t.id }}
                }
            });
        };

        const result = await this.prismaClient.exercise.findUnique({
            where: { id: exercise.id }, include: { categoryExercise: { include: { category: true } } }
        });

        if(result === null) return null;
        const resultCategories: Category[] = await this.transformCategoryExerciseInCategory(result.categoryExercise);
        const output = Exercise.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id,
            categories: resultCategories
        });
        return output;
    };

    public async update(input: Exercise): Promise<Exercise | null> {
        const { id, name, user_id, categories } = input;
        const data = { name };
        const where = { id, user_id };
        
        const exercise = await this.prismaClient.exercise.update({ data, where });
        await this.prismaClient.exerciseCategory.deleteMany({ where: { exercise_id: exercise.id } });

 
        for (const t of categories) {
            await this.prismaClient.exerciseCategory.create({
                data: {
                    exercise: { connect: { id: exercise.id }},
                    category: { connect: { id: t.id }}
                }
            });
        };
        
        const result = await this.prismaClient.exercise.findUnique({
            where: { id: exercise.id }, include: { categoryExercise: { include: { category: true } } }
        });

        if(result === null) return null;
        const resultCategories: Category[] = await this.transformCategoryExerciseInCategory(result.categoryExercise);
        const output = Exercise.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id,
            categories: resultCategories
        });
        return output;
    };

    public async select(input: ExerciseGatewaySelectInputDTO): Promise<Exercise | null> {
        const { id, user_id } = input;

        let where: any = { id };
        const whereSameAdminOrUser = [{ user_id: null }, { user_id }];
        const whereSameOnlyAdmin = { user_id: null };
        if (user_id) where.OR = whereSameAdminOrUser;
        else where = { ...where, ...whereSameOnlyAdmin };

        const result = await this.prismaClient.exercise.findUnique({
            include: { categoryExercise: { include: { category: true } } },
            where
        });

        if (!result) return result;

        const resultCategories: Category[] = await this.transformCategoryExerciseInCategory(result.categoryExercise);
        const output = Exercise.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id,
            categories: resultCategories
        });

        return output;
    };

    public async list(input: ExerciseGatewayListInputDTO): Promise<Exercise[]> {
        const { user_id } = input;
        const whereUserId = (user_id) ? { user_id } : {};
        const result = await this.prismaClient.exercise.findMany({
            include: { categoryExercise: { include: { category: true } } },
            where: { OR: [{ user_id: null }, { ...whereUserId }] }
        });
        let output = [];

        for (const t of result) {
            const resultCategories: Category[] = await this.transformCategoryExerciseInCategory(t.categoryExercise);
            const exercise = Exercise.with({
                id: t.id,
                name: t.name,
                user_id: t.user_id,
                categories: resultCategories
            })
            output.push(exercise);
        };

        return output;
    };

};
