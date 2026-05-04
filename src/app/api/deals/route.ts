import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const dealSchema = z.object({
  title: z.string().min(1, "Judul deal wajib diisi"),
  value: z.number().optional(),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]).default("LEAD"),
  clientId: z.string().min(1, "Client wajib dipilih"),
  closeDate: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deals = await prisma.deal.findMany({
      where: { userId: session.user.id },
      include: {
        client: { select: { name: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(deals)

  } catch (error) {
    console.error("GET deals error:", error)
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
    const validation = dealSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { closeDate, ...rest } = validation.data

    const deal = await prisma.deal.create({
      data: {
        ...rest,
        userId: session.user.id,
        closeDate: closeDate ? new Date(closeDate) : null,
      },
    })

    return NextResponse.json(deal, { status: 201 })

  } catch (error) {
    console.error("POST deals error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}