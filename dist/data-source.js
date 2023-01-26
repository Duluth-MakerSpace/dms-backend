"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const CalendarClass_1 = require("./entities/CalendarClass");
const CalendarEvent_1 = require("./entities/CalendarEvent");
const Certification_1 = require("./entities/Certification");
const ClassTemplate_1 = require("./entities/ClassTemplate");
const EventTemplate_1 = require("./entities/EventTemplate");
const Fee_1 = require("./entities/Fee");
const Membership_1 = require("./entities/Membership");
const Post_1 = require("./entities/Post");
const Title_1 = require("./entities/Title");
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: 'postgres',
    password: 'postgres',
    database: 'dmsdb',
    synchronize: true,
    logging: true,
    cache: true,
    entities: [User_1.User, Post_1.Post, Certification_1.Certification, ClassTemplate_1.ClassTemplate, CalendarClass_1.CalendarClass, EventTemplate_1.EventTemplate, CalendarEvent_1.CalendarEvent, Title_1.Title, Fee_1.Fee, Membership_1.Membership],
    subscribers: [],
    migrations: [],
});
