import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }

  const item = await prisma.item.update({ where: { id }, data: { name } });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


