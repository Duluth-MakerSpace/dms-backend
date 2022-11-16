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
exports.ClassTemplateResolver = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types");
const ClassTemplate_1 = require("../entities/ClassTemplate");
let ClassTemplateResponse = class ClassTemplateResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], ClassTemplateResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => ClassTemplate_1.ClassTemplate, { nullable: true }),
    __metadata("design:type", ClassTemplate_1.ClassTemplate)
], ClassTemplateResponse.prototype, "classTemplate", void 0);
ClassTemplateResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ClassTemplateResponse);
let ClassTemplateResolver = class ClassTemplateResolver {
    classTemplates() {
        return ClassTemplate_1.ClassTemplate.find({ order: { updatedAt: "DESC" } });
    }
    classTemplate(uuid) {
        return ClassTemplate_1.ClassTemplate.findOne({ where: { uuid: uuid } });
    }
    async createClassTemplate(title, description, image) {
        let classTemplate;
        try {
            classTemplate = await ClassTemplate_1.ClassTemplate.create({
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
        return { classTemplate: classTemplate };
    }
    async updateClassTemplate(uuid, title, description, image) {
        const classTemplate = await ClassTemplate_1.ClassTemplate.findOne({ where: { uuid: uuid } });
        if (!classTemplate) {
            return null;
        }
        await ClassTemplate_1.ClassTemplate.update({ uuid }, {
            title: title,
            description: description,
            image: image
        });
        return classTemplate;
    }
    async deleteClassTemplate(uuid) {
        try {
            await ClassTemplate_1.ClassTemplate.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ClassTemplate_1.ClassTemplate]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassTemplateResolver.prototype, "classTemplates", null);
__decorate([
    (0, type_graphql_1.Query)(() => ClassTemplate_1.ClassTemplate, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassTemplateResolver.prototype, "classTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ClassTemplateResponse),
    __param(0, (0, type_graphql_1.Arg)('title', () => String)),
    __param(1, (0, type_graphql_1.Arg)('description', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('image', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ClassTemplateResolver.prototype, "createClassTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ClassTemplate_1.ClassTemplate, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String)),
    __param(2, (0, type_graphql_1.Arg)('description', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('image', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ClassTemplateResolver.prototype, "updateClassTemplate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClassTemplateResolver.prototype, "deleteClassTemplate", null);
ClassTemplateResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ClassTemplateResolver);
exports.ClassTemplateResolver = ClassTemplateResolver;
