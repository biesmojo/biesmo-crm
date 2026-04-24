import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validasi input tambah client
const clientSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["PROSPECT", "ACTIVE", "INACTIVE", "LOST"]).default("PROSPECT"),
})

// GET → ambil semua client milik user yang login
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      // orderBy desc → client terbaru muncul paling atas
    })

    return NextResponse.json(clients)

  } catch (error) {
    console.error("GET clients error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}

// POST → tambah client baru
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = clientSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        ...validation.data,
        userId: session.user.id,
        // Hubungkan client ke user yang sedang login
      },
    })

    return NextResponse.json(client, { status: 201 })

  } catch (error) {
    console.error("POST clients error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}