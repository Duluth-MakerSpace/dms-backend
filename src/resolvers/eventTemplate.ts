import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { FieldError } from "../types";
import { EventTemplate } from "../entities/EventTemplate";

@ObjectType()
class EventTemplateResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => EventTemplate, { nullable: true })
    eventTemplate?: EventTemplate
}

@Resolver()
export class EventTemplateResolver {


    @Query(() => [EventTemplate])
    eventTemplates(
    ): Promise<EventTemplate[]> {
        return EventTemplate.find({ order: { updatedAt: "DESC" } });
    }

    @Query(() => EventTemplate, { nullable: true })
    eventTemplate(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<EventTemplate | null> {
        return EventTemplate.findOne({ where: { uuid: uuid } });
    }

    @Mutation(() => EventTemplateResponse)
    async createEventTemplate(
        @Arg('title', () => String) title: string,
        @Arg('description', () => String, { nullable: true }) description: string,
        @Arg('image', () => String, { nullable: true }) image: string,
        // @Arg('grants_cert', () => Boolean, { nullable: true }) newsletter: boolean,
    ): Promise<EventTemplateResponse> {

        // TODO: validate

        // Attempt to create template.
        let eventTemplate;
        try {
            eventTemplate = await EventTemplate.create({
                title: title,
                description: description,
                image: image,
            }).save()
        } catch (err: any) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Template already exists" }] }
            }
            console.log("Registration error:", err);
        }


        return { eventTemplate: eventTemplate };
    }


    @Mutation(() => EventTemplate, { nullable: true })
    async updateEventTemplate(
        @Arg('uuid', () => Int) uuid: string,
        @Arg('title', () => String) title: string,
        @Arg('description', () => String, { nullable: true }) description: string,
        @Arg('image', () => String, { nullable: true }) image: string,
    ): Promise<EventTemplate | null> {
        const eventTemplate = await EventTemplate.findOne({ where: { uuid: uuid } });
        if (!eventTemplate) {
            return null;
        }
        // TODO: validate
        await EventTemplate.update(
            { uuid },
            {
                title: title,
                description: description,
                image: image
            })
        return eventTemplate;
    }


    @Mutation(() => Boolean)
    async deleteEventTemplate(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await EventTemplate.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
