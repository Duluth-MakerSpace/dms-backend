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
exports.CalendarClass = void 0;
const CustomBaseEntity_1 = require("./CustomBaseEntity");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Certification_1 = require("./Certification");
const User_1 = require("./User");
const ClassTemplate_1 = require("./ClassTemplate");
let CalendarClass = class CalendarClass extends CustomBaseEntity_1.CustomBaseEntity {
    firstDate() {
        return new Date(Math.min(...this.dates.map(m => m.getTime())));
    }
    lastDate() {
        return new Date(Math.max(...this.dates.map(m => m.getTime())));
    }
    nextDate() {
        const dates = this.dates.filter(m => m.getTime() >= Date.now());
        if (dates.length) {
            return new Date(Math.min(...dates.map(m => m.getTime())));
        }
        return null;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CalendarClass.prototype, "maxParticipants", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], CalendarClass.prototype, "cost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], CalendarClass.prototype, "memberCost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)({ type: "date", array: true }),
    __metadata("design:type", Array)
], CalendarClass.prototype, "dates", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CalendarClass.prototype, "duration", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CalendarClass.prototype, "note", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Certification_1.Certification, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => Certification_1.Certification, (category) => category.classes, { nullable: true }),
    __metadata("design:type", Object)
], CalendarClass.prototype, "grantsCert", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ClassTemplate_1.ClassTemplate),
    (0, typeorm_1.ManyToOne)(() => ClassTemplate_1.ClassTemplate, (ct) => ct.calendarClasses, { onDelete: 'CASCADE' }),
    __metadata("design:type", ClassTemplate_1.ClassTemplate)
], CalendarClass.prototype, "classTemplate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (instructor) => instructor.taughtClasses, { onDelete: 'CASCADE' }),
    __metadata("design:type", User_1.User)
], CalendarClass.prototype, "instructor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [User_1.User]),
    (0, typeorm_1.OneToMany)(() => User_1.User, (user) => user.attendedClasses),
    __metadata("design:type", Array)
], CalendarClass.prototype, "participants", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Date)
], CalendarClass.prototype, "firstDate", null);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Date)
], CalendarClass.prototype, "lastDate", null);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], CalendarClass.prototype, "nextDate", null);
CalendarClass = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], CalendarClass);
exports.CalendarClass = CalendarClass;
