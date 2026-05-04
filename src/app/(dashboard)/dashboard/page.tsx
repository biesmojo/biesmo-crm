import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  Users,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [clientCount, dealCount, noteCount, wonDeals] =
    await Promise.all([
      prisma.client.count({ where: { userId } }),
      prisma.deal.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
      prisma.deal.findMany({
        where: { userId, stage: "WON" },
        select: { value: true },
      }),
    ])

  const totalRevenue = wonDeals.reduce(
    (sum, deal) => sum + (deal.value ?? 0),
    0
  )

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      label: "Total Clients",
      value: clientCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Deals",
      value: dealCount,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Meeting Notes",
      value: noteCount,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Revenue (Won)",
      value: formatRupiah(totalRevenue),
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Selamat datang, {session!.user.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-4`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}