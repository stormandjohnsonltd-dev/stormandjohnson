import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Product } from "@/models/Product";
import { createSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().optional().nullable(),
  images: z.union([z.array(z.string()), z.string()]).optional(),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  specs: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .optional(),
  features: z.array(z.string()).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    return apiErrorResponse(err, "Failed to load products.");
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
    const images =
      typeof parsed.data.images === "string"
        ? parsed.data.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : parsed.data.images ?? [];

    const product = await Product.create({
      name: parsed.data.name.trim(),
      slug,
      description: parsed.data.description,
      shortDescription: parsed.data.shortDescription,
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice ?? undefined,
      images,
      brand: parsed.data.brandId,
      category: parsed.data.categoryId,
      specs: parsed.data.specs ?? [],
      features: parsed.data.features ?? [],
      stock: parsed.data.stock ?? 0,
      isFeatured: parsed.data.isFeatured ?? false,
      isActive: parsed.data.isActive ?? true,
    });

    try {
      const { warmCatalogCache } = await import("@/lib/queries");
      await warmCatalogCache();
    } catch {
      // Cache refresh is best-effort.
    }

    return NextResponse.json({ ok: true, product });
  } catch (err) {
    return apiErrorResponse(err, "Failed to create product.");
  }
}

