import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }
  const item = await prisma.item.create({ data: { name } });
  return NextResponse.json(item, { status: 201 });
}
