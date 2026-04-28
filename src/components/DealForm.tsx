"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X } from "lucide-react"

const dealSchema = z.object({
  title: z.string().min(1, "Judul deal wajib diisi"),
  value: z.number().optional(),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]),
  clientId: z.string().min(1, "Client wajib dipilih"),
  closeDate: z.string().optional(),
})

type DealInput = z.infer<typeof dealSchema>

interface Client {
  id: string
  name: string
  company: string | null
}

interface DealFormProps {
  clients: Client[]
  onClose: () => void
}

// Label untuk tiap stage
const stageOptions = [
  { value: "LEAD", label: "Lead" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
]

export default function DealForm({ clients, onClose }: DealFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: { stage: "LEAD" },
  })

  const onSubmit = async (data: DealInput) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          value: data.value ? Number(data.value) : undefined,
          // Pastikan value terkirim sebagai number,
          // bukan string dari input HTML
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Gagal menambah deal")
        return
      }

      router.refresh()
      onClose()

    } catch (err) {
      setError("Terjadi kesalahan, coba lagi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4 max-h-[90vh] overflow-y-auto">
        {/* max-h-[90vh] → maksimal 90% tinggi layar
            overflow-y-auto → scroll kalau konten panjang */}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Tambah Deal Baru
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Judul Deal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Deal <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="Deal dengan PT. Contoh"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              {...register("clientId")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Pilih client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ""}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500 text-xs mt-1">{errors.clientId.message}</p>
            )}
          </div>

          {/* Nilai Deal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nilai Deal (Rp)
            </label>
            <input
              {...register("value", { valueAsNumber: true })}
              type="number"
              placeholder="15000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* valueAsNumber → otomatis convert input ke number */}
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              {...register("stage")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Close Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Close Date
            </label>
            <input
              {...register("closeDate")}
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}