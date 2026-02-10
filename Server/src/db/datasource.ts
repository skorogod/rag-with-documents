import { DataSource } from "typeorm";
import { ChatMessage } from "./entities/chatMessage.entity";
import { Document } from "./entities/document.entity";
import path from "node:path";

export const AppDataSource = new DataSource({
  type: 'postgres', // или другой тип БД
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'chat_db',
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [ChatMessage, Document],
  migrations: ["src/db/migrations/*.ts"],
  subscribers: [],
});