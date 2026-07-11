import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

export const library_files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  file_name: text("file_name").notNull(),
  file_path: text("file_path").notNull().unique(),
  file_hash: text("file_hash").notNull(),
  file_size: integer("file_size").notNull(),
  title: text("title"),
  author: text("author"),
  language: text("language"),
  category: text("category"),
  category_id: integer("category_id").references(() => categories.id),
  created_at: integer("created_at", { mode: "timestamp" }),
  view_count: integer("view_count").default(0),
  last_accessed: integer("last_accessed", { mode: 'timestamp' }),
}, (table) => ({
  nameIdx: index("idx_file_name").on(table.file_name),
}));

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  file_id: integer("file_id").references(() => library_files.id, { onDelete: "cascade" }),
  is_global: integer("is_global", { mode: "boolean" }).default(false),
  category_id: integer("category_id").references(() => categories.id, { onDelete: "cascade" }),
});
export const file_activity = sqliteTable("file_activity", {
  id: integer("id").primaryKey(),
  file_id: integer("file_id").references(() => library_files.id),
  // Using integer with mode: 'timestamp' stores the date as a Unix timestamp
  accessed_at: integer("accessed_at", { mode: 'timestamp' }).default(new Date()),
  interaction_type: text("interaction_type"),
});
export const system_metadata = pgTable("system_metadata", {
  id: serial("id").primaryKey(),
  last_scanned: timestamp("last_scanned").defaultNow(),
});