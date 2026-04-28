"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import DealForm from "@/components/DealForm"

interface Deal {
  id: string
  title: string
  value: number | null
  stage: string
  closeDate: Date | null
  client: { name: string; company: string | null }
}

interface Client {
  id: string
  name: string
  company: string | null
}

interface DealsClientProps {
  deals: Deal[]
  clients: Client[]
}

// Konfigurasi warna dan label per stage
const stageConfig: Record<string, { label: string; className: string }> = {
  LEAD: { label: "Lead", className: "bg-gray-100 text-gray-600" },
  QUALIFIED: { label: "Qualified", className: "bg-blue-100 text-blue-600" },
  PROPOSAL: { label: "Proposal", className: "bg-yellow-100 text-yellow-700" },
  NEGOTIATION: { label: "Negotiation", className: "bg-orange-100 text-orange-600" },
  WON: { label: "Won", className: "bg-green-100 text-green-700" },
  LOST: { label: "Lost", className: "bg-red-100 text-red-600" },
}

// Format angka ke Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function DealsClient({ deals, clients }: DealsClientProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">
            {deals.length} deal terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <TrendingUp size={18} />
          Tambah Deal
        </button>
      </div>

      {/* List Deals */}
      {deals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <TrendingUp size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada deal</p>
          <p className="text-gray-400 text-sm mt-1">
            Klik "Tambah Deal" untuk mulai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal) => {
            const stage = stageConfig[deal.stage]
            return (
              <div
                key={deal.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                {/* Judul & Stage */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-1 mr-2">
                    {deal.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${stage.className}`}>
                    {stage.label}
                  </span>
                </div>

                {/* Client */}
                <p className="text-sm text-gray-500 mb-3">
                  {deal.client.name}
                  {deal.client.company && (
                    <span className="text-gray-400"> · {deal.client.company}</span>
                  )}
                </p>

                {/* Nilai & Close Date */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {deal.value ? formatRupiah(deal.value) : "—"}
                  </span>
                  {deal.closeDate && (
                    <span className="text-xs text-gray-400">
                      {new Date(deal.closeDate).toLocaleDateString("id-ID")}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DealForm
          clients={clients}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}