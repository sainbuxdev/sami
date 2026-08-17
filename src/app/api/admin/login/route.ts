import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Throttle login attempts per IP to slow brute-force attacks.
  const ip = clientIp(request.headers);
  const limited = rateLimit(`login:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });

  // Constant-ish response regardless of which field failed (avoid user enumeration).
  const valid = admin ? await verifyPassword(password, admin.passwordHash) : false;
  if (!admin || !valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await createSession({ id: admin.id, email: admin.email });
  return NextResponse.json({ ok: true });
}
