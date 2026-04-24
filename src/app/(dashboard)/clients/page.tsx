import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ClientsClient from "./ClientsClient"

export default async function ClientsPage() {
  const session = await auth()

  const clients = await prisma.client.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  })

  return <ClientsClient clients={clients} />
  // Kita pisah menjadi 2 file:
  // page.tsx (Server Component) → fetch data dari database
  // ClientsClient.tsx (Client Component) → handle interaksi UI
  // Ini pola "Server/Client Component split" yang direkomendasikan Next.js
}