import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { Brand } from "@/models/Brand";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { createSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const brands = await Brand.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, brands });
  } catch (err) {
    return apiErrorResponse(err, "Failed to load brands.");
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
    const brand = await Brand.create({
      name: parsed.data.name.trim(),
      slug,
      description: parsed.data.description,
      logo: parsed.data.logo,
      isActive: parsed.data.isActive ?? true,
    });

    return NextResponse.json({ ok: true, brand });
  } catch (err) {
    return apiErrorResponse(err, "Failed to create brand.");
  }
}

