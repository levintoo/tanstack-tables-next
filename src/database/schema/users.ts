import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { roles } from "@/database/schema";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  roleId: integer("role_id").references(() => roles.id),
});
