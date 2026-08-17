import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/products";
import { revalidateProduct } from "@/lib/revalidate";
import { serializeImages } from "@/lib/images";

// Partial schema so the admin can send full edits or single-field toggles
// (mark sold / available / featured) through the same endpoint.
const patchSchema = productSchema.partial();

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/products/[id] - update a product (admin only).
export async function PATCH(request: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the information and try again.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { images, ...data } = parsed.data;
  // Regenerate slug only when the name actually changes.
  const slug =
    data.name && data.name !== existing.name
      ? await generateUniqueSlug(data.name, id)
      : undefined;

  // When images are provided, refresh both the gallery and the cover image.
  const imageData =
    images && images.length > 0
      ? { imageUrl: images[0]!, images: serializeImages(images) }
      : {};

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { ...data, ...imageData, ...(slug ? { slug } : {}) },
    });
    revalidateProduct(existing.slug);
    if (product.slug !== existing.slug) revalidateProduct(product.slug);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Unable to save product. Please try again." },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - permanently remove a product (admin only).
export async function DELETE(_request: Request, { params }: Ctx) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    revalidateProduct(existing.slug);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete product. Please try again." },
      { status: 500 },
    );
  }
}
