import { NextResponse } from "next/server";
import { isServiceUnavailableError } from "@/lib/networkErrors";

export function apiErrorResponse(err: unknown, fallbackMessage: string) {
  if (isServiceUnavailableError(err)) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  console.error(err);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}

export function serviceUnavailableResponse() {
  return NextResponse.json({ ok: false }, { status: 503 });
}
