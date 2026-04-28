import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { DealStage } from "@prisma/client"

const dealSchema = z.object({
  title: z.string().min(1, "Judul deal wajib diisi"),
  value: z.number().optional(),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]).default("LEAD"),
  clientId: z.string().min(1, "Client wajib dipilih"),
  closeDate: z.string().optional(),
  // closeDate pakai string karena dari form HTML
  // nanti kita convert ke Date sebelum disimpan
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
        client: {
          select: { name: true, company: true },
        },
      },
      // include → ambil juga data client yang terkait
      // supaya di halaman deals bisa tampilkan nama client
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

    const stageMap: Record<string, number> = {}

    const deal = await prisma.deal.create({
      data: {
        title: validation.data.title,
        value: validation.data.value ?? null,
        stage: validation.data.stage as any,
        clientId: validation.data.clientId,
        userId: session.user.id,
        closeDate: validation.data.closeDate
          ? new Date(validation.data.closeDate)
          : null,
  },
})

    return NextResponse.json(deal, { status: 201 })

  } catch (error) {
    console.error("POST deals error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}