
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Float, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Membership extends CustomBaseEntity {

    @Field(() => String)
    @Column({ type: "text" })
    type!: string;

    @Field(() => Int)
    @Column({ type: "int" })
    days!: number;

    @Field(() => Float)
    @Column({ type: "float" })
    cost!: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
    user!: User;

    @Field(() => String)
    expiresAt(): Date {
        const createdAt = this.createdAt ? this.createdAt.getTime() : Date.now()
        return new Date(createdAt + 1000 * 60 * 60 * 24 * this.days)
    }

    @Field(() => Boolean)
    isExpired(): boolean {
        const today = new Date();
        return this.expiresAt() <= today;
    }
}
