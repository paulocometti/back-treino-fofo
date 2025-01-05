import { PrismaClient } from "@prisma/client";
import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { ExerciseGatewayExistsDTO, ExerciseGatewayFindByIdAndUserIdDTO, ExerciseGatewayListDTO, ExerciseGatewaySelectDTO } from "../../../domain/exercise/dtos/exercise-dtos";
import { Exercise } from "../../../domain/exercise/entities/exercise";

export class ExerciseRepositoryPrisma implements ExerciseGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new ExerciseRepositoryPrisma(prismaClient);
    };

    public async existsByName(input: ExerciseGatewayExistsDTO): Promise<boolean> {
        const { id, name, user_id } = input;

        const whereSameName = { name };
        
        const whereSameIdWhenUpdate = { not: id };
        const whereSameAdminOrUser = [ { user_id: null }, { user_id } ];

        let where: any = whereSameName;
        if (id) where.id = whereSameIdWhenUpdate;
        if (user_id) where.OR = whereSameAdminOrUser;

        const result = await this.prismaClient.exercise.findFirst({ where });
        if (result === null) return false;
        return true;
    };

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdDTO): Promise<boolean> {
        const { id, user_id } = input;
        const where = { id, user_id };
        const result = await this.prismaClient.exercise.findUnique({ where });
        if (result === null) return false;
        return true;
    };

    public async insert(input: Exercise): Promise<Exercise> {
        const { id, name, category_id, user_id } = input;
        const data = { id, name, category_id, user_id };
        const result = await this.prismaClient.exercise.create({ data });
        const output = Exercise.with({
            id: result.id,
            name: result.name,
            category_id: result.category_id,
            user_id: result.user_id
        });
        return output;
    };

    public async update(input: Exercise): Promise<Exercise> {
        const { id, name, category_id, user_id } = input;
        const data = { name, category_id };
        const where = { id,  user_id };
        const result = await this.prismaClient.exercise.update({ data, where });
        const output = Exercise.with({
            id: result.id,
            name: result.name,
            category_id: result.category_id,
            user_id: result.user_id
        });
        return output;
    };

    public async select(input: ExerciseGatewaySelectDTO): Promise<Exercise | null> {
        const { id, user_id } = input;

        let where: any = { id };
        const whereSameAdminOrUser = [ { user_id: null }, { user_id } ];
        const whereSameOnlyAdmin = { user_id: null };
        if(user_id) where.OR = whereSameAdminOrUser;
        else where = { ...where, ...whereSameOnlyAdmin }
 
        const result = await this.prismaClient.exercise.findUnique({ where });

        if (!result) return result;

        const output = Exercise.with({
            id: result.id,
            name: result.name,
            category_id: result.category_id,
            user_id: result.user_id
        });

        return output;
    };

    public async list(input: ExerciseGatewayListDTO): Promise<Exercise[]> {
        const { user_id } = input;
        const whereUserId = (user_id) ? { user_id } : {};
        const result = await this.prismaClient.exercise.findMany({
            where: { OR: [{ user_id: null }, { ...whereUserId }] }
        });
        let output = [];
        for (const t of result) {
            const exercise = Exercise.with({
                id: t.id,
                name: t.name,
                category_id: t.category_id,
                user_id: t.user_id
            })
            output.push(exercise);
        };

        return output;
    };

};
