import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const errorChance = process.env.NAV_ERROR_RATE || 0.1;

export async function POST(request) {
  if (Math.random() <= errorChance)
    return new NextResponse(null, { status: 500 });

  try {
    const { id, from, to } = await request.json();
    if (!id || typeof from === "undefined" || typeof to === "undefined") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Here you would normally track the movement
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error tracking movement" },
      { status: 500 }
    );
  }
}
