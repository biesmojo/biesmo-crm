import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const noteSchema = z.object({
  content: z.string().min(1, "Catatan wajib diisi"),
  meetingAt: z.string().optional(),
  clientId: z.string().optional(),
  dealId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      include: {
        client: { select: { name: true } },
        deal: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(notes)

  } catch (error) {
    console.error("GET notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = noteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      )
    }

    const { meetingAt, ...rest } = validation.data

    const note = await prisma.note.create({
      data: {
        ...rest,
        userId: session.user.id,
        meetingAt: meetingAt ? new Date(meetingAt) : null,
        clientId: rest.clientId || null,
        dealId: rest.dealId || null,
      },
    })

    return NextResponse.json(note, { status: 201 })

  } catch (error) {
    console.error("POST notes error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}