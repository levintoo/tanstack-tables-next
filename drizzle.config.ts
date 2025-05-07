import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./src/database/database.sqlite",
  },
  verbose: true,
  strict: true,
} satisfies Config;
