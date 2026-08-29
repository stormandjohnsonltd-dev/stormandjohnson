import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiErrorResponse } from "@/lib/apiErrors";
import { uploadProductImageServer } from "@/lib/uploadProductImage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const url = await uploadProductImageServer(file);
    return NextResponse.json({ ok: true, url, storage: "firebase" });
  } catch (err) {
    return apiErrorResponse(err, "Image upload failed.");
  }
}
