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
exports.LoginKeycloakUsecase = void 0;
const jwt_decode_1 = require("jwt-decode");
class LoginKeycloakUsecase {
    constructor(keycloakGateway) {
        this.keycloakGateway = keycloakGateway;
    }
    static create(keycloakGateway) {
        return new LoginKeycloakUsecase(keycloakGateway);
    }
    ;
    execute(req, _) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req;
            const input = { email, password };
            const user = yield this.keycloakGateway.login(input);
            const decoded = (0, jwt_decode_1.jwtDecode)(user === null || user === void 0 ? void 0 : user.access_token);
            if (decoded.email_verified) {
                const emailIsNotCreatedOnUserProfile = !(yield this.keycloakGateway.checkEmailIsAlreadyCreated(decoded.email));
                if (emailIsNotCreatedOnUserProfile)
                    throw new Error();
                //await this.keycloakGateway.insert({ email: decoded.email });
            }
            ;
            const result = Object.assign({ email_verified: decoded.email_verified }, user);
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(input) {
        return { user: input };
    }
    ;
}
exports.LoginKeycloakUsecase = LoginKeycloakUsecase;
;
