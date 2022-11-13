
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends CustomBaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column({ type: "text", unique: true })
    email!: string;

    @Field(() => String)
    @Column({ type: "text", unique: true })
    username!: string;

    @Column({ type: "text" })
    password!: string;

    @Field(() => String)
    @Column()
    name!: string;

    @Field(() => String)
    @Column()
    phone!: string;

    @Field(() => String)
    @Column({ type: "text", default: "Warning: unknown" })
    emerg_contact!: string;

    @Field(() => Boolean)
    @Column({ default: false })
    newsletter?: boolean;

    @Field(() => Int)
    @Column({ default: 1 })
    privacy_level?: number;

    @Field(() => Int)
    @Column({ default: 1 })
    access_level?: number;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    bio?: string;

}
