import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

// Protect every /admin route except the login page. Unauthenticated requests
// are redirected to the login screen; this runs at the edge before rendering.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/admin/login";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session && !isLogin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already signed in but visiting the login page → send to dashboard.
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
