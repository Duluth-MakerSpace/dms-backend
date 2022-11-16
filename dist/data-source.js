"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const CalendarClass_1 = require("./entities/CalendarClass");
const CalendarEvent_1 = require("./entities/CalendarEvent");
const Certification_1 = require("./entities/Certification");
const ClassTemplate_1 = require("./entities/ClassTemplate");
const EventTemplate_1 = require("./entities/EventTemplate");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: 'postgres',
    password: 'postgres',
    database: 'dmstest',
    synchronize: true,
    logging: true,
    cache: true,
    entities: [User_1.User, Post_1.Post, Certification_1.Certification, ClassTemplate_1.ClassTemplate, CalendarClass_1.CalendarClass, EventTemplate_1.EventTemplate, CalendarEvent_1.CalendarEvent],
    subscribers: [],
    migrations: [],
});
