import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function ClientDetailPage({ params }: Props) {
  const session = await auth()

  const client = await prisma.client.findFirst({
    where: {
      id: params.id,
      userId: session!.user.id,
    },
    include: {
      deals: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!client) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {client.name}
      </h1>
      {client.company && (
        <p className="text-gray-500">{client.company}</p>
      )}
    </div>
  )
}