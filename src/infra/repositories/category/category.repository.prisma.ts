import { PrismaClient } from "@prisma/client";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryPrisma implements CategoryGateway {

    private constructor(private readonly prismaClient: PrismaClient){}

    public static create(prismaClient: PrismaClient){
        return new CategoryRepositoryPrisma(prismaClient);
    };

    public async save(input: Category): Promise<Category> {
        const data = {
            id: input.id,
            name: input.name,
            user_id: input.user_id,
        };

        const result = await this.prismaClient.category.create({ data });
        const output = Category.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id
        });
        return output;
    };

    public async list(user_id: string | null): Promise<Category[]> {
        const whereUserId = (user_id) ? { user_id } : {};
        const result = await this.prismaClient.category.findMany({
            where: { OR: [ { user_id: null }, { ...whereUserId } ] }
        });
        let output = [];
        for(const t of result){
            const category = Category.with({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            })
            output.push(category);
        };

        return output;
    };

};
