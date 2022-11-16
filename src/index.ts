import { BACKEND_URL, COOKIE_NAME, FRONTEND_URL, SESSION_SECRET, __prod__ } from "./constants";
import 'reflect-metadata';
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
// import { sendEmail } from "./utils/sendEmail";
import { AppDataSource } from "./data-source";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { CertificationResolver } from "./resolvers/certification";
import { ClassTemplateResolver } from "./resolvers/classTemplate";
import { CalendarClassResolver } from "./resolvers/calendarClass";
import { EventTemplateResolver } from "./resolvers/eventTemplate";
import { CalendarEventResolver } from "./resolvers/calendarEvent";

// import { Certification } from "./entities/Certification";
import { EventTemplate } from "./entities/EventTemplate";
import { ClassTemplate } from "./entities/ClassTemplate";
import { User } from "./entities/User";
import { CalendarClass } from "./entities/CalendarClass";

const main = async () => {
    const conn = await AppDataSource.initialize();
    await conn.runMigrations();

    // await Certification.delete({})
    // await Certification.create({ title: "CNC", description: "CNC routers for wood and other suitable materials", image: "cnc" }).save();
    // await Certification.create({ title: "Welding", description: "MIG, TIG, Oxy-fuel, etc.", image: "welding" }).save();
    // await Certification.create({ title: "Laser cutter", description: "You'll shoot your eye out.", image: "laser" }).save();
    // await Certification.create({ title: "Belt sander", description: "...", image: "cnc" }).save();

    await User.delete({});
    await CalendarClass.delete({});
    await ClassTemplate.delete({});
    await EventTemplate.delete({});

    const pword = "$argon2id$v=19$m=65536,t=3,p=4$/KEEQbuhTN1kSOYxRimPuA$1c1WLvoyWhQOyT1cJKNT6f61BR1+8QT+Mmi0jo1v+Uw";
    const u1 = await User.create({ email: "jkrenov@email.com", bio: "I used to be a cowboy.", password: pword, name: "James Krenov", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save()
    const u2 = await User.create({ email: "sammaloooof@email.com", password: pword, name: "Sam Maloof", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save()
    const u3 = await User.create({ email: "gnakashima@email.com", bio: "I used to be a cowboy.", password: pword, name: "George Nakashima", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save()
    const u4 = await User.create({ email: "nabram@email.com", password: pword, name: "Norm Abram", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save()
    const u5 = await User.create({ email: "gustav@email.com", bio: "I used to be a cowboy.", password: pword, name: "Gustav Stickley", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: true, newsletter: false, privacyLevel: 1 }).save()
    const u6 = await User.create({ email: "roy.underhill@email.com", password: pword, name: "Roy Underhill", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save()
    const u7 = await User.create({ email: "Andre.Roubo@email.com", password: pword, name: "André Jacob Roubo", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save()
    const u8 = await User.create({ email: "knapp@email.com", password: pword, name: "Charles Knapp", phone: "+12345678987", emergContact: "King of England", emergPhone: "911", waivered: false, newsletter: false, privacyLevel: 1 }).save()

    const t1 = await ClassTemplate.create({ "title": "Defense Against the Dark Arts", "description": "The Dark Arts, also known as Dark Magic, refers to any type of magic that is mainly used to cause harm. The Dark Arts encompass many spells and actions ranging from using the Unforgivable Curses to brewing harmful or poisonous potions to breeding Dark creatures such as Basilisks, and its practise is generally illegal. Practitioners are referred to as Dark wizards or witches, the most prominent and powerful of whom was Lord Voldemort. His followers, known as Death Eaters, also practised the Dark Arts.", "image": "https://miro.medium.com/max/826/1*y-aPR4CC8PD_s8638FkVnA.jpeg" }).save();
    const t2 = await ClassTemplate.create({ "title": "Kindergarten 106", "description": "Kindergarten is a preschool educational approach based on playing, singing, practical activities such as drawing, and social interaction as part of the transition from home to school. Such institutions were originally made in the late 18th century in Germany, Bavaria and Alsace to serve children whose parents both worked outside home. The term was coined by the German Friedrich Fröbel.", "image": "https://upload.wikimedia.org/wikipedia/commons/7/71/Kindergarten_is_fun_%282908834379%29.jpg" }).save();

    await CalendarClass.create({ "duration": 60, "dates": [new Date()], "lastDate": new Date(), "memberCost": 10.50, "cost": 50.10, "maxParticipants": 10, "instructor": u1, "classTemplate": t1 }).save();
    await CalendarClass.create({ "duration": 120, "dates": [new Date(), new Date()], "lastDate": new Date(), "memberCost": 26.00, "cost": 31.00, "maxParticipants": 12, "instructor": u2, "classTemplate": t2, "participants": [u3, u4, u5, u6, u7, u8] }).save();

    await EventTemplate.create({ "title": "Community Build Night", "description": "Open house: no membership required. Brainstorm, explore, learn. Must be 18+ and sign waiver.", "image": "https://www.picturethisgallery.com/wp-content/uploads/The-Quilting-Bee-19th-Century-Americana-Morgan-Weistling.jpg" }).save();
    await EventTemplate.create({ "title": "Board Meeting", "description": "Monthly board meeting to discuss operations. Shop space is still open.", "image": "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fe9a04046-aaff-4548-90e2-fa7d6cd09115.jpg?fit=scale-down&source=next&width=700" }).save();
    await EventTemplate.create({ "title": "Work Night", "description": "Call for volunteers to help improve the MakerSpace.", "image": "https://www.goodshomedesign.com/wp-content/uploads/2020/11/carter2.jpeg" }).save();


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
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
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
            resolvers: [
                PostResolver,
                UserResolver,
                CertificationResolver,
                ClassTemplateResolver,
                EventTemplateResolver,
                CalendarClassResolver,
                CalendarEventResolver,
            ],
            validate: false
        }),
        context: ({ req, res }) => ({ req, res, redisClient })
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: { credentials: true, origin: [FRONTEND_URL, "https://studio.apollographql.com"] },
    });

    app.listen(4000, () => {
        console.log(`Backend started on ${BACKEND_URL}`)
    })
};

main().catch((err) => {
    console.error(err)
});