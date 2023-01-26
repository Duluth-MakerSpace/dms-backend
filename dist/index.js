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
const Post_1 = require("./entities/Post");
const title_1 = require("./resolvers/title");
const Title_1 = require("./entities/Title");
const membership_1 = require("./resolvers/membership");
const Membership_1 = require("./entities/Membership");
const main = async () => {
    const conn = await data_source_1.AppDataSource.initialize();
    await conn.runMigrations();
    await User_1.User.delete({});
    await CalendarClass_1.CalendarClass.delete({});
    await ClassTemplate_1.ClassTemplate.delete({});
    await EventTemplate_1.EventTemplate.delete({});
    await Membership_1.Membership.delete({});
    await Title_1.Title.delete({});
    const title1 = await Title_1.Title.create({ title: "Maker" }).save();
    await Title_1.Title.create({ title: "Jack-of-all-trades" }).save();
    await Title_1.Title.create({ title: "Woodworker" }).save();
    await Title_1.Title.create({ title: "Metalworker" }).save();
    await Title_1.Title.create({ title: "Potter" }).save();
    await Title_1.Title.create({ title: "Lapidarist" }).save();
    await Title_1.Title.create({ title: "Hobbyist" }).save();
    await Title_1.Title.create({ title: "Enthusiast" }).save();
    await Title_1.Title.create({ title: "CNC Devotee" }).save();
    await Title_1.Title.create({ title: "3D Printer Expert" }).save();
    await Title_1.Title.create({ title: "Leatherworker" }).save();
    await Title_1.Title.create({ title: "Rock Hound" }).save();
    await Title_1.Title.create({ title: "Likes Lasers" }).save();
    await Title_1.Title.create({ title: "Seamster" }).save();
    await Title_1.Title.create({ title: "Founder", type: "private" }).save();
    const title2 = await Title_1.Title.create({ title: "Director", type: "private" }).save();
    await Title_1.Title.create({ title: "Treasurer", type: "private" }).save();
    await Title_1.Title.create({ title: "Secretary", type: "private" }).save();
    const pword = "$argon2id$v=19$m=65536,t=3,p=4$/KEEQbuhTN1kSOYxRimPuA$1c1WLvoyWhQOyT1cJKNT6f61BR1+8QT+Mmi0jo1v+Uw";
    const u1 = await User_1.User.create({ email: "jkrenov@email.com", title: title2, bio: "I'm the fake director and I have the highest access level.", password: pword, name: "James Krenov", phone: "+12345678987", emergContact: "Britta Krenov", emergPhone: "911", rfid: "rfid1", waivered: true, newsletter: false, privacyLevel: 1, accessLevel: 3 }).save();
    const u2 = await User_1.User.create({ email: "sammaloooof@email.com", title: title1, password: pword, name: "Sam Maloof", phone: "+12345678987", emergContact: "Beverly Wingate Maloof ", emergPhone: "911", rfid: "rfid2", waivered: false, newsletter: false, privacyLevel: 2, accessLevel: 2 }).save();
    const u3 = await User_1.User.create({ email: "gnakashima@email.com", title: title1, bio: "I used to be a cowboy.", password: pword, name: "George Nakashima", phone: "+12345678987", emergContact: "Marion Okajima", emergPhone: "911", rfid: "rfid3", waivered: true, newsletter: false, privacyLevel: 3 }).save();
    const u4 = await User_1.User.create({ email: "nabram@email.com", title: title1, password: pword, name: "Norm Abram", phone: "+12345678987", emergContact: "Roy Underhill", emergPhone: "911", rfid: "rfid4", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u5 = await User_1.User.create({ email: "gustav@email.com", title: title1, bio: "I'm just a regular old user...", password: pword, name: "Gustav Stickley", phone: "+12345678987", emergContact: "The King of England", emergPhone: "911", rfid: "rfid5", waivered: true, newsletter: false, privacyLevel: 2 }).save();
    const u6 = await User_1.User.create({ email: "roy.underhill@email.com", title: title1, password: pword, name: "Roy Underhill", phone: "+12345678987", emergContact: "Norm Abram", emergPhone: "911", rfid: "rfid6", waivered: false, newsletter: false, privacyLevel: 3 }).save();
    const u7 = await User_1.User.create({ email: "Andre.Roubo@email.com", title: title1, password: pword, name: "André Jacob Roubo", phone: "+12345678987", emergContact: "Marquis de Marbeuf", emergPhone: "911", rfid: "rfid7", waivered: false, newsletter: false, privacyLevel: 1 }).save();
    const u8 = await User_1.User.create({ email: "knapp@email.com", title: title1, bio: "I'm a regular user but my membership expired a few years ago!", password: pword, name: "Charles Knapp", phone: "+12345678987", emergContact: "Charlotte Augusta Ford", emergPhone: "911", rfid: "rfid8", waivered: false, newsletter: false, privacyLevel: 2 }).save();
    await Membership_1.Membership.create({ type: "Basic", cost: 10.00, days: 31, user: u1 }).save();
    const m1 = await Membership_1.Membership.create({ type: "Basic", cost: 10.00, days: 31, user: u8 }).save();
    m1.createdAt = new Date("December 3, 1999");
    await m1.save();
    const t1 = await ClassTemplate_1.ClassTemplate.create({ "title": "Hand Tools 101", "description": "Learn to use the basic traditional hand tools for woodworking, no electricity required.", "image": "https://woodandshop.com/wp-content/uploads/2021/06/Hand-cut-Dovetails-09.jpg" }).save();
    const t2 = await ClassTemplate_1.ClassTemplate.create({ "title": "Basic Lapidary Skills", "description": "Develop basic jewellery-making skills with our collection of tools for the lapidary arts.", "image": "https://i.ytimg.com/vi/DCuAFkG5vDE/maxresdefault.jpg" }).save();
    const t3 = await ClassTemplate_1.ClassTemplate.create({ "title": "Basics of TIG Welding", "description": "Gas tungsten arc welding (GTAW), also known as tungsten inert gas (TIG) welding, is an arc welding process that uses a non-consumable tungsten electrode to produce the weld. The process grants the operator greater control over the weld than competing processes such as shielded metal arc welding and gas metal arc welding, allowing for stronger, higher quality welds. However, GTAW is comparatively more complex and difficult to master, and furthermore, it is significantly slower than most other welding techniques..", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/US_Navy_090715-N-5821P-002_Aviation_Support_Equipment_Technician_Airman_Anthony_Hammond_performs_tungsten_inert_gas_welding_during_a_training_evolution.jpg/1084px-US_Navy_090715-N-5821P-002_Aviation_Support_Equipment_Technician_Airman_Anthony_Hammond_performs_tungsten_inert_gas_welding_during_a_training_evolution.jpg" }).save();
    await ClassTemplate_1.ClassTemplate.create({ "title": "Defense Against the Dark Arts", "description": "The Dark Arts, also known as Dark Magic, refers to any type of magic that is mainly used to cause harm. The Dark Arts encompass many spells and actions ranging from using the Unforgivable Curses to brewing harmful or poisonous potions to breeding Dark creatures such as Basilisks, and its practise is generally illegal. Practitioners are referred to as Dark wizards or witches, the most prominent and powerful of whom was Lord Voldemort. His followers, known as Death Eaters, also practised the Dark Arts.", "image": "https://miro.medium.com/max/826/1*y-aPR4CC8PD_s8638FkVnA.jpeg" }).save();
    await ClassTemplate_1.ClassTemplate.create({ "title": "Kindergarten 106", "description": "Kindergarten is a preschool educational approach based on playing, singing, practical activities such as drawing, and social interaction as part of the transition from home to school. Such institutions were originally made in the late 18th century in Germany, Bavaria and Alsace to serve children whose parents both worked outside home. The term was coined by the German Friedrich Fröbel.", "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Kindergarten_is_fun_%282908834379%29.jpg" }).save();
    await CalendarClass_1.CalendarClass.create({ "duration": 60, "dates": [new Date("November 21, 2022 16:00")], "memberCost": 10.50, "cost": 50.10, "maxParticipants": 10, "instructor": u1, "classTemplate": t1 }).save();
    await CalendarClass_1.CalendarClass.create({ "duration": 120, "dates": [new Date('December 17, 2022 13:30'), new Date("December 21, 2022 13:30")], "memberCost": 26.00, "cost": 31.00, "maxParticipants": 12, "instructor": u2, "classTemplate": t2, "participants": [u3, u4, u5, u6, u7, u8] }).save();
    await CalendarClass_1.CalendarClass.create({ "duration": 120, "dates": [new Date('December 25, 2022 12:30')], "memberCost": 615.00, "cost": 620.00, "maxParticipants": 3, "instructor": u2, "classTemplate": t3, "participants": [u8] }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Community Build Night", "description": "Open house: no membership required. Brainstorm, explore, learn. Must be 18+ and sign waiver.", "image": "https://www.picturethisgallery.com/wp-content/uploads/The-Quilting-Bee-19th-Century-Americana-Morgan-Weistling.jpg" }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Board Meeting", "description": "Monthly board meeting to discuss operations. Shop space is still open.", "image": "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fe9a04046-aaff-4548-90e2-fa7d6cd09115.jpg?fit=scale-down&source=next&width=700" }).save();
    await EventTemplate_1.EventTemplate.create({ "title": "Work Night", "description": "Call for volunteers to help improve the MakerSpace.", "image": "https://www.goodshomedesign.com/wp-content/uploads/2020/11/carter2.jpeg" }).save();
    await Post_1.Post.create({ author: u1, category: 1, title: "First post", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 1, title: "Second post", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 3, title: "Third post", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 3, title: "Fourth post", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 2, title: "Fifth post", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 2, title: "Big metal shop update", content: "Welcome, everybody." }).save();
    await Post_1.Post.create({ author: u1, category: 1, title: "New Nd:YAG laser cutter", content: "Hello, everybody. There is a new laser cutter available courtesy of the recent grant. It's a 1064nm Nd:YAG laser so make sure not to shine it in your eyes. We've written up a quick user manual accessible here." }).save();
    await Post_1.Post.create({ author: u1, category: 1, title: "Guide: using the 100W laser cutter", content: "Hello, everybody. There is a new laser cutter available courtesy of the recent grant. It's a 1064nm Nd:YAG laser so make sure not to shine it in your eyes. We've written up a quick user manual accessible here." }).save();
    await Post_1.Post.create({ author: u1, category: 1, title: "New website launched", content: "Welcome, everybody. We have a new website made out of Typescript, TypeGraphQL, Apollo, Express, Redis, PostGres, urql, typeorm, and a bunch of other things I'm probably forgetting." }).save();
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
                title_1.TitleResolver,
                membership_1.MembershipResolver,
            ]
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
