import { AppDataSource } from "../data-source";
import { Arg, Ctx, Field, Float, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { Membership } from "../entities/Membership";
import { User } from "../entities/User";
import { FieldError, MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";



@ObjectType()
class CreateMembershipResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => Membership, { nullable: true })
    membership?: Membership
}



@ObjectType()
class MembershipResponse {
    @Field(() => String)
    status!: string

    @Field(() => Date, { nullable: true })
    expirationDate!: Date | null
}




@Resolver()
export class MembershipResolver {
    @Query(() => [Membership])
    memberships(
    ): Promise<Membership[]> {

        return Membership.find({
            relations: ['user'],
            order: { createdAt: "DESC" }
        });
    }

    @Query(() => MembershipResponse, { nullable: true })
    async membership(
        @Arg('userUuid', () => String, { nullable: true }) userUuid: string,
        @Ctx() { req }: MyContext
    ): Promise<MembershipResponse | null> {

        if (!userUuid) {
            userUuid = req.session.uuid;
        }
        const user = await User.findOne({ where: { uuid: userUuid } });
        if (!user) {
            return null;
        }
        const memberships = await AppDataSource.getRepository(Membership).find({
            relations: {
                user: true
            },
            where: {
                user: {
                    uuid: userUuid
                }
            },
        })

        if (memberships.length === 0) {
            return {
                status: "Non-member",
                expirationDate: null
            }
        }

        console.log("Memberships for ", user.name, ": ", memberships)

        // TODO: This is not accurate in the case of overlapping memberships. It's probably not worth
        // computing. We could just return a record of all subscriptions for this user instead.
        const activeMemberships = memberships.filter(m => !m.isExpired())
        if (!activeMemberships.length) {
            return {
                status: "expired",
                expirationDate: new Date(Math.max(...memberships.map(m => m.expiresAt().getTime())))
            }
        }

        // TODO: this is just wrong, like, 100%
        const now = Date.now();
        console.log(activeMemberships);
        const msRemaining = activeMemberships.reduce(
            (accumulator, currentValue) => accumulator + (currentValue.expiresAt().getTime() - now),
            0
        );
        return {
            status: "active",
            expirationDate: new Date(now + msRemaining)
        }
    }



    @Mutation(() => CreateMembershipResponse)
    @UseMiddleware(isAuth)
    async createMembership(
        @Arg('type', () => String) type: string,
        @Arg('days', () => Int) days: number,
        @Arg('cost', () => Float) cost: number,
        @Ctx() { req }: MyContext
    ): Promise<CreateMembershipResponse> {
        const user = await User.findOne({ where: { uuid: req.session.uuid } });
        if (!user) {
            return { errors: [{ field: "user", message: "User not found" }] }
        }

        let membership;
        try {
            membership = await Membership.create({
                type: type,
                days: days,
                cost: cost,
                user: user,
            }).save()
        } catch (err: any) {
            console.log("Create membership error:", err);
            return { errors: [{ field: "unknown", message: "An unknown error occured" }] }
        }

        return { membership: membership };
    }

}
