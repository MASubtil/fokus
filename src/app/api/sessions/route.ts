import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.focusSession.findMany({
    orderBy: { startedAt: "desc" },
  });
  return NextResponse.json(sessions);
}

type PostBody = { startedAt?: string; duration: number; note?: string };

export async function POST(req: Request) {
  const body = (await req.json()) as PostBody;
  if (
    !body ||
    typeof body.duration !== "number" ||
    !Number.isFinite(body.duration) ||
    body.duration <= 0
  ) {
    return NextResponse.json({ error: "duration inválido" }, { status: 400 });
  }

  const startedAt = body.startedAt
    ? new Date(body.startedAt)
    : undefined;
  if (startedAt && Number.isNaN(startedAt.getTime())) {
    return NextResponse.json({ error: "startedAt inválido" }, { status: 400 });
  }

  const session = await prisma.focusSession.create({
    data: {
      duration: Math.floor(body.duration),
      note: body.note ?? null,
      ...(startedAt ? { startedAt } : {}),
    },
  });
  return NextResponse.json(session, { status: 201 });
}


