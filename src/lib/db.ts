import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient across hot-reloads in development to avoid
// exhausting database connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * True when a database connection string is configured. Data helpers check this
 * so that a build (or a misconfigured deploy) with no DATABASE_URL degrades
 * gracefully to empty data instead of throwing Prisma validation errors.
 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}
