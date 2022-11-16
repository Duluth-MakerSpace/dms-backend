
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Equipment extends CustomBaseEntity {
    @Field(() => String)
    @Column({ type: "text", unique: true })
    title!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    image?: string;

    @Field(() => Int)
    @Column({ type: "int", default: 1 })
    quantity!: number;

    // requires_cert
}
