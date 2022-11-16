import { Arg, Field, Float, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { FieldError } from "../types";
import { CalendarClass } from "../entities/CalendarClass";
import { User } from "../entities/User";
import { ClassTemplate } from "../entities/ClassTemplate";
import { AppDataSource } from "../data-source";

@ObjectType()
class CalendarClassResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => CalendarClass, { nullable: true })
    calendarClass?: CalendarClass
}

@Resolver()
export class CalendarClassResolver {

    @Query(() => [CalendarClass])
    async calendarClasses(
    ): Promise<CalendarClass[]> {
        // return await CalendarClass.find();

        const ccr = AppDataSource.getRepository(CalendarClass);
        const results = await ccr.find({ relations: ['instructor', 'classTemplate', 'participants'] })
        return results
    }

    @Query(() => CalendarClass, { nullable: true })
    calendarClass(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<CalendarClass | null> {
        return CalendarClass.findOne({
            where: { uuid: uuid },
            relations: ['instructor', 'classTemplate', 'participants']
        });
    }

    @Mutation(() => CalendarClassResponse)
    async createCalendarClass(
        @Arg('instructor', () => String) instructorUuid: string,
        @Arg('templateId', () => String) templateId: string,
        @Arg('maxParticipants', () => Int) maxParticipants: number,
        @Arg('cost', () => Float) cost: number,
        @Arg('memberCost', () => Float) memberCost: number,
        @Arg('dates', () => [Date]) dates: Date[],
        @Arg('duration', () => Int) duration: number,
        @Arg('note', () => String) note: string,
        // @Arg('grants_cert', () => Boolean, { nullable: true }) newsletter: boolean,
    ): Promise<CalendarClassResponse> {

        const instructor = await User.findOne({ where: { uuid: instructorUuid } });
        if (!instructor) {
            return { errors: [{ field: "instructor", message: "Instructor not found" }] }
        }
        const template = await ClassTemplate.findOne({ where: { uuid: templateId } });
        if (!template) {
            return { errors: [{ field: "templateId", message: "Class template not found" }] }
        }
        if (maxParticipants < 0 || maxParticipants > 100) {
            return { errors: [{ field: "maxParticipants", message: "Invalid number of max participants" }] }
        }
        if (cost < 0 || cost > 1000) {
            return { errors: [{ field: "cost", message: "Invalid cost" }] }
        }
        if (memberCost < 0 || memberCost > 1000) {
            return { errors: [{ field: "memberCost", message: "Invalid member cost" }] }
        }
        // TODO: if dates is empty!
        if (duration < 0 || duration > 60 * 24) {
            return { errors: [{ field: "duration", message: "Invalid duration" }] }
        }
        // TODO: CERT

        // Attempt to create event.
        let calendarClass;
        try {
            calendarClass = await CalendarClass.create({
                instructor: instructor,
                classTemplate: template,
                maxParticipants: maxParticipants,
                cost: cost,
                memberCost: memberCost,
                dates: dates,
                lastDate: new Date(), // TODO
                duration: duration,
                note: note,
            }).save()
        } catch (err: any) {
            console.log("Create class event error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] }
        }

        return { calendarClass: calendarClass };
    }


    // @Mutation(() => CalendarClass, { nullable: true })
    // async updateCalendarClass(
    //     @Arg('uuid', () => Int) uuid: string,
    //     @Arg('title', () => String) title: string,
    // ): Promise<CalendarClass | null> {
    //     const calendarClass = await CalendarClass.findOne({ where: { uuid: uuid } });
    //     if (!calendarClass) {
    //         return null;
    //     }
    //     if (typeof title !== 'undefined') {
    //         await CalendarClass.update({ uuid }, { title })
    //     }
    //     return calendarClass;
    // }


    @Mutation(() => Boolean)
    async deleteCalendarClass(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await CalendarClass.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
