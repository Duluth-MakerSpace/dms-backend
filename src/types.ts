import { Field, ObjectType } from "type-graphql";
import { Request, Response } from 'express'
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";


export type MyContext = {
    req: Request & {
        session: Session & Partial<SessionData> & { uuid: string };
    };
    res: Response;
    redisClient: Redis;
};

@ObjectType()
export class FieldError {
    @Field(() => String)
    field: string = "FieldError";

    @Field(() => String)
    message: string = "An unknown error has occurred";
};