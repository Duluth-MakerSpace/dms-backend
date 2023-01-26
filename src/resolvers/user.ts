import argon2 from "argon2";
import { IsDate, IsInt, Max, Min } from "class-validator";
import { nanoid } from "nanoid";
import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { ILike, LessThan } from "typeorm";
import { COOKIE_NAME, FORGOT_PASS_PREFIX, FRONTEND_URL, RFID_PREFIX } from "../constants";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { FieldError, MyContext } from "../types";
import { sendEmail } from "../utils/sendEmail";
import { getPasswordErrors, getRegisterErrors } from "../utils/validateForms";

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}



@ArgsType()
class GetUsersArgs {
    @Field(() => Int)
    @IsInt()
    @Min(0)
    @Max(100)
    limit = 5

    @Field(() => Date, { nullable: true })
    @IsDate()
    cursor?: Date
}



@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
        if (req.session.uuid === user.uuid || req.session.accessLevel >= 3) {
            return user.email;
        }
        return "";
    }


    @Query(() => User, { nullable: true })
    me(
        @Ctx() { req }: MyContext
    ) {
        if (!req.session.uuid) {
            return null
        }

        return User.findOne({
            where: { uuid: req.session.uuid },
            relations: ['title']
        });
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email', () => String) email: string,
        @Ctx() { redisClient }: MyContext
    ) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return true;
        }

        const token = nanoid(10) + "-easter-egg-" + nanoid(10);
        await redisClient.set(
            FORGOT_PASS_PREFIX + token,
            user.uuid,
            "EX",
            1000 * 60 * 60 * 24 * 2 //2 days
        );

        await sendEmail(
            email,
            "Reset your password 🔐",
            `Click to <a href='${FRONTEND_URL}/reset-password/${token}'>reset your password</a>. This link will expire in 48 hours.`
        )
        return true;
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token', () => String) token: string,
        @Arg('password', () => String) password: string,
        @Ctx() { req, redisClient }: MyContext
    ): Promise<UserResponse> {
        const errors = getPasswordErrors(password);
        if (errors) {
            return { errors: errors }
        }

        const key = FORGOT_PASS_PREFIX + token
        const uuid = await redisClient.get(key)
        if (!uuid) {
            return { errors: [{ field: "token", message: "Invalid expiry token. Either your link has expired, your link has already been used, or something strange has happened." }] }
        }

        const user = await User.findOne({ where: { uuid: uuid } })
        if (!user) {
            return { errors: [{ field: "token", message: "User not found!" }] }
        }

        await User.update({ uuid: uuid }, { password: await argon2.hash(password) });
        await redisClient.del(key);

        // Login the user.
        req.session.uuid = user.uuid;
        req.session.accessLevel = user.accessLevel;

        return { user }
    }

    @Query(() => [User])
    users(@Args() { limit, cursor }: GetUsersArgs): Promise<User[]> {
        const whereClause = {
            ...(cursor && { createdAt: LessThan(cursor) })
        }
        return User.find({
            where: whereClause,
            relations: ['posts', 'title'],
            take: limit,
            order: { id: "ASC" }
        });
    }

    @Query(() => [User])
    usersSearch(
        @Arg('search', () => String) search: string,
    ): Promise<User[]> {
        return User.find({
            where: [
                { name: ILike(`%${search}%`) },
            ],
            take: 10,
            cache: 30000
        });
    }

    @Query(() => User, { nullable: true })
    user(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<User | null> {
        return User.findOne({
            where: { uuid: uuid },
            relations: ['posts', 'title']
        });
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg('email', () => String) email: string,
        @Arg('name', () => String) name: string,
        @Arg('password', () => String) password: string,
        @Arg('phone', () => String) phone: string,
        @Arg('emergPhone', () => String) emergPhone: string,
        @Arg('emergContact', () => String) emergContact: string,
        @Arg('waivered', () => Boolean) waivered: boolean,
        @Arg('newsletter', () => Boolean) newsletter: boolean,
        @Arg('privacyLevel', () => Int) privacyLevel: number,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        const errors = getRegisterErrors(email, password, name);
        if (errors) {
            return { errors: errors }
        }

        const hash = await argon2.hash(password);

        // Attempt to create user.
        let user;
        try {
            user = await User.create({
                email: email,
                name: name,
                password: hash,
                phone: phone,
                emergPhone: emergPhone,
                emergContact: emergContact,
                waivered: waivered,
                newsletter: newsletter,
                privacyLevel: privacyLevel
            }).save()
            // Log in the user.
            req.session.uuid = user.uuid;
            req.session.accessLevel = user.accessLevel;

        } catch (err: any) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Email/name already exists" }] }
            }
            console.log("Registration error:", err);
        }


        return { user };
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        email = email.toLowerCase();
        const user = await User.findOne(
            { where: { email: email } }
        );

        if (!user) {
            return {
                errors: [{ field: 'email', message: 'User not found' }]
            }
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [{ field: 'password', message: 'Incorrect password' }]
            }
        }

        // Log in.
        req.session.uuid = user.uuid;
        req.session.accessLevel = user.accessLevel;

        return { user };
    }


    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err: any) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.error(err);
                    resolve(false);
                    return;
                }

                resolve(true);
            })
        );
    }


    @Mutation(() => Boolean)
    async rfidLogin(
        @Arg('rfid') rfid: string,
        @Arg('durationSeconds', () => Int, { defaultValue: 30 }) durationSeconds: number,
        @Ctx() { redisClient }: MyContext
    ): Promise<Boolean> {

        const user = await User.findOne({ where: { rfid: rfid } });
        if (!user) {
            return false;
        }

        await redisClient.set(
            RFID_PREFIX + rfid,
            user.uuid,
            "EX",
            durationSeconds
        );

        return true;
    }

    @Mutation(() => Boolean)
    async rfidLogout(
        @Arg('uuid') uuid: string,
        @Ctx() { redisClient }: MyContext
    ): Promise<Boolean> {

        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return false;
        }
        await redisClient.del(RFID_PREFIX + user.rfid);

        return true;
    }

    @Query(() => [String])
    async rfids(
        @Ctx() { redisClient }: MyContext
    ): Promise<String[]> {
        // Docs: https://luin.github.io/ioredis/classes/Redis.html
        const keys = await redisClient.keys(`${RFID_PREFIX}*`);
        if (keys.length === 0) {
            return []
        }
        const values = await redisClient.mget(keys);
        return values as string[];
    }




    @Mutation(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    async updateUser(
        @Arg('uuid', () => Int) uuid: string,
        @Arg('bio', () => String) bio: string,
    ): Promise<User | null> {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return null;
        }
        if (typeof bio !== 'undefined') {
            await User.update({ uuid }, { bio })
        }
        return user;
    }


    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteUser(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<Boolean> {
        try {
            await User.delete(uuid);
        } catch {
            return false
        }
        return true;
    }

}
