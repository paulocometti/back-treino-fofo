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
exports.SelectCategoryUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class SelectCategoryUsecase {
    constructor(categoryGateway) {
        this.categoryGateway = categoryGateway;
    }
    static create(categoryGateway) {
        return new SelectCategoryUsecase(categoryGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req;
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { id, user_id: userIdCondition };
            const aCategory = yield this.categoryGateway.select(input);
            if (aCategory === null)
                throw new Error('Nada encontrado.');
            const output = this.presentOutput(aCategory);
            return output;
        });
    }
    ;
    presentOutput(category) {
        const output = { id: category.id, name: category.name, user_id: category.user_id };
        return { category: output };
    }
    ;
}
exports.SelectCategoryUsecase = SelectCategoryUsecase;
;
