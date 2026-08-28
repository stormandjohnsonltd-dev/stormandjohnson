import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { apiErrorResponse } from "@/lib/apiErrors";
import { Admin } from "@/models/Admin";
import { createToken, setAuthCookieOnResponse, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = await verifyPassword(parsed.data.password, admin.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await createToken({ id: admin._id.toString(), email: admin.email });

    const res = NextResponse.json({ ok: true });
    setAuthCookieOnResponse(res, token);
    return res;
  } catch (err) {
    return apiErrorResponse(err, "Login failed.");
  }
}

