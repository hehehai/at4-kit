import { getRequestContext } from "@cloudflare/next-on-pages";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";

export function getDB(DB?: D1Database) {
  if (!DB) {
    DB = getRequestContext().env.DB;
  }
  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });
  return prisma;
}
