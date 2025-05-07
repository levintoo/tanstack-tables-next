import * as t from "drizzle-orm/sqlite-core";

export const roles = t.sqliteTable("roles", {
  id: t.int().primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull().unique(),
});
