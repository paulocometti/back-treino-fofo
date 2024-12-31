import { PrismaClient } from "@prisma/client";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { CategoryGatewayExistsDTO, CategoryGatewayListDTO, CategoryGatewaySelectDTO } from "../../../domain/category/dtos/category-dtos";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryPrisma implements CategoryGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new CategoryRepositoryPrisma(prismaClient);
    };

    public async existsByName(input: CategoryGatewayExistsDTO): Promise<boolean> {
        const { id, name, user_id } = input;
        let where: any = { name };

        if (id) where.id = { not: id };
        if (user_id)
            where.OR = [
                { user_id: null },
                { user_id }
            ];
        else 
            where.user_id = null;

        console.log("where >> ", where);
        const result = await this.prismaClient.category.findFirst({ where });
        console.log("test existsByName >> ", result);
        if (result === null) return false;
        return true;
    };

    public async insert(input: Category): Promise<Category> {
        const { id, name, user_id } = input;
        const data = { id, name, user_id };
        const result = await this.prismaClient.category.create({ data });
        const output = Category.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id
        });
        return output;
    };

    public async update(input: Category): Promise<Category> {
        const { id, name, user_id } = input;
        const data = { name };
        const where = { id, user_id };
        const result = await this.prismaClient.category.update({ data, where });
        const output = Category.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id
        });
        return output;
    };

    public async select(input: CategoryGatewaySelectDTO): Promise<Category | null> {
        const { id, user_id } = input;
        const result = await this.prismaClient.category.findUnique({
            where: { id, user_id }
        });

        if (!result) return result;

        const output = Category.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id
        });

        return output;
    };

    public async list(input: CategoryGatewayListDTO): Promise<Category[]> {
        const { user_id } = input;
        const whereUserId = (user_id) ? { user_id } : {};
        const result = await this.prismaClient.category.findMany({
            where: { OR: [{ user_id: null }, { ...whereUserId }] }
        });
        let output = [];
        for (const t of result) {
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
