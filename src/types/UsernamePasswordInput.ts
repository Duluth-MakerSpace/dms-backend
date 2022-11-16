import { Field, InputType } from "type-graphql";


@InputType()
export class NamePasswordInput {
    @Field(() => String)
    email: string = "";

    @Field(() => String)
    name: string = "";

    @Field(() => String)
    password: string = "";
}
