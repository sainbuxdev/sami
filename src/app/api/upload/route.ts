import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveImage, validateImage } from "@/lib/storage";

// POST /api/upload - accepts multipart form-data with a "file" field (admin only).
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }

  const validationError = validateImage(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const { url } = await saveImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: "Unable to upload image. Please try again." },
      { status: 500 },
    );
  }
}
