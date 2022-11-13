"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    username: 'postgres',
    password: 'postgres',
    database: 'dmstest',
    synchronize: true,
    logging: true,
    entities: [User_1.User, Post_1.Post],
    subscribers: [],
    migrations: [],
});
