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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const CustomBaseEntity_1 = require("./CustomBaseEntity");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const CalendarClass_1 = require("./CalendarClass");
const Post_1 = require("./Post");
const Title_1 = require("./Title");
const Membership_1 = require("./Membership");
const Fee_1 = require("./Fee");
let User = class User extends CustomBaseEntity_1.CustomBaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)({ type: "text", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "rfid", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "emergPhone", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)({ type: "text", default: "Warning: unknown" }),
    __metadata("design:type", String)
], User.prototype, "emergContact", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "newsletter", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "waivered", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], User.prototype, "privacyLevel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], User.prototype, "accessLevel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Title_1.Title, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => Title_1.Title, (title) => title.users, { nullable: true }),
    __metadata("design:type", Title_1.Title)
], User.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    (0, typeorm_1.OneToMany)(() => Post_1.Post, (post) => post.author),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [CalendarClass_1.CalendarClass]),
    (0, typeorm_1.OneToMany)(() => CalendarClass_1.CalendarClass, (calendarClass) => calendarClass.instructor),
    __metadata("design:type", Array)
], User.prototype, "taughtClasses", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Fee_1.Fee]),
    (0, typeorm_1.OneToMany)(() => Fee_1.Fee, (fee) => fee.user),
    __metadata("design:type", Array)
], User.prototype, "fees", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Membership_1.Membership]),
    (0, typeorm_1.OneToMany)(() => Membership_1.Membership, (membership) => membership.user),
    __metadata("design:type", Array)
], User.prototype, "memberships", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CalendarClass_1.CalendarClass),
    (0, typeorm_1.ManyToOne)(() => CalendarClass_1.CalendarClass, (calendarClass) => calendarClass.participants),
    __metadata("design:type", CalendarClass_1.CalendarClass)
], User.prototype, "attendedClasses", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
