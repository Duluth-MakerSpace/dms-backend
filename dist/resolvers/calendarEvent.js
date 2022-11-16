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
exports.CalendarEventResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const CalendarEvent_1 = require("../entities/CalendarEvent");
const User_1 = require("../entities/User");
const EventTemplate_1 = require("../entities/EventTemplate");
const data_source_1 = require("../data-source");
let CalendarEventResponse = class CalendarEventResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CalendarEventResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CalendarEvent_1.CalendarEvent, { nullable: true }),
    __metadata("design:type", CalendarEvent_1.CalendarEvent)
], CalendarEventResponse.prototype, "calendarEvent", void 0);
CalendarEventResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CalendarEventResponse);
let CalendarEventResolver = class CalendarEventResolver {
    async calendarEvents() {
        const ccr = data_source_1.AppDataSource.getRepository(CalendarEvent_1.CalendarEvent);
        const results = await ccr.find({ relations: ['instructor', 'eventTemplate', 'participants'] });
        return results;
    }
    calendarEvent(uuid) {
        return CalendarEvent_1.CalendarEvent.findOne({ where: { uuid: uuid } });
    }
    async createCalendarEvent(instructorUuid, templateId, cost, memberCost, date, duration, note) {
        const instructor = await User_1.User.findOne({ where: { uuid: instructorUuid } });
        if (!instructor) {
            return { errors: [{ field: "instructor", message: "Instructor not found" }] };
        }
        const template = await EventTemplate_1.EventTemplate.findOne({ where: { uuid: templateId } });
        if (!template) {
            return { errors: [{ field: "templateId", message: "Event template not found" }] };
        }
        if (cost < 0 || cost > 1000) {
            return { errors: [{ field: "cost", message: "Invalid cost" }] };
        }
        if (memberCost < 0 || memberCost > 1000) {
            return { errors: [{ field: "memberCost", message: "Invalid member cost" }] };
        }
        if (duration < 0 || duration > 60 * 24) {
            return { errors: [{ field: "duration", message: "Invalid duration" }] };
        }
        let calendarEvent;
        try {
            calendarEvent = await CalendarEvent_1.CalendarEvent.create({
                eventTemplate: template,
                cost: cost,
                memberCost: memberCost,
                date: date,
                duration: duration,
                note: note,
            }).save();
        }
        catch (err) {
            console.log("Create event error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] };
        }
        return { calendarEvent: calendarEvent };
    }
    async deleteCalendarEvent(uuid) {
        try {
            await CalendarEvent_1.CalendarEvent.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [CalendarEvent_1.CalendarEvent]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarEventResolver.prototype, "calendarEvents", null);
__decorate([
    (0, type_graphql_1.Query)(() => CalendarEvent_1.CalendarEvent, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarEventResolver.prototype, "calendarEvent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CalendarEventResponse),
    __param(0, (0, type_graphql_1.Arg)('instructor', () => String)),
    __param(1, (0, type_graphql_1.Arg)('templateId', () => String)),
    __param(2, (0, type_graphql_1.Arg)('cost', () => type_graphql_1.Float)),
    __param(3, (0, type_graphql_1.Arg)('memberCost', () => type_graphql_1.Float)),
    __param(4, (0, type_graphql_1.Arg)('dates', () => Date)),
    __param(5, (0, type_graphql_1.Arg)('duration', () => type_graphql_1.Int)),
    __param(6, (0, type_graphql_1.Arg)('note', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, Date, Number, String]),
    __metadata("design:returntype", Promise)
], CalendarEventResolver.prototype, "createCalendarEvent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarEventResolver.prototype, "deleteCalendarEvent", null);
CalendarEventResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CalendarEventResolver);
exports.CalendarEventResolver = CalendarEventResolver;
