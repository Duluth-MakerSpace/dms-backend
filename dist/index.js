"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const data_source_1 = require("./data-source");
const main = async () => {
    const conn = await data_source_1.AppDataSource.initialize();
    await conn.runMigrations();
    const app = (0, express_1.default)();
    const Redis = require("ioredis");
    const session = require('express-session');
    let RedisStore = require('connect-redis')(session);
    const redisClient = new Redis();
    app.use(session({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({ client: redisClient }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: false,
            sameSite: "lax",
            secure: constants_1.__prod__,
        },
        saveUninitialized: false,
        secret: constants_1.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [post_1.PostResolver, user_1.UserResolver],
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
        console.log('Backend started on localhost:4000');
    });
};
main().catch((err) => {
    console.error(err);
});
