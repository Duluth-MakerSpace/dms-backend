import { CustomBaseEntity } from "./CustomBaseEntity";

// import { Entity, Property } from "@mikro-orm/core"
import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends CustomBaseEntity {

    @Field(() => String)
    @Column({ type: "text" })
    title!: string;

    @Field(() => Int)
    @Column({ type: "int", default: 1 })
    category!: number;

    @Field(() => String)
    @Column({ type: "text" })
    content!: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author!: User;

}