
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalendarClass } from "./CalendarClass";
import { Post } from "./Post";
import { Title } from "./Title";
import { Membership } from "./Membership";
import { Fee } from "./Fee";

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
    @Column({ type: "text" })
    name!: string;

    @Column({ type: "text" })
    password!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    rfid?: string;

    @Field(() => String)
    @Column()
    phone!: string;

    @Field(() => String)
    @Column()
    emergPhone!: string;

    @Field(() => String)
    @Column({ type: "text", default: "Warning: unknown" })
    emergContact!: string;

    @Field(() => Boolean)
    @Column({ default: false })
    newsletter?: boolean;

    @Field(() => Boolean)
    @Column({ default: false })
    waivered?: boolean;

    @Field(() => Int)
    @Column({ type: "int", default: 1 })
    privacyLevel!: number;

    @Field(() => Int)
    @Column({ type: "int", default: 1 })
    accessLevel!: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    bio?: string;

    @Field(() => Title, { nullable: true })
    @ManyToOne(() => Title, (title) => title.users, { nullable: true })
    title?: Title;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @Field(() => [CalendarClass])
    @OneToMany(() => CalendarClass, (calendarClass) => calendarClass.instructor)
    taughtClasses!: CalendarClass[];

    @Field(() => [Fee])
    @OneToMany(() => Fee, (fee) => fee.user)
    fees!: Fee[];

    @Field(() => [Membership])
    @OneToMany(() => Membership, (membership) => membership.user)
    memberships!: Membership[];

    @Field(() => CalendarClass)
    @ManyToOne(() => CalendarClass, (calendarClass) => calendarClass.participants)
    attendedClasses!: CalendarClass;

}
