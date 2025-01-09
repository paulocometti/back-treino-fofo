import { PrismaClient } from "@prisma/client";
import { CategoryGateway, CategoryGatewayExistsByNameInputDto, CategoryGatewayFindByIdAndUserIdInputDTO, CategoryGatewayFindByIdInputDTO, CategoryGatewayListInputDTO, CategoryGatewaySelectInputDTO } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryPrisma implements CategoryGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new CategoryRepositoryPrisma(prismaClient);
    };

    public async existsByName(input: CategoryGatewayExistsByNameInputDto): Promise<boolean> {
        const { id, name, user_id } = input;

        const whereSameName = { name };

        const whereSameIdWhenUpdate = { not: id };
        const whereSameAdminOrUser = [{ user_id: null }, { user_id }];

        let where: any = whereSameName;
        if (id) where.id = whereSameIdWhenUpdate;
        if (user_id) where.OR = whereSameAdminOrUser;

        const result = await this.prismaClient.category.findFirst({ where });
        if (result === null) return false;
        return true;
    };

    public async findById(input: CategoryGatewayFindByIdInputDTO): Promise<boolean> {
        const { id } = input;
        const where = { id };
        const result = await this.prismaClient.category.findUnique({ where });
        if (result === null) return false;
        return true;
    };

    public async findByIdAndUserId(input: CategoryGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        const where = { id, user_id };
        const result = await this.prismaClient.category.findUnique({ where });
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

    public async select(input: CategoryGatewaySelectInputDTO): Promise<Category | null> {
        const { id, user_id } = input;

        let where: any = { id };
        const whereSameAdminOrUser = [{ user_id: null }, { user_id }];
        const whereSameOnlyAdmin = { user_id: null };
        if (user_id) where.OR = whereSameAdminOrUser;
        else where = { ...where, ...whereSameOnlyAdmin }

        const result = await this.prismaClient.category.findUnique({ where });

        if (!result) return result;

        const output = Category.with({
            id: result.id,
            name: result.name,
            user_id: result.user_id
        });

        return output;
    };

    public async list(input: CategoryGatewayListInputDTO): Promise<Category[]> {
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
