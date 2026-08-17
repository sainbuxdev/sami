import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from "@/lib/auth/session";

// Cookie-bound auth helpers for Node contexts (route handlers, server actions,
// server components). Keep these out of middleware (which imports session.ts).

export async function createSession(admin: {
  id: string;
  email: string;
}): Promise<void> {
  const token = await signSession({ sub: admin.id, email: admin.email });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/** The authenticated admin record, or null. */
export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session) return null;
  return prisma.admin.findUnique({
    where: { id: session.sub },
    select: { id: true, email: true, name: true },
  });
}

/**
 * Server-side guard for admin pages/actions. Redirects to login when there is
 * no valid session. Returns the admin so callers can use it.
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
