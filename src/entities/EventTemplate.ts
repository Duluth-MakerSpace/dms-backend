import { CustomBaseEntity } from "./CustomBaseEntity";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { CalendarEvent } from "./CalendarEvent";

@ObjectType()
@Entity()
export class EventTemplate extends CustomBaseEntity {

    @Field(() => String)
    @Column({ type: "text" })
    title!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    image?: string;

    @OneToMany(() => CalendarEvent, (calendarEvent) => calendarEvent.eventTemplate)
    calendarEvents!: CalendarEvent[];
}
