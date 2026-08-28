import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Category } from "@/models/Category";
import { createSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const category = await Category.findOne({ slug });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });

    category.name = parsed.data.name.trim();
    category.slug = createSlug(parsed.data.name);
    category.description = parsed.data.description;
    category.image = parsed.data.image;
    category.isActive = parsed.data.isActive ?? true;
    await category.save();

    return NextResponse.json({ ok: true, category });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update category.");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { slug } = await params;
    await connectDB();
    const category = await Category.findOne({ slug });
    if (!category) return NextResponse.json({ error: "Category not found." }, { status: 404 });
    await category.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to delete category.");
  }
}

