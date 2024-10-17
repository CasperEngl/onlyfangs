import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    database: "postgres",
    host: "localhost",
    ssl: process.env.NODE_ENV === "production",
  },
});
