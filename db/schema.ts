import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const pastes = pgTable("pastes", {
  id: serial().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
