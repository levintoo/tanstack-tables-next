"use server";

import { db } from "@/database/db";
import { users } from "@/database/schema";
import * as z from "zod";
import { SqliteError } from "better-sqlite3";
import { sql, eq } from "drizzle-orm";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
});

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    return { error: "Name and email are required" };
  }

  try {
    await db.insert(users).values({ name, email });
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Failed to create user" };
  }
}

export async function getUsers(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;
    const data = await db.select().from(users).limit(pageSize).offset(offset);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return {
      data,
      total: count,
      pageCount: Math.ceil(count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
}

export async function deleteUser(id: number) {
  try {
    await db.delete(users).where(eq(users.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Failed to delete user" };
  }
}
