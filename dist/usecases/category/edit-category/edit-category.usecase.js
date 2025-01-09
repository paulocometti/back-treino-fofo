"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCategoryUsecase = void 0;
const category_1 = require("../../../domain/category/entities/category");
const user_1 = require("../../../domain/user/entities/user");
class EditCategoryUsecase {
    constructor(categoryGateway) {
        this.categoryGateway = categoryGateway;
    }
    static create(categoryGateway) {
        return new EditCategoryUsecase(categoryGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: categoryId, name: categoryName } = req;
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = category_1.Category.with({ id: categoryId, name: categoryName, user_id: userIdCondition });
            const found = yield this.categoryGateway.findByIdAndUserId({ id: categoryId, user_id: userIdCondition });
            if (found === false)
                throw new Error('A Categoria que você está tentando editar não existe!');
            const test = yield this.categoryGateway.existsByName(input);
            if (test === true)
                throw new Error('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
            const result = yield this.categoryGateway.update(input);
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(category) {
        const output = {
            id: category.id,
            name: category.name,
            user_id: category.user_id
        };
        return output;
    }
}
exports.EditCategoryUsecase = EditCategoryUsecase;
;
