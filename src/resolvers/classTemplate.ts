import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { FieldError } from "../types";
import { ClassTemplate } from "../entities/ClassTemplate";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class ClassTemplateResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => ClassTemplate, { nullable: true })
    classTemplate?: ClassTemplate
}

@Resolver()
export class ClassTemplateResolver {


    @Query(() => [ClassTemplate])
    classTemplates(
    ): Promise<ClassTemplate[]> {
        return ClassTemplate.find({ order: { updatedAt: "ASC" } });
    }

    @Query(() => ClassTemplate, { nullable: true })
    classTemplate(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<ClassTemplate | null> {
        return ClassTemplate.findOne({ where: { uuid: uuid } });
    }

    @Mutation(() => ClassTemplateResponse)
    @UseMiddleware(isAuth)
    async createClassTemplate(
        @Arg('title', () => String) title: string,
        @Arg('description', () => String, { nullable: true }) description: string,
        @Arg('image', () => String, { nullable: true }) image: string,
        // @Arg('grants_cert', () => Boolean, { nullable: true }) newsletter: boolean,
    ): Promise<ClassTemplateResponse> {

        // TODO: validate
        // const errors = getRegisterErrors(email, password, name);
        // if (errors) {
        //     return { errors: errors }
        // }


        // Attempt to create template.
        let classTemplate;
        try {
            classTemplate = await ClassTemplate.create({
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


        return { classTemplate: classTemplate };
    }


    @Mutation(() => ClassTemplate, { nullable: true })
    @UseMiddleware(isAuth)
    async updateClassTemplate(
        @Arg('uuid', () => Int) uuid: string,
        @Arg('title', () => String) title: string,
        @Arg('description', () => String, { nullable: true }) description: string,
        @Arg('image', () => String, { nullable: true }) image: string,
    ): Promise<ClassTemplate | null> {
        const classTemplate = await ClassTemplate.findOne({ where: { uuid: uuid } });
        if (!classTemplate) {
            return null;
        }
        // TODO: validate
        await ClassTemplate.update(
            { uuid },
            {
                title: title,
                description: description,
                image: image
            })
        return classTemplate;
    }


    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteClassTemplate(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await ClassTemplate.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
