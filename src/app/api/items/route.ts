import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const item = await prisma.item.create({ data: { name } });
  return NextResponse.json(item, { status: 201 });
}
