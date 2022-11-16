
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { CalendarClass } from "./CalendarClass";

@ObjectType()
@Entity()
export class Certification extends CustomBaseEntity {
    @Field(() => String)
    @Column({ type: "text", unique: true })
    title!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    image?: string;

    @OneToMany(() => CalendarClass, (c) => c.grantsCert)
    classes!: CalendarClass[];
}
