
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalendarClass } from "./CalendarClass";

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
    @Column({ default: 1 })
    privacyLevel?: number;

    @Field(() => Int)
    @Column({ default: 1 })
    accessLevel?: number;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    bio?: string;

    @OneToMany(() => CalendarClass, (calendarClass) => calendarClass.instructor)
    taughtClasses!: CalendarClass[];

    @Field(() => CalendarClass)
    @ManyToOne(() => CalendarClass, (calendarClass) => calendarClass.participants, { onDelete: 'CASCADE' })
    attendedClasses!: CalendarClass;

}
