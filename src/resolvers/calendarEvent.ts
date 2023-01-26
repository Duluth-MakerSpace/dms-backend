import { Arg, Field, Float, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { FieldError } from "../types";
import { CalendarEvent } from "../entities/CalendarEvent";
import { User } from "../entities/User";
import { EventTemplate } from "../entities/EventTemplate";
import { AppDataSource } from "../data-source";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class CalendarEventResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => CalendarEvent, { nullable: true })
    calendarEvent?: CalendarEvent
}

@Resolver()
export class CalendarEventResolver {

    @Query(() => [CalendarEvent])
    async calendarEvents(
    ): Promise<CalendarEvent[]> {
        // return await CalendarEvent.find();

        const ccr = AppDataSource.getRepository(CalendarEvent);
        const results = await ccr.find({ relations: ['instructor', 'eventTemplate', 'participants'] })
        return results
    }

    @Query(() => CalendarEvent, { nullable: true })
    calendarEvent(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<CalendarEvent | null> {
        return CalendarEvent.findOne({ where: { uuid: uuid } });
    }

    @Mutation(() => CalendarEventResponse)
    @UseMiddleware(isAuth)
    async createCalendarEvent(
        @Arg('instructor', () => String) instructorUuid: string,
        @Arg('templateId', () => String) templateId: string,
        @Arg('cost', () => Float) cost: number,
        @Arg('memberCost', () => Float) memberCost: number,
        @Arg('dates', () => Date) date: Date,
        @Arg('duration', () => Int) duration: number,
        @Arg('note', () => String) note: string,
    ): Promise<CalendarEventResponse> {

        const instructor = await User.findOne({ where: { uuid: instructorUuid } });
        if (!instructor) {
            return { errors: [{ field: "instructor", message: "Instructor not found" }] }
        }
        const template = await EventTemplate.findOne({ where: { uuid: templateId } });
        if (!template) {
            return { errors: [{ field: "templateId", message: "Event template not found" }] }
        }
        if (cost < 0 || cost > 1000) {
            return { errors: [{ field: "cost", message: "Invalid cost" }] }
        }
        if (memberCost < 0 || memberCost > 1000) {
            return { errors: [{ field: "memberCost", message: "Invalid member cost" }] }
        }
        // TODO: if date is bad!
        if (duration < 0 || duration > 60 * 24) {
            return { errors: [{ field: "duration", message: "Invalid duration" }] }
        }

        // Attempt to create event.
        let calendarEvent;
        try {
            calendarEvent = await CalendarEvent.create({
                eventTemplate: template,
                cost: cost,
                memberCost: memberCost,
                date: date,
                duration: duration,
                note: note,
            }).save()
        } catch (err: any) {
            console.log("Create event error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] }
        }

        return { calendarEvent: calendarEvent };
    }


    // @Mutation(() => CalendarEvent, { nullable: true })
    // async updateCalendarEvent(
    //     @Arg('uuid', () => Int) uuid: string,
    //     @Arg('title', () => String) title: string,
    // ): Promise<CalendarEvent | null> {
    //     const calendarEvent = await CalendarEvent.findOne({ where: { uuid: uuid } });
    //     if (!calendarEvent) {
    //         return null;
    //     }
    //     if (typeof title !== 'undefined') {
    //         await CalendarEvent.update({ uuid }, { title })
    //     }
    //     return calendarEvent;
    // }


    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteCalendarEvent(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await CalendarEvent.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
