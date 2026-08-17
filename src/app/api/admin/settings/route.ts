import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { settingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// PUT /api/admin/settings - update store settings (admin only).
export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the information and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { storeName, whatsappNumber, storeDescription } = parsed.data;

  try {
    await prisma.settings.upsert({
      where: { id: "store" },
      update: { storeName, whatsappNumber, storeDescription },
      create: { id: "store", storeName, whatsappNumber, storeDescription },
    });
    // Settings affect the whole site (nav, footer, WhatsApp links).
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to save settings. Please try again." },
      { status: 500 },
    );
  }
}
