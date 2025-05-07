"use server";

import { db } from "@/database/db";
import { users, roles } from "@/database/schema";
import * as z from "zod";
import { sql, eq } from "drizzle-orm";
import { SqliteError } from "better-sqlite3";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
});

const MAX_PAGE_SIZE = 50;

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;

  const result = formSchema.safeParse({ name, email });

  if (!result.success) {
    return {
      error: result.error.errors[0].message,
    };
  }

  try {
    await db.insert(users).values({
      name: result.data.name,
      email: result.data.email,
      roleId: roleId ? parseInt(roleId) : null,
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
    // Validate and clamp page size
    const validatedPageSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const offset = (page - 1) * validatedPageSize;

    const data = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        roleId: users.roleId,
        roleName: sql<string>`COALESCE(${roles.name}, 'No Role')`.as(
          "roleName"
        ),
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .limit(validatedPageSize)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return {
      data,
      total: count,
      pageCount: Math.ceil(count / validatedPageSize),
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

export async function getRoles() {
  try {
    const rolesList = await db.select().from(roles);
    return { data: rolesList };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { error: "Failed to fetch roles" };
  }
}
