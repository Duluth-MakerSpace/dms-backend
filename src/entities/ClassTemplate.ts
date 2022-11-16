import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { CalendarClass } from "./CalendarClass";

@ObjectType()
@Entity()
export class ClassTemplate extends CustomBaseEntity {

    @Field(() => String)
    @Column({ type: "text" })
    title!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    image?: string;

    @OneToMany(() => CalendarClass, (calendarClass) => calendarClass.classTemplate)
    calendarClasses!: CalendarClass[];
}
