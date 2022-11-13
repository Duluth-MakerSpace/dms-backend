"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const nanoid_1 = require("nanoid");
const sendEmail_1 = require("../utils/sendEmail");
const validateForms_1 = require("../utils/validateForms");
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
let UserResolver = class UserResolver {
    me({ req }) {
        if (!req.session.uuid) {
            return null;
        }
        return User_1.User.findOne({ where: { uuid: req.session.uuid } });
    }
    async forgotPassword(email, { redisClient }) {
        const user = await User_1.User.findOne({ where: { email: email } });
        if (!user) {
            return true;
        }
        const token = (0, nanoid_1.nanoid)(10) + "-easter-egg-" + (0, nanoid_1.nanoid)(10);
        await redisClient.set(constants_1.FORGOT_PASS_PREFIX + token, user.uuid, "EX", 1000 * 60 * 60 * 24 * 2);
        await (0, sendEmail_1.sendEmail)(email, "Reset your password 🔐", `Click to <a href='http://localhost:3000/reset-password/${token}'>reset your password</a>. This link will expire in 48 hours.`);
        return true;
    }
    async changePassword(token, password, { req, redisClient }) {
        const errors = (0, validateForms_1.getPasswordErrors)(password);
        if (errors) {
            return { errors: errors };
        }
        const key = constants_1.FORGOT_PASS_PREFIX + token;
        const uuid = await redisClient.get(key);
        if (!uuid) {
            return { errors: [{ field: "token", message: "Invalid expiry token. Either your link has expired, your link has already been used, or something strange has happened." }] };
        }
        const user = await User_1.User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return { errors: [{ field: "token", message: "User not found!" }] };
        }
        await User_1.User.update({ uuid: uuid }, { password: await argon2_1.default.hash(password) });
        await redisClient.del(key);
        req.session.uuid = user.uuid;
        return { user };
    }
    users() {
        return User_1.User.find();
    }
    user(uuid) {
        return User_1.User.findOne({ where: { uuid: uuid } });
    }
    async createUser(email, username, password, name, phone, emerg_contact, newsletter, privacy_level, { req }) {
        const errors = (0, validateForms_1.getRegisterErrors)(email, password, username);
        if (errors) {
            return { errors: errors };
        }
        const hash = await argon2_1.default.hash(password);
        let user;
        try {
            user = await User_1.User.create({
                email: email,
                username: username,
                password: hash,
                name: name ? name : "TODO",
                phone: phone ? phone : "TODO",
                emerg_contact: emerg_contact ? emerg_contact : "TODO",
                newsletter: newsletter,
                privacy_level: privacy_level
            }).save();
            req.session.uuid = user.uuid;
        }
        catch (err) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Email already exists" }] };
            }
            console.log("Registration error:", err);
        }
        return { user };
    }
    async login(usernameOrEmail, password, { req }) {
        usernameOrEmail = usernameOrEmail.toLowerCase();
        const user = await User_1.User.findOne(usernameOrEmail.includes("@")
            ? { where: { email: usernameOrEmail } }
            : { where: { username: usernameOrEmail } });
        if (!user) {
            return {
                errors: [{ field: 'usernameOrEmail', message: 'User not found' }]
            };
        }
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{ field: 'password', message: 'Incorrect password' }]
            };
        }
        req.session.uuid = user.uuid;
        return { user };
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.error(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
    async updateUser(uuid, title) {
        const user = await User_1.User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await User_1.User.update({ uuid }, { title });
        }
        return user;
    }
    async deleteUser(uuid) {
        try {
            await User_1.User.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('email', () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('token', () => String)),
    __param(1, (0, type_graphql_1.Arg)('password', () => String)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('email', () => String)),
    __param(1, (0, type_graphql_1.Arg)('username', () => String)),
    __param(2, (0, type_graphql_1.Arg)('password', () => String)),
    __param(3, (0, type_graphql_1.Arg)('name', () => String, { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('phone', () => String, { nullable: true })),
    __param(5, (0, type_graphql_1.Arg)('emerg_contact', () => String, { nullable: true })),
    __param(6, (0, type_graphql_1.Arg)('newsletter', () => Boolean)),
    __param(7, (0, type_graphql_1.Arg)('privacy_level', () => type_graphql_1.Int)),
    __param(8, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object, Object, Boolean, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('usernameOrEmail')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
