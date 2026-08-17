import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/products";
import { revalidateProduct } from "@/lib/revalidate";
import { serializeImages } from "@/lib/images";

// POST /api/products - create a product (admin only).
export async function POST(request: Request) {
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

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the information and try again.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { images, ...rest } = parsed.data;
  const slug = await generateUniqueSlug(rest.name);

  try {
    const product = await prisma.product.create({
      data: {
        ...rest,
        slug,
        imageUrl: images[0]!, // cover
        images: serializeImages(images),
      },
    });
    revalidateProduct(product.slug);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save product. Please try again." },
      { status: 500 },
    );
  }
}
