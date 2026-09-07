import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./drizzle/maria-app.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  strict: true,
  verbose: true,
});
