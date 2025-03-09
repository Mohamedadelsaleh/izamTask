import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { defaultNavData } from "@/lib/navData";

export const dynamic = 'force-dynamic'; // Needed for Vercel deployments
export const revalidate = 0;

const dataPath = path.join(process.cwd(), "nav.json");
const errorChance = process.env.NAV_ERROR_RATE || 0.1;

export async function GET() {
  if (Math.random() <= errorChance)
    return new NextResponse(null, { status: 500 });

  try {
    await fs.access(dataPath);
    const data = await fs.readFile(dataPath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(defaultNavData);
  }
}

export async function POST(request) {
  if (Math.random() <= errorChance)
    return new NextResponse(null, { status: 500 });

  try {
    const data = await request.json();
    await fs.writeFile(dataPath, JSON.stringify(data));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error saving navigation" },
      { status: 500 }
    );
  }
}
