
import { CustomBaseEntity } from "./CustomBaseEntity";

import { Field, Float, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Certification } from "./Certification";
import { User } from "./User";
import { ClassTemplate } from "./ClassTemplate";

@ObjectType()
@Entity()
export class CalendarClass extends CustomBaseEntity {

    @Field(() => Int)
    @Column({ type: "int" })
    maxParticipants!: number;

    @Field(() => Float)
    @Column({ type: "float" })
    cost!: number;

    @Field(() => Float)
    @Column({ type: "float" })
    memberCost!: number;

    @Field(() => [String])
    @Column({ type: "date", array: true })
    dates!: Date[];

    @Field(() => Int)
    @Column({ type: "int" })
    duration!: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    note?: string;

    @Field(() => Certification, { nullable: true })
    @ManyToOne(() => Certification, (category) => category.classes, { nullable: true })
    grantsCert?: Certification | null;

    @Field(() => ClassTemplate)
    @ManyToOne(() => ClassTemplate, (ct) => ct.calendarClasses, { onDelete: 'CASCADE' })
    classTemplate!: ClassTemplate;

    @Field(() => User)
    @ManyToOne(() => User, (instructor) => instructor.taughtClasses, { onDelete: 'CASCADE' })
    instructor!: User;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.attendedClasses)
    participants!: User[];

    @Field(() => String)
    firstDate(): Date {
        return new Date(Math.min(...this.dates.map(m => m.getTime())));
    }

    @Field(() => String)
    lastDate(): Date {
        return new Date(Math.max(...this.dates.map(m => m.getTime())));
    }

    @Field(() => String, { nullable: true })
    nextDate(): Date | null {
        const dates = this.dates.filter(m => m.getTime() >= Date.now())
        if (dates.length) {
            return new Date(Math.min(...dates.map(m => m.getTime())));
        }
        return null;
    }

}
