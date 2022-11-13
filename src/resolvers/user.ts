import { User } from "../entities/User";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { MyContext, FieldError } from "../types";
import argon2 from "argon2"
import { COOKIE_NAME, FORGOT_PASS_PREFIX } from "../constants";
import { nanoid } from "nanoid";
import { sendEmail } from "../utils/sendEmail";
import { getPasswordErrors, getRegisterErrors } from "../utils/validateForms";

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}


@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    me(
        @Ctx() { req }: MyContext
    ) {
        if (!req.session.uuid) {
            return null
        }

        return User.findOne({ where: { uuid: req.session.uuid } });
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
            `Click to <a href='http://localhost:3000/reset-password/${token}'>reset your password</a>. This link will expire in 48 hours.`
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
        return { user }
    }

    @Query(() => [User])
    users(
    ): Promise<User[]> {
        return User.find();
    }

    @Query(() => User, { nullable: true })
    user(
        @Arg('uuid', () => String) uuid: string,
    ): Promise<User | null> {
        return User.findOne({ where: { uuid: uuid } });
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg('email', () => String) email: string,
        @Arg('username', () => String) username: string,
        @Arg('password', () => String) password: string,
        @Arg('name', () => String, { nullable: true }) name: string | null,
        @Arg('phone', () => String, { nullable: true }) phone: string | null,
        @Arg('emerg_contact', () => String, { nullable: true }) emerg_contact: string | null,
        @Arg('newsletter', () => Boolean) newsletter: boolean,
        @Arg('privacy_level', () => Int) privacy_level: number,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {

        const errors = getRegisterErrors(email, password, username);
        if (errors) {
            return { errors: errors }
        }

        const hash = await argon2.hash(password);
        let user;

        // Attempt to create user.
        try {
            user = await User.create({
                // id: -1, //TODO REMOVE?
                email: email,
                username: username,
                password: hash,
                name: name ? name : "TODO",
                phone: phone ? phone : "TODO",
                emerg_contact: emerg_contact ? emerg_contact : "TODO",
                newsletter: newsletter,
                privacy_level: privacy_level
            }).save()
            // Log in the user.
            req.session.uuid = user.uuid;
        } catch (err: any) {
            if (err && err.code === "23505") {
                return { errors: [{ field: "email", message: "Email already exists" }] }
            }
            console.log("Registration error:", err);
        }


        return { user };
    }


    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        usernameOrEmail = usernameOrEmail.toLowerCase();
        const user = await User.findOne(
            usernameOrEmail.includes("@")
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
        );

        if (!user) {
            return {
                errors: [{ field: 'usernameOrEmail', message: 'User not found' }]
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

    @Mutation(() => User, { nullable: true })
    async updateUser(
        @Arg('uuid', () => Int) uuid: string,
        @Arg('title', () => String) title: string,
    ): Promise<User | null> {
        const user = await User.findOne({ where: { uuid: uuid } });
        if (!user) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await User.update({ uuid }, { title })
        }
        return user;
    }


    @Mutation(() => Boolean)
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
