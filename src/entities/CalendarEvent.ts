
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Float, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { EventTemplate } from "./EventTemplate";

@ObjectType()
@Entity()
export class CalendarEvent extends CustomBaseEntity {

    @Field(() => Float)
    @Column({ type: "float" })
    cost!: number;

    @Field(() => Float)
    @Column({ type: "float" })
    memberCost!: number;

    @Field(() => [String])
    @Column({ type: "date" })
    date!: Date;

    @Field(() => Int)
    @Column({ type: "int" })
    duration!: number;

    @Field(() => EventTemplate)
    @ManyToOne(() => EventTemplate, (ce) => ce.calendarEvents, { onDelete: 'CASCADE' })
    eventTemplate!: EventTemplate;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    note?: string;

}
