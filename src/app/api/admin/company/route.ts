import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Company } from "@/models/Company";

const schema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(2),
  about: z.string().min(10),
  mission: z.string().optional(),
  vision: z.string().optional(),
  officeLine: z.string().min(5),
  whatsappNumbers: z.union([z.array(z.string()), z.string()]).optional(),
  email: z.string().email(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const company = await Company.findOne().lean();
    return NextResponse.json({ ok: true, company });
  } catch (err) {
    return apiErrorResponse(err, "Failed to load company details.");
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();

    const whatsappNumbers =
      typeof parsed.data.whatsappNumbers === "string"
        ? parsed.data.whatsappNumbers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : parsed.data.whatsappNumbers ?? [];

    const update = {
      name: parsed.data.name,
      tagline: parsed.data.tagline,
      about: parsed.data.about,
      mission: parsed.data.mission,
      vision: parsed.data.vision,
      officeLine: parsed.data.officeLine,
      whatsappNumbers,
      email: parsed.data.email,
      address: parsed.data.address,
      socialLinks: {
        facebook: parsed.data.facebook,
        instagram: parsed.data.instagram,
        twitter: parsed.data.twitter,
        linkedin: parsed.data.linkedin,
      },
    };

    const existing = await Company.findOne();
    if (existing) {
      Object.assign(existing, update);
      await existing.save();
      return NextResponse.json({ ok: true, company: existing });
    }

    const company = await Company.create(update);
    return NextResponse.json({ ok: true, company });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update company details.");
  }
}

