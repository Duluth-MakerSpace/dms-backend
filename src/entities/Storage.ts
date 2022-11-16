
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Float, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Storage extends CustomBaseEntity {
    @Field(() => Boolean)
    @Column({ type: "bool", default: false })
    disabled!: boolean;

    @Field(() => String)
    @Column({ type: "text" })
    title!: string;

    @Field(() => String)
    @Column({ type: "text", nullable: true })
    description?: string;

    @Field(() => Float)
    @Column({ type: "float" })
    cost!: number;
}
