"use server";

import { db } from "@/database/db";
import { users } from "@/database/schema";
import * as z from "zod";
import { SqliteError } from "better-sqlite3";

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
