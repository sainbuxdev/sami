import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Demo inventory. Every item is flagged isDemo:true so Sami can bulk-remove it.
interface DemoProduct {
  name: string;
  image: string;
  images?: string[];
  batteryHealth: number;
  condition: number;
  price: number;
  withBox: boolean;
  featured: boolean;
  isAvailable: boolean;
  details: string;
}

const demoProducts: DemoProduct[] = [
  {
    name: "iPhone 11",
    image: "/demo/iphone-11.svg",
    batteryHealth: 84,
    condition: 8,
    price: 62000,
    withBox: false,
    featured: false,
    isAvailable: true,
    details:
      "Face ID working perfectly.\nTrue Tone available.\nAll cameras working.\nMinor micro-scratches on frame.\nFactory unlocked.",
  },
  {
    name: "iPhone 12",
    image: "/demo/iphone-12.svg",
    batteryHealth: 88,
    condition: 9,
    price: 78000,
    withBox: true,
    featured: true,
    isAvailable: true,
    details:
      "Face ID working perfectly.\nTrue Tone available.\nAll cameras working.\nNo repair history.\nFactory unlocked.",
  },
  {
    name: "iPhone 13",
    image: "/demo/iphone-13.svg",
    images: ["/demo/iphone-13.svg", "/demo/iphone-12.svg", "/demo/iphone-14.svg"],
    batteryHealth: 89,
    condition: 9,
    price: 98000,
    withBox: true,
    featured: true,
    isAvailable: true,
    details:
      "Face ID working perfectly.\nTrue Tone available.\nAll cameras working.\nNo repair history.\nFactory unlocked.",
  },
  {
    name: "iPhone 13 Pro",
    image: "/demo/iphone-13-pro.svg",
    batteryHealth: 91,
    condition: 9,
    price: 132000,
    withBox: true,
    featured: true,
    isAvailable: true,
    details:
      "Face ID working perfectly.\nProMotion 120Hz display.\nTrue Tone available.\nAll cameras working.\nNo repair history.\nFactory unlocked.",
  },
  {
    name: "iPhone 14",
    image: "/demo/iphone-14.svg",
    images: ["/demo/iphone-14.svg", "/demo/iphone-15.svg"],
    batteryHealth: 94,
    condition: 10,
    price: 158000,
    withBox: true,
    featured: true,
    isAvailable: true,
    details:
      "Face ID working perfectly.\nTrue Tone available.\nAll cameras working.\nAbsolutely mint condition.\nFactory unlocked.",
  },
  {
    name: "iPhone 15",
    image: "/demo/iphone-15.svg",
    batteryHealth: 97,
    condition: 10,
    price: 205000,
    withBox: true,
    featured: false,
    isAvailable: false, // demonstrates a SOLD item
    details:
      "Face ID working perfectly.\nUSB-C.\nTrue Tone available.\nAll cameras working.\nFactory unlocked.",
  },
];

async function main() {
  // ── Admin ───────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? "sami@samisiphone.com";
  const password = process.env.ADMIN_PASSWORD ?? "Sami@iPhone2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Sami" },
  });
  console.log(`✓ Admin ready: ${email}`);

  // ── Settings ────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "store" },
    update: {},
    create: {
      id: "store",
      storeName: "Sami's iPhone",
      whatsappNumber: process.env.WHATSAPP_NUMBER ?? "923001234567",
      storeDescription: "Premium iPhones. Simple. Transparent. Trusted.",
    },
  });
  console.log("✓ Store settings ready");

  // ── Demo products (reset demo set only) ─────────────────
  await prisma.product.deleteMany({ where: { isDemo: true } });
  for (const p of demoProducts) {
    const slug = `${slugify(p.name)}-${Math.random().toString(36).slice(2, 7)}`;
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        imageUrl: p.image,
        images: JSON.stringify(p.images ?? [p.image]),
        batteryHealth: p.batteryHealth,
        condition: p.condition,
        price: p.price,
        withBox: p.withBox,
        details: p.details,
        isAvailable: p.isAvailable,
        featured: p.featured,
        isDemo: true,
      },
    });
  }
  console.log(`✓ Seeded ${demoProducts.length} demo iPhones (isDemo=true)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
