import { DataSource } from "typeorm";
import { CalendarClass } from "./entities/CalendarClass";
import { CalendarEvent } from "./entities/CalendarEvent";
import { Certification } from "./entities/Certification";
import { ClassTemplate } from "./entities/ClassTemplate";
import { EventTemplate } from "./entities/EventTemplate";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    // host: "localhost",
    // port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'dmstest',
    synchronize: true, // run migrations
    logging: true,
    cache: true,
    entities: [User, Post, Certification, ClassTemplate, CalendarClass, EventTemplate, CalendarEvent],
    subscribers: [],
    migrations: [],
})