"use client"

import { useState } from "react"
import { UserPlus, Building2, Mail, Phone } from "lucide-react"
import ClientForm from "@/components/ClientForm"

// Tipe data client dari Prisma
interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  status: string
  createdAt: Date
}

interface ClientsClientProps {
  clients: Client[]
}

// Warna badge berdasarkan status
const statusConfig: Record<string, { label: string; className: string }> = {
  PROSPECT: { label: "Prospect", className: "bg-yellow-100 text-yellow-700" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-700" },
  INACTIVE: { label: "Inactive", className: "bg-gray-100 text-gray-600" },
  LOST: { label: "Lost", className: "bg-red-100 text-red-600" },
}

export default function ClientsClient({ clients }: ClientsClientProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            {clients.length} client terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <UserPlus size={18} />
          Tambah Client
        </button>
      </div>

      {/* List Clients */}
      {clients.length === 0 ? (
        // Empty state — tampil kalau belum ada client
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <UserPlus size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Belum ada client</p>
          <p className="text-gray-400 text-sm mt-1">
            Klik "Tambah Client" untuk mulai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const status = statusConfig[client.status]
            return (
              <div
                key={client.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                {/* Nama & Status */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {client.name}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {/* Detail info */}
                <div className="space-y-1">
                  {client.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 size={14} />
                      {client.company}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={14} />
                      {client.phone}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ClientForm onClose={() => setShowForm(false)} />
      )}
      {/* showForm && → form hanya di-render ke DOM
          kalau showForm true. Kalau false, tidak ada
          di DOM sama sekali — lebih efisien */}
    </div>
  )
}