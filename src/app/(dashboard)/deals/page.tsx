import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DealsClient from "./DealsClient"

export default async function DealsPage() {
  const session = await auth()
  const userId = session!.user.id

  // Ambil deals dan clients sekaligus (paralel)
  const [deals, clients] = await Promise.all([
    prisma.deal.findMany({
      where: { userId },
      include: {
        client: { select: { name: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.findMany({
      where: { userId },
      select: { id: true, name: true, company: true },
      // Hanya ambil field yang dibutuhkan untuk dropdown form
    }),
  ])

  return <DealsClient deals={deals} clients={clients} />
}