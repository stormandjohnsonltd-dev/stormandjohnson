import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Distributor } from "@/models/Distributor";
import { distributorEmail, sendEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  businessName: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(6),
  state: z.string().min(2),
  city: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();

    const distributor = await Distributor.create({
      name: parsed.data.name,
      businessName: parsed.data.businessName,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      state: parsed.data.state,
      city: parsed.data.city,
      status: "new",
    });

    const email = distributorEmail(parsed.data);
    await sendEmail({ ...email });

    return NextResponse.json({ ok: true, distributorId: distributor._id.toString() });
  } catch (err) {
    return apiErrorResponse(err, "Failed to submit application.");
  }
}

