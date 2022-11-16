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
exports.CalendarEvent = void 0;
const CustomBaseEntity_1 = require("./CustomBaseEntity");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const EventTemplate_1 = require("./EventTemplate");
let CalendarEvent = class CalendarEvent extends CustomBaseEntity_1.CustomBaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "cost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)({ type: "float" }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "memberCost", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "date", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], CalendarEvent.prototype, "duration", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => EventTemplate_1.EventTemplate),
    (0, typeorm_1.ManyToOne)(() => EventTemplate_1.EventTemplate, (ce) => ce.calendarEvents, { onDelete: 'CASCADE' }),
    __metadata("design:type", EventTemplate_1.EventTemplate)
], CalendarEvent.prototype, "eventTemplate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "note", void 0);
CalendarEvent = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], CalendarEvent);
exports.CalendarEvent = CalendarEvent;
