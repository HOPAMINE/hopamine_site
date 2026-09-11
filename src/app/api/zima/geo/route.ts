import { NextResponse } from "next/server";
import { getCountryNameFromCode } from "@/lib/zima/location";

export async function GET(request: Request) {
  const countryCode = request.headers.get("x-vercel-ip-country");
  if (!countryCode || countryCode === "XX") {
    return NextResponse.json({ country: null });
  }

  const country = getCountryNameFromCode(countryCode);
  return NextResponse.json({ country });
}
