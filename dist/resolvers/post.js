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
exports.PostResolver = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middleware/isAuth");
const types_1 = require("../types");
let PostResponse = class PostResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [types_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], PostResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Post_1.Post, { nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
PostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostResponse);
let GetPostsArgs = class GetPostsArgs {
    constructor() {
        this.limit = 5;
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetPostsArgs.prototype, "limit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], GetPostsArgs.prototype, "cursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], GetPostsArgs.prototype, "category", void 0);
GetPostsArgs = __decorate([
    (0, type_graphql_1.ArgsType)()
], GetPostsArgs);
let PostResolver = class PostResolver {
    posts({ limit, cursor, category }) {
        const whereClause = Object.assign(Object.assign({}, (category && { category: category })), (cursor && { createdAt: (0, typeorm_1.LessThan)(cursor) }));
        return Post_1.Post.find({
            where: whereClause,
            relations: ['author'],
            take: limit,
            order: { createdAt: "DESC" }
        });
    }
    post(uuid) {
        return Post_1.Post.findOne({
            where: { uuid: uuid },
            relations: ['author']
        });
    }
    async createPost(title, category, content, { req }) {
        const author = await User_1.User.findOne({ where: { uuid: req.session.uuid } });
        if (!author) {
            return { errors: [{ field: "author", message: "Author not found" }] };
        }
        let post;
        try {
            post = await Post_1.Post.create({
                author: author,
                title: title,
                category: category,
                content: content,
            }).save();
        }
        catch (err) {
            console.log("Create post error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] };
        }
        return { post: post };
    }
    async updatePost(uuid, title, category, content, { req }) {
        const post = await Post_1.Post.findOne({
            where: { uuid: uuid },
            relations: ['author']
        });
        if (!post) {
            return null;
        }
        if (post.author.uuid !== req.session.uuid) {
            return { errors: [{ field: "unknown", message: "This is not your post!" }] };
        }
        if (typeof title !== 'undefined') {
            await Post_1.Post.update({ uuid }, { title, content, category });
        }
        return { post: post };
    }
    async deletePost(uuid) {
        try {
            await Post_1.Post.delete(uuid);
        }
        catch (_a) {
            return false;
        }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post]),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetPostsArgs]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('title', () => String)),
    __param(1, (0, type_graphql_1.Arg)('category', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)('content', () => String)),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String)),
    __param(2, (0, type_graphql_1.Arg)('category', () => type_graphql_1.Int)),
    __param(3, (0, type_graphql_1.Arg)('content', () => String)),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('uuid', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
