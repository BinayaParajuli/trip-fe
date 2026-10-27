import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const secret = process.env.NEXTAUTH_SECRET!;

const intlMiddleware = createIntlMiddleware(routing);

// Routes that need a signed-in user, without the locale prefix (e.g. "/account").
const protectedPrefixes: string[] = [];

// "/ne/account" → "/account", so one list covers every language.
function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  return (routing.locales as readonly string[]).includes(first) ? `/${rest.join("/")}` : pathname;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const path = stripLocale(pathname);

  if (protectedPrefixes.some((p) => path.startsWith(p))) {
    const token = await getToken({ req, secret });
    // Not logged in → redirect to login with callbackUrl
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Every page route; skips the API, Next internals and files with an extension (images, sw.js, manifest.json, ...).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
