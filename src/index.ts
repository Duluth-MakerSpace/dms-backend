import { COOKIE_NAME, SESSION_SECRET, __prod__ } from "./constants";
import 'reflect-metadata';
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// import { sendEmail } from "./utils/sendEmail";
import { AppDataSource } from "./data-source";

const main = async () => {
    const conn = await AppDataSource.initialize();
    await conn.runMigrations();

    const app = express();

    const Redis = require("ioredis");
    const session = require('express-session');
    let RedisStore = require('connect-redis')(session);
    const redisClient = new Redis(); // uses defaults unless given configuration

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ client: redisClient }), // ttl default: 1 day, disableTouch
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: false,
                sameSite: "lax", // CSRF
                secure: __prod__, // in prod, cookie only works in https
            },
            saveUninitialized: false,
            secret: SESSION_SECRET,
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redisClient })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { credentials: true, origin: ["http://localhost:3000", "https://studio.apollographql.com"] },
    });

    app.listen(4000, () => {
        console.log('Backend started on localhost:4000')
    })
};

main().catch((err) => {
    console.error(err)
});