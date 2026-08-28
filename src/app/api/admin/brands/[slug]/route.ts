import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Brand } from "@/models/Brand";
import { createSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  logo: z.string().optional(),
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
    const brand = await Brand.findOne({ slug });
    if (!brand) return NextResponse.json({ error: "Brand not found." }, { status: 404 });

    const newSlug = createSlug(parsed.data.name);
    brand.name = parsed.data.name.trim();
    brand.slug = newSlug;
    brand.description = parsed.data.description;
    brand.logo = parsed.data.logo;
    brand.isActive = parsed.data.isActive ?? true;

    await brand.save();
    return NextResponse.json({ ok: true, brand });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update brand.");
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
    const brand = await Brand.findOne({ slug });
    if (!brand) return NextResponse.json({ error: "Brand not found." }, { status: 404 });

    await brand.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to delete brand.");
  }
}

