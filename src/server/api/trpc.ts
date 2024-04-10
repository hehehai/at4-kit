import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const workerCtx = getRequestContext();
  const db = getDB(workerCtx.env.DB);
  const clerk = auth();

  const userId = clerk.userId;

  return {
    db,
    clerk,
    userId,
    workerCtx,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
