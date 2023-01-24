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
exports.EventTemplateResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const EventTemplate_1 = require("../entities/EventTemplate");
const isAuth_1 = require("../middleware/isAuth");
let EventTemplateResponse = class EventTemplateResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], EventTemplateResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => EventTemplate_1.EventTemplate, { nullable: true }),
    __metadata("design:type", EventTemplate_1.EventTemplate)
], EventTemplateResponse.prototype, "eventTemplate", void 0);
EventTemplateResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], EventTemplateResponse);
let EventTemplateResolver = class EventTemplateResolver {
    eventTemplates() {
        return EventTemplate_1.EventTemplate.find({ order: { updatedAt: "DESC" } });
    }
    eventTemplate(uuid) {
        return EventTemplate_1.EventTemplate.findOne({ where: { uuid: uuid } });
    }
    async createEventTemplate(title, description, image) {
        let eventTemplate;
        try {
            eventTemplate = await EventTemplate_1.EventTemplate.create({
                title: title,
                description: description,
                image: image,
            }).save();
        }
        catch (err) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Template already exists" }] };
            }
            console.log("Registration error:", err);
        }
        return { eventTemplate: eventTemplate };
    }
    async updateEventTemplate(uuid, title, description, image) {
        const eventTemplate = await EventTemplate_1.EventTemplate.findOne({ where: { uuid: uuid } });
        if (!eventTemplate) {
            return null;
        }
        await EventTemplate_1.EventTemplate.update({ uuid }, {
            title: title,
            description: description,
            image: image
        });
        return eventTemplate;
    }
    async deleteEventTemplate(uuid) {
        try {
            await EventTemplate_1.EventTemplate.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [EventTemplate_1.EventTemplate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventTemplateResolver.prototype, "eventTemplates", null);
__decorate([
    (0, type_graphql_1.Query)(() => EventTemplate_1.EventTemplate, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventTemplateResolver.prototype, "eventTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EventTemplateResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('title', () => String)),
    __param(1, (0, type_graphql_1.Arg)('description', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('image', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EventTemplateResolver.prototype, "createEventTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => EventTemplate_1.EventTemplate, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String)),
    __param(2, (0, type_graphql_1.Arg)('description', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('image', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], EventTemplateResolver.prototype, "updateEventTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventTemplateResolver.prototype, "deleteEventTemplate", null);
EventTemplateResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], EventTemplateResolver);
exports.EventTemplateResolver = EventTemplateResolver;
