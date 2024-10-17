import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(pool);

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  raceId: integer("race_id").references(() => Races.id, {
    onDelete: "set null",
  }),
  classId: integer("class_id").references(() => Classes.id, {
    onDelete: "set null",
  }),
  invite_code_id: integer("invite_code_id").references(() => InviteCodes.id),
});

export const Races = pgTable("races", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const Classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const InviteCodes = pgTable("invite_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  usedAt: timestamp("used_at"),
});
