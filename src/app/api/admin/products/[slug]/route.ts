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

    const product = await Product.findOne({ slug });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const images =
      typeof parsed.data.images === "string"
        ? parsed.data.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : parsed.data.images ?? [];

    const newSlug = createSlug(parsed.data.name);

    product.name = parsed.data.name.trim();
    product.slug = newSlug;
    product.description = parsed.data.description;
    product.shortDescription = parsed.data.shortDescription;
    product.price = parsed.data.price;
    product.compareAtPrice = parsed.data.compareAtPrice ?? undefined;
    product.images = images;
    product.set({
      brand: parsed.data.brandId,
      category: parsed.data.categoryId,
    });
    product.specs = parsed.data.specs ?? [];
    product.features = parsed.data.features ?? [];
    product.stock = parsed.data.stock ?? 0;
    product.isFeatured = parsed.data.isFeatured ?? false;
    product.isActive = parsed.data.isActive ?? true;

    await product.save();

    try {
      const { warmCatalogCache } = await import("@/lib/queries");
      await warmCatalogCache();
    } catch {
      // Cache refresh is best-effort.
    }

    return NextResponse.json({ ok: true, product, newSlug });
  } catch (err) {
    return apiErrorResponse(err, "Failed to update product.");
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
    const product = await Product.findOne({ slug });
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    await product.deleteOne();
    try {
      const { removeCachedProduct } = await import("@/lib/catalogCache");
      removeCachedProduct(slug);
      const { warmCatalogCache } = await import("@/lib/queries");
      await warmCatalogCache();
    } catch {
      // Cache refresh is best-effort.
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err, "Failed to delete product.");
  }
}

