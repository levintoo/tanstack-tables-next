"use server";

import { db } from "@/database/db";
import { users } from "@/database/schema";
import * as z from "zod";
import { SqliteError } from "better-sqlite3";
import { sql } from "drizzle-orm";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
});

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const result = formSchema.safeParse({ name, email });

  if (!result.success) {
    return {
      error: result.error.errors[0].message,
    };
  }

  try {
    await db.insert(users).values({
      name,
      email,
    });
    return { success: true };
  } catch (error) {
    if (
      error instanceof SqliteError &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        error: "This email address is already registered",
      };
    }
    return {
      error: "Failed to create user. Please try again.",
    };
  }
}

export async function getUsers(page: number = 1, pageSize: number = 10) {
  try {
    const offset = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.select().from(users).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users),
    ]);

    return {
      data,
      total: total[0].count,
      pageCount: Math.ceil(total[0].count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to fetch users" };
  }
}
