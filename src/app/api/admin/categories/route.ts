import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { Category } from "@/models/Category";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { createSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, categories });
  } catch (err) {
    return apiErrorResponse(err, "Failed to load categories.");
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const slug = createSlug(parsed.data.name);
    const category = await Category.create({
      name: parsed.data.name.trim(),
      slug,
      description: parsed.data.description,
      image: parsed.data.image,
      isActive: parsed.data.isActive ?? true,
    });
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    return apiErrorResponse(err, "Failed to create category.");
  }
}

