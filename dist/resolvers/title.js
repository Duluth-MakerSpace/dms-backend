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
exports.TitleResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Title_1 = require("../entities/Title");
let TitleResolver = class TitleResolver {
    titles() {
        return Title_1.Title.find({
            relations: ['users'],
            order: { createdAt: "DESC" }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Title_1.Title]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TitleResolver.prototype, "titles", null);
TitleResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TitleResolver);
exports.TitleResolver = TitleResolver;
