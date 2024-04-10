import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  const clerkPubKey = getRequestContext().env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = getRequestContext().env.CLERK_SECRET_KEY;
  return authMiddleware({
    publishableKey: clerkPubKey,
    secretKey: clerkSecretKey,
    signInUrl: "/sign-in",
    // debug: true,
  })(request, event);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
