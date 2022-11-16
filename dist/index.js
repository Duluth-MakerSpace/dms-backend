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
const data_source_1 = require("./data-source");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
const certification_1 = require("./resolvers/certification");
const classTemplate_1 = require("./resolvers/classTemplate");
const calendarClass_1 = require("./resolvers/calendarClass");
const eventTemplate_1 = require("./resolvers/eventTemplate");
const calendarEvent_1 = require("./resolvers/calendarEvent");
const EventTemplate_1 = require("./entities/EventTemplate");
const ClassTemplate_1 = require("./entities/ClassTemplate");
const User_1 = require("./entities/User");
const CalendarClass_1 = require("./entities/CalendarClass");
const main = async () => {
    const conn = await data_source_1.AppDataSource.initialize();
    await conn.runMigrations();
    await User_1.User.delete({});
    await CalendarClass_1.CalendarClass.delete({});
    await ClassTemplate_1.ClassTemplate.delete({});
    await EventTemplate_1.EventTemplate.delete({});
    const pword = "$argon2id$v=19$m=65536,t=3,p=4$/KEEQbuhTN1kSOYxRimPuA$1c1WLvoyWhQOyT1cJKNT6f61BR1+8QT+Mmi0jo1v+Uw";
    const u1 = await User_1.User.create({ email: "jkrenov@email.com", bio: "I used to be a cowboy.", password: pword, name: "James Krenov", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save();
    const u2 = await User_1.User.create({ email: "sammaloooof@email.com", password: pword, name: "Sam Maloof", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u3 = await User_1.User.create({ email: "gnakashima@email.com", bio: "I used to be a cowboy.", password: pword, name: "George Nakashima", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save();
    const u4 = await User_1.User.create({ email: "nabram@email.com", password: pword, name: "Norm Abram", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u5 = await User_1.User.create({ email: "gustav@email.com", bio: "I used to be a cowboy.", password: pword, name: "Gustav Stickley", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save();
    const u6 = await User_1.User.create({ email: "roy.underhill@email.com", password: pword, name: "Roy Underhill", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u7 = await User_1.User.create({ email: "Andre.Roubo@email.com", password: pword, name: "André Jacob Roubo", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u8 = await User_1.User.create({ email: "knapp@email.com", password: pword, name: "Charles Knapp", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const t1 = await ClassTemplate_1.ClassTemplate.create({ "title": "Defense Against the Dark Arts", "description": "The Dark Arts, also known as Dark Magic, refers to any type of magic that is mainly used to cause harm. The Dark Arts encompass many spells and actions ranging from using the Unforgivable Curses to brewing harmful or poisonous potions to breeding Dark creatures such as Basilisks, and its practise is generally illegal. Practitioners are referred to as Dark wizards or witches, the most prominent and powerful of whom was Lord Voldemort. His followers, known as Death Eaters, also practised the Dark Arts.", "image": "https://miro.medium.com/max/826/1*y-aPR4CC8PD_s8638FkVnA.jpeg" }).save();
    const t2 = await ClassTemplate_1.ClassTemplate.create({ "title": "Kindergarten 106", "description": "Kindergarten is a preschool educational approach based on playing, singing, practical activities such as drawing, and social interaction as part of the transition from home to school. Such institutions were originally made in the late 18th century in Germany, Bavaria and Alsace to serve children whose parents both worked outside home. The term was coined by the German Friedrich Fröbel.", "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Kindergarten_is_fun_%282908834379%29.jpg" }).save();
    await CalendarClass_1.CalendarClass.create({ "duration": 60, "dates": [new Date()], "lastDate": new Date(), "memberCost": 10.50, "cost": 50.10, "maxParticipants": 10, "instructor": u1, "classTemplate": t1 }).save();
    await CalendarClass_1.CalendarClass.create({ "duration": 120, "dates": [new Date(), new Date()], "lastDate": new Date(), "memberCost": 26.00, "cost": 31.00, "maxParticipants": 12, "instructor": u2, "classTemplate": t2, "participants": [u3, u4, u5, u6, u7, u8] }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Community Build Night", "description": "Open house: no membership required. Brainstorm, explore, learn. Must be 18+ and sign waiver.", "image": "https://www.picturethisgallery.com/wp-content/uploads/The-Quilting-Bee-19th-Century-Americana-Morgan-Weistling.jpg" }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Board Meeting", "description": "Monthly board meeting to discuss operations. Shop space is still open.", "image": "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fe9a04046-aaff-4548-90e2-fa7d6cd09115.jpg?fit=scale-down&source=next&width=700" }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Work Night", "description": "Call for volunteers to help improve the MakerSpace.", "image": "https://www.goodshomedesign.com/wp-content/uploads/2020/11/carter2.jpeg" }).save();
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
            resolvers: [
                post_1.PostResolver,
                user_1.UserResolver,
                certification_1.CertificationResolver,
                classTemplate_1.ClassTemplateResolver,
                eventTemplate_1.EventTemplateResolver,
                calendarClass_1.CalendarClassResolver,
                calendarEvent_1.CalendarEventResolver,
            ],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redisClient })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { credentials: true, origin: [constants_1.FRONTEND_URL, "https://studio.apollographql.com"] },
    });
    app.listen(4000, () => {
        console.log(`Backend started on ${constants_1.BACKEND_URL}`);
    });
};
main().catch((err) => {
    console.error(err);
});
