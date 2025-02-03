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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakRepository = void 0;
const axios_1 = __importDefault(require("axios"));
class KeycloakRepository {
    constructor() { }
    static create() {
        return new KeycloakRepository();
    }
    ;
    getTokenAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const kcUrlMasterGetToken = process.env.KC_URL + "/realms/master/protocol/openid-connect/token";
            const formattedData = new URLSearchParams();
            const kcAdminClient = process.env.KC_ADMIN_CLIENT;
            const kcAdminSecret = process.env.KC_ADMIN_SECRET;
            formattedData.append('client_id', kcAdminClient);
            formattedData.append('client_secret', kcAdminSecret);
            formattedData.append('grant_type', 'client_credentials');
            const optionsGetToken = {
                method: 'POST',
                url: kcUrlMasterGetToken,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formattedData.toString(),
            };
            const result = yield (0, axios_1.default)(optionsGetToken);
            if (typeof (result === null || result === void 0 ? void 0 : result.data.access_token) !== `string`)
                return null;
            const tokenAdmin = result.data.access_token;
            return tokenAdmin;
        });
    }
    ;
    checkEmailIsAlreadyCreated(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const kcUrlCheckUser = `${process.env.KC_URL}/admin/realms/login/users?email=${encodeURIComponent(email)}`;
            const tokenAdmin = yield this.getTokenAdmin();
            const optionsCheckUser = {
                method: 'GET',
                url: kcUrlCheckUser,
                headers: { 'Authorization': 'Bearer ' + tokenAdmin, },
            };
            const result = yield (0, axios_1.default)(optionsCheckUser);
            if (result.status === 200 && result.data && result.data.length > 0)
                return true;
            return false;
        });
    }
    ;
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const kcUrlLoginManagementUsers = process.env.KC_URL + "/admin/realms/login/users";
            const tokenAdmin = yield this.getTokenAdmin();
            const formattedData = {
                enabled: true,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                credentials: [{
                        type: "password",
                        value: data.password,
                        temporary: false
                    }]
            };
            const optionsCreateUser = {
                method: 'POST',
                url: kcUrlLoginManagementUsers,
                headers: {
                    'Authorization': 'Bearer ' + tokenAdmin,
                },
                data: formattedData,
            };
            const result = yield (0, axios_1.default)(optionsCreateUser);
            return (result === null || result === void 0 ? void 0 : result.data) || null;
            // if (error.response && error.response.status === 409) 
            //    throw new Error("Erro: Usuário já cadastrado com este e-mail!");
            //throw new Error("Erro ao tentar cadastrar!");
        });
    }
    ;
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const kcUrlLoginGetToken = process.env.KC_URL + "/realms/login/protocol/openid-connect/token";
            const { email, password } = data;
            const formattedData = new URLSearchParams();
            const kcLoginClient = process.env.KC_LOGIN_CLIENT;
            const kcLoginSecret = process.env.KC_LOGIN_SECRET;
            formattedData.append('client_id', kcLoginClient);
            formattedData.append('client_secret', kcLoginSecret);
            formattedData.append('username', email);
            formattedData.append('password', password);
            formattedData.append('grant_type', 'password');
            const optionsGetToken = {
                method: 'POST',
                url: kcUrlLoginGetToken,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formattedData.toString()
            };
            const result = yield (0, axios_1.default)(optionsGetToken);
            if (typeof (result === null || result === void 0 ? void 0 : result.data.access_token) !== `string`)
                return null;
            return result.data;
        });
    }
    ;
}
exports.KeycloakRepository = KeycloakRepository;
;
