
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Float, Int, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@ObjectType()
@Entity()
export class Fee extends CustomBaseEntity {
    // user

    @Field(() => String)
    @Column({ type: "text" })
    title!: string;

    @Field(() => Float)
    @Column({ type: "float" })
    amount?: number;

    @Field(() => Boolean)
    @Column({ type: "bool" })
    paid?: boolean;

    @Field(() => Int)
    @Column({ type: "int", default: 1 })
    quantity!: number;

}
