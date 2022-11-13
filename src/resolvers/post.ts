import { Post } from "../entities/Post";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
    ): Promise<Post[]> {
        return Post.find();
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Post | null> {
        return Post.findOne({ where: { uuid: uuid } });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string,
    ): Promise<Post> {
        return Post.create({ title: title }).save();
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('uuid', () => String) uuid: string,
        @Arg('title', () => String) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne({ where: { uuid: uuid } });
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await Post.update({ uuid }, { title })
        }
        return post;
    }


    @Mutation(() => Boolean)
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
