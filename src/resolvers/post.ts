import { IsDate, IsInt, Max, Min } from "class-validator";
import { Arg, Args, ArgsType, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { LessThan } from "typeorm";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { FieldError, MyContext } from "../types";


@ObjectType()
class PostResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => Post, { nullable: true })
    post?: Post
}



@ArgsType()
class GetPostsArgs {
    @Field(() => Int)
    @IsInt()
    @Min(0)
    @Max(100)
    limit?: number = 5

    @Field(() => Date, { nullable: true })
    @IsDate()
    cursor?: Date

    @Field(() => Int, { nullable: true })
    @IsInt()
    @Min(0)
    @Max(5)
    category?: number
}


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Args() { limit, cursor, category }: GetPostsArgs): Promise<Post[]> {

        const whereClause = {
            ...(category && { category: category }),
            ...(cursor && { createdAt: LessThan(cursor) })
        }

        return Post.find({
            where: whereClause,
            relations: ['author'],
            take: limit,
            order: { createdAt: "DESC" }
        });
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Post | null> {
        return Post.findOne({
            where: { uuid: uuid },
            relations: ['author']
        });
    }



    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('title', () => String) title: string,
        @Arg('category', () => Int) category: number,
        @Arg('content', () => String) content: string,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse> {
        const author = await User.findOne({ where: { uuid: req.session.uuid } });
        if (!author) {
            return { errors: [{ field: "author", message: "Author not found" }] }
        }

        let post;
        try {
            post = await Post.create({
                author: author,
                title: title,
                category: category,
                content: content,
            }).save()
        } catch (err: any) {
            console.log("Create post error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] }
        }

        return { post: post };
    }

    @Mutation(() => PostResponse, { nullable: true })
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('uuid', () => String) uuid: string,
        @Arg('title', () => String) title: string,
        @Arg('category', () => Int) category: number,
        @Arg('content', () => String) content: string,
        @Ctx() { req }: MyContext
    ): Promise<PostResponse | null> {
        const post = await Post.findOne({
            where: { uuid: uuid },
            relations: ['author']
        });
        if (!post) {
            return null;
        }
        if (post.author.uuid !== req.session.uuid) {
            return { errors: [{ field: "unknown", message: "This is not your post!" }] }
        }
        if (typeof title !== 'undefined') {
            await Post.update({ uuid }, { title, content, category })
        }
        return { post: post };
    }


    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await Post.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
