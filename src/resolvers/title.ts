import { Query, Resolver } from "type-graphql";
import { Title } from "../entities/Title";



@Resolver()
export class TitleResolver {
    @Query(() => [Title])
    titles(): Promise<Title[]> {

        return Title.find({
            relations: ['users'],
            order: { createdAt: "DESC" }
        });
    }
}
