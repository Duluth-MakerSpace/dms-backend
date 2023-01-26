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
const argon2_1 = __importDefault(require("argon2"));
const class_validator_1 = require("class-validator");
const nanoid_1 = require("nanoid");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middleware/isAuth");
const types_1 = require("../types");
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
let GetUsersArgs = class GetUsersArgs {
    constructor() {
        this.limit = 5;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], GetUsersArgs.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetUsersArgs.prototype, "cursor", void 0);
GetUsersArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], GetUsersArgs);
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.uuid === user.uuid || req.session.accessLevel >= 3) {
            return user.email;
        }
        return "";
    }
    me({ req }) {
        if (!req.session.uuid) {
            return null;
        }
        return User_1.User.findOne({
            where: { uuid: req.session.uuid },
            relations: ['title']
        });
    }
    async forgotPassword(email, { redisClient }) {
        const user = await User_1.User.findOne({ where: { email: email } });
        if (!user) {
            return true;
        }
        const token = (0, nanoid_1.nanoid)(10) + "-easter-egg-" + (0, nanoid_1.nanoid)(10);
        await redisClient.set(constants_1.FORGOT_PASS_PREFIX + token, user.uuid, "EX", 1000 * 60 * 60 * 24 * 2);
        await (0, sendEmail_1.sendEmail)(email, "Reset your password 🔐", `Click to <a href='${constants_1.FRONTEND_URL}/reset-password/${token}'>reset your password</a>. This link will expire in 48 hours.`);
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
        req.session.accessLevel = user.accessLevel;
        return { user };
    }
    users({ limit, cursor }) {
        const whereClause = Object.assign({}, (cursor && { createdAt: (0, typeorm_1.LessThan)(cursor) }));
        return User_1.User.find({
            where: whereClause,
            relations: ['posts', 'title'],
            take: limit,
            order: { id: "ASC" }
        });
    }
    usersSearch(search) {
        return User_1.User.find({
            where: [
                { name: (0, typeorm_1.ILike)(`%${search}%`) },
            ],
            take: 10,
            cache: 30000
        });
    }
    user(uuid) {
        return User_1.User.findOne({
            where: { uuid: uuid },
            relations: ['posts', 'title']
        });
    }
    async createUser(email, name, password, phone, emergPhone, emergContact, waivered, newsletter, privacyLevel, { req }) {
        const errors = (0, validateForms_1.getRegisterErrors)(email, password, name);
        if (errors) {
            return { errors: errors };
        }
        const hash = await argon2_1.default.hash(password);
        let user;
        try {
            user = await User_1.User.create({
                email: email,
                name: name,
                password: hash,
                phone: phone,
                emergPhone: emergPhone,
                emergContact: emergContact,
                waivered: waivered,
                newsletter: newsletter,
                privacyLevel: privacyLevel
            }).save();
            req.session.uuid = user.uuid;
            req.session.accessLevel = user.accessLevel;
        }
        catch (err) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Email/name already exists" }] };
            }
            console.log("Registration error:", err);
        }
        return { user };
    }
    async login(email, password, { req }) {
        email = email.toLowerCase();
        const user = await User_1.User.findOne({ where: { email: email } });
        if (!user) {
            return {
                errors: [{ field: 'email', message: 'User not found' }]
            };
        }
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{ field: 'password', message: 'Incorrect password' }]
            };
        }
        req.session.uuid = user.uuid;
        req.session.accessLevel = user.accessLevel;
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
    async rfidLogin(rfid, durationSeconds, { redisClient }) {
        const user = await User_1.User.findOne({ where: { rfid: rfid } });
        if (!user) {
            return false;
        }
        await redisClient.set(constants_1.RFID_PREFIX + rfid, user.uuid, "EX", durationSeconds);
        return true;
    }
    async rfidLogout(uuid, { redisClient }) {
        const user = await User_1.User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return false;
        }
        await redisClient.del(constants_1.RFID_PREFIX + user.rfid);
        return true;
    }
    async rfids({ redisClient }) {
        const keys = await redisClient.keys(`${constants_1.RFID_PREFIX}*`);
        if (keys.length === 0) {
            return [];
        }
        const values = await redisClient.mget(keys);
        return values;
    }
    async updateUser(uuid, bio) {
        const user = await User_1.User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return null;
        }
        if (typeof bio !== 'undefined') {
            await User_1.User.update({ uuid }, { bio });
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
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
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
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetUsersArgs]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Arg)('search', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "usersSearch", null);
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
    __param(1, (0, type_graphql_1.Arg)('name', () => String)),
    __param(2, (0, type_graphql_1.Arg)('password', () => String)),
    __param(3, (0, type_graphql_1.Arg)('phone', () => String)),
    __param(4, (0, type_graphql_1.Arg)('emergPhone', () => String)),
    __param(5, (0, type_graphql_1.Arg)('emergContact', () => String)),
    __param(6, (0, type_graphql_1.Arg)('waivered', () => Boolean)),
    __param(7, (0, type_graphql_1.Arg)('newsletter', () => Boolean)),
    __param(8, (0, type_graphql_1.Arg)('privacyLevel', () => type_graphql_1.Int)),
    __param(9, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Boolean, Boolean, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
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
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('rfid')),
    __param(1, (0, type_graphql_1.Arg)('durationSeconds', () => type_graphql_1.Int, { defaultValue: 30 })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rfidLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('uuid')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rfidLogout", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "rfids", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_1.User, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('bio', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
