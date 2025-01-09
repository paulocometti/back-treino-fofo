"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.schemaUser = void 0;
const zod_1 = require("zod");
exports.schemaUser = zod_1.z.object({
    id: zod_1.z.string().trim(),
    name: zod_1.z.string().trim(),
    role: zod_1.z.enum(['USER', 'ADMIN'])
});
class User {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    ;
    static create() {
    }
    ;
    static with(props) {
        return new User(props);
    }
    ;
    get id() {
        return this.props.id;
    }
    ;
    get name() {
        return this.props.name;
    }
    ;
    get role() {
        return this.props.role;
    }
    ;
    validate() {
        const isValidUser = exports.schemaUser.safeParse(this.props);
        if (!isValidUser.success)
            throw new Error('O usuário não foi informado. Faça login novamente, por favor!');
    }
    ;
}
exports.User = User;
;
