import { NextResponse } from "next/server";
import { defaultNavData } from "@/lib/navData";
import { loadNav, saveNav } from "@/lib/supabase";

export const dynamic = "force-dynamic";
const errorChance = process.env.NAV_ERROR_RATE || 0.1;

export async function GET() {
  if (Math.random() <= errorChance)
    return new NextResponse(null, { status: 500 });

  try {
    const data = await loadNav();
    return NextResponse.json(data || defaultNavData);
  } catch (error) {
    return NextResponse.json(defaultNavData);
  }
}

export async function POST(request) {
  if (Math.random() <= errorChance)
    return new NextResponse(null, { status: 500 });

  try {
    const data = await request.json();
    await saveNav(data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error saving navigation" },
      { status: 500 }
    );
  }
}
