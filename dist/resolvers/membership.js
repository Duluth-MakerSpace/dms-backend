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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipResolver = void 0;
const data_source_1 = require("../data-source");
const type_graphql_1 = require("type-graphql");
const Membership_1 = require("../entities/Membership");
const User_1 = require("../entities/User");
const types_1 = require("../types");
const isAuth_1 = require("../middleware/isAuth");
let CreateMembershipResponse = class CreateMembershipResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CreateMembershipResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Membership_1.Membership, { nullable: true }),
    __metadata("design:type", Membership_1.Membership)
], CreateMembershipResponse.prototype, "membership", void 0);
CreateMembershipResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CreateMembershipResponse);
let MembershipResponse = class MembershipResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MembershipResponse.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", Object)
], MembershipResponse.prototype, "expirationDate", void 0);
MembershipResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], MembershipResponse);
let MembershipResolver = class MembershipResolver {
    memberships() {
        return Membership_1.Membership.find({
            relations: ['user'],
            order: { createdAt: "DESC" }
        });
    }
    async membership(userUuid, { req }) {
        if (!userUuid) {
            userUuid = req.session.uuid;
        }
        const user = await User_1.User.findOne({ where: { uuid: userUuid } });
        if (!user) {
            return null;
        }
        const memberships = await data_source_1.AppDataSource.getRepository(Membership_1.Membership).find({
            relations: {
                user: true
            },
            where: {
                user: {
                    uuid: userUuid
                }
            },
        });
        if (memberships.length === 0) {
            return {
                status: "Non-member",
                expirationDate: null
            };
        }
        console.log("Memberships for ", user.name, ": ", memberships);
        const activeMemberships = memberships.filter(m => !m.isExpired());
        if (!activeMemberships.length) {
            return {
                status: "expired",
                expirationDate: new Date(Math.max(...memberships.map(m => m.expiresAt().getTime())))
            };
        }
        const now = Date.now();
        console.log(activeMemberships);
        const msRemaining = activeMemberships.reduce((accumulator, currentValue) => accumulator + (currentValue.expiresAt().getTime() - now), 0);
        return {
            status: "active",
            expirationDate: new Date(now + msRemaining)
        };
    }
    async createMembership(type, days, cost, { req }) {
        const user = await User_1.User.findOne({ where: { uuid: req.session.uuid } });
        if (!user) {
            return { errors: [{ field: "user", message: "User not found" }] };
        }
        let membership;
        try {
            membership = await Membership_1.Membership.create({
                type: type,
                days: days,
                cost: cost,
                user: user,
            }).save();
        }
        catch (err) {
            console.log("Create membership error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] };
        }
        return { membership: membership };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Membership_1.Membership]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembershipResolver.prototype, "memberships", null);
__decorate([
    (0, type_graphql_1.Query)(() => MembershipResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('userUuid', () => String, { nullable: true })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MembershipResolver.prototype, "membership", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CreateMembershipResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('type', () => String)),
    __param(1, (0, type_graphql_1.Arg)('days', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)('cost', () => type_graphql_1.Float)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MembershipResolver.prototype, "createMembership", null);
MembershipResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MembershipResolver);
exports.MembershipResolver = MembershipResolver;
