import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Product } from "@/models/Product";
import { Enquiry } from "@/models/Enquiry";
import { productEnquiryEmail, sendEmail } from "@/lib/email";

const schema = z.object({
  productSlug: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  quantity: z.number().int().min(1),
  deliveryAddress: z.string().min(5),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();

    // Find product document for future reference (optional)
    const product = await Product.findOne({ slug: parsed.data.productSlug, isActive: true }).select(
      "_id name"
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const enquiry = await Enquiry.create({
      product: product._id,
      productName: product.name,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      quantity: parsed.data.quantity,
      deliveryAddress: parsed.data.deliveryAddress,
      message: parsed.data.message,
      status: "new",
    });

    const email = productEnquiryEmail({
      productName: product.name,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      quantity: parsed.data.quantity,
      deliveryAddress: parsed.data.deliveryAddress,
      message: parsed.data.message,
    });

    await sendEmail({ ...email });

    return NextResponse.json({ ok: true, enquiryId: enquiry._id.toString() });
  } catch (err) {
    return apiErrorResponse(err, "Failed to submit enquiry.");
  }
}

