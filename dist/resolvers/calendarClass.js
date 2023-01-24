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
exports.CalendarClassResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const CalendarClass_1 = require("../entities/CalendarClass");
const User_1 = require("../entities/User");
const ClassTemplate_1 = require("../entities/ClassTemplate");
const data_source_1 = require("../data-source");
const isAuth_1 = require("../middleware/isAuth");
let CalendarClassResponse = class CalendarClassResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CalendarClassResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => CalendarClass_1.CalendarClass, { nullable: true }),
    __metadata("design:type", CalendarClass_1.CalendarClass)
], CalendarClassResponse.prototype, "calendarClass", void 0);
CalendarClassResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CalendarClassResponse);
let CalendarClassResolver = class CalendarClassResolver {
    async calendarClasses() {
        const ccr = data_source_1.AppDataSource.getRepository(CalendarClass_1.CalendarClass);
        const results = await ccr.find({ relations: ['instructor', 'classTemplate', 'participants'] });
        return results;
    }
    calendarClass(uuid) {
        return CalendarClass_1.CalendarClass.findOne({
            where: { uuid: uuid },
            relations: ['instructor', 'classTemplate', 'participants']
        });
    }
    async createCalendarClass(instructorUuid, templateId, maxParticipants, cost, memberCost, dates, duration, note) {
        const instructor = await User_1.User.findOne({ where: { uuid: instructorUuid } });
        if (!instructor) {
            return { errors: [{ field: "instructor", message: "Instructor not found" }] };
        }
        const template = await ClassTemplate_1.ClassTemplate.findOne({ where: { uuid: templateId } });
        if (!template) {
            return { errors: [{ field: "templateId", message: "Class template not found" }] };
        }
        else if (maxParticipants < 0 || maxParticipants > 100) {
            return { errors: [{ field: "maxParticipants", message: "Invalid number of max participants" }] };
        }
        else if (cost < 0 || cost > 1000) {
            return { errors: [{ field: "cost", message: "Invalid cost" }] };
        }
        if (memberCost < 0 || memberCost > 1000) {
            return { errors: [{ field: "memberCost", message: "Invalid member cost" }] };
        }
        else if (duration < 0 || duration > 60 * 24) {
            return { errors: [{ field: "duration", message: "Invalid duration" }] };
        }
        let calendarClass;
        try {
            calendarClass = await CalendarClass_1.CalendarClass.create({
                instructor: instructor,
                classTemplate: template,
                maxParticipants: maxParticipants,
                cost: cost,
                memberCost: memberCost,
                dates: dates,
                lastDate: new Date(),
                duration: duration,
                note: note,
            }).save();
        }
        catch (err) {
            console.log("Create class event error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] };
        }
        return { calendarClass: calendarClass };
    }
    async deleteCalendarClass(uuid) {
        try {
            await CalendarClass_1.CalendarClass.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
    async addToClass(classUuid, { req }) {
        let theClass = await CalendarClass_1.CalendarClass.findOne({
            where: { uuid: classUuid },
            relations: ['instructor', 'classTemplate', 'participants']
        });
        if (!theClass) {
            return { errors: [{ field: "error", message: "Class not found" }] };
        }
        else if (theClass.participants.length >= theClass.maxParticipants) {
            return { errors: [{ field: "error", message: "Class is full" }] };
        }
        const theUser = await User_1.User.findOne({
            where: { uuid: req.session.uuid }
        });
        if (!theUser) {
            return { errors: [{ field: "error", message: "User not found" }] };
        }
        else if (theClass.participants.filter(item => item.uuid === theUser.uuid).length !== 0) {
            return { errors: [{ field: "error", message: "User is already in the class!" }] };
        }
        theClass.participants.push(theUser);
        theClass = await theClass.save();
        return { calendarClass: theClass };
    }
    async removeFromClass(userUuid, classUuid) {
        let theClass = await CalendarClass_1.CalendarClass.findOne({
            where: { uuid: classUuid },
            relations: ['instructor', 'classTemplate', 'participants']
        });
        if (!theClass) {
            return { errors: [{ field: "error", message: "Class not found" }] };
        }
        const theUser = await User_1.User.findOne({
            where: { uuid: userUuid }
        });
        if (!theUser) {
            return { errors: [{ field: "error", message: "User not found" }] };
        }
        console.log(`Let's remove ${theUser.uuid} from ${theClass.uuid}.`);
        console.log(`${theClass.participants}`);
        if (theClass.participants.filter(item => item.uuid === theUser.uuid).length === 0) {
            return { errors: [{ field: "error", message: "User is not in the class!" }] };
        }
        theClass.participants = theClass.participants.filter(item => item.uuid !== theUser.uuid);
        theClass = await theClass.save();
        return { calendarClass: theClass };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [CalendarClass_1.CalendarClass]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "calendarClasses", null);
__decorate([
    (0, type_graphql_1.Query)(() => CalendarClass_1.CalendarClass, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "calendarClass", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CalendarClassResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('instructor', () => String)),
    __param(1, (0, type_graphql_1.Arg)('templateId', () => String)),
    __param(2, (0, type_graphql_1.Arg)('maxParticipants', () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Arg)('cost', () => type_graphql_1.Float)),
    __param(4, (0, type_graphql_1.Arg)('memberCost', () => type_graphql_1.Float)),
    __param(5, (0, type_graphql_1.Arg)('dates', () => [Date])),
    __param(6, (0, type_graphql_1.Arg)('duration', () => type_graphql_1.Int)),
    __param(7, (0, type_graphql_1.Arg)('note', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, Number, Array, Number, String]),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "createCalendarClass", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "deleteCalendarClass", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CalendarClassResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('classUuid', () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "addToClass", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CalendarClassResponse),
    __param(0, (0, type_graphql_1.Arg)('userUuid', () => String)),
    __param(1, (0, type_graphql_1.Arg)('classUuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CalendarClassResolver.prototype, "removeFromClass", null);
CalendarClassResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CalendarClassResolver);
exports.CalendarClassResolver = CalendarClassResolver;
