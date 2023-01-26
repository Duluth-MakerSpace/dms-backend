import { CustomBaseEntity } from "./CustomBaseEntity";

// import { Entity, Property } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Title extends CustomBaseEntity {

    @Field(() => String)
    @Column({ type: "text", unique: true })
    title!: string;

    @Field(() => String)
    @Column({ type: "text", default: "public" })
    type!: string;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.title)
    users!: User[];

}