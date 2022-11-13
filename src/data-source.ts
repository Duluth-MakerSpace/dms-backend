import { DataSource } from "typeorm";
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
    entities: [User, Post],
    subscribers: [],
    migrations: [],
})