import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "node:path";


dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const host = String(process.env.POSTGRES_HOST ?? "localhost");
const port = Number(process.env.POSTGRES_PORT ?? 5432);
const username = String(process.env.POSTGRES_USER ?? "postgres");
const password = String(process.env.POSTGRES_PASSWORD ?? "root");
const database = String(process.env.POSTGRES_DB ?? "postgres");

console.log("[DB]", { host, port, database, user: username, password: password ? "***" : "(empty)" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: false,
  entities: [path.join(path.dirname(new URL(import.meta.url).pathname), "entities", "*.js")],
  migrations: [],
});

export default AppDataSource;
