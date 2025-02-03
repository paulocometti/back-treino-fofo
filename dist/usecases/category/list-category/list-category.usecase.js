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
exports.ListCategoryUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class ListCategoryUsecase {
    constructor(categoryGateway) {
        this.categoryGateway = categoryGateway;
    }
    static create(categoryGateway) {
        return new ListCategoryUsecase(categoryGateway);
    }
    ;
    execute(_, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { user_id: userIdCondition };
            const aCategories = yield this.categoryGateway.list(input);
            const output = this.presentOutput(aCategories);
            return output;
        });
    }
    ;
    presentOutput(categories) {
        let formatCategories = [];
        for (const t of categories)
            formatCategories.push({ id: t.id, name: t.name });
        return { categories: formatCategories };
    }
    ;
}
exports.ListCategoryUsecase = ListCategoryUsecase;
;
