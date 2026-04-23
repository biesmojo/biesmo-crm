"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations"

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError("")

    try {
      // kirim data registrasi ke API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // JSON.stringify -> mengubah data JavaScript menjadi format JSON string sebelum dikirim ke server
      })

      const result = await response.json()

      if (!response.ok) {
        // response.ok -> mengecek apakah respons dari server menunjukkan keberhasilan (status code 200-299)
        // jika tidak berhasil, tampilkan pesan error dari server
        setError(result.error || "Registration failed")
        return
      }

      // jika berhasil, arahkan pengguna ke halaman login
      router.push("/login?registered=true")
      // ?registered=true -> menambahkan query parameter registered dengan nilai true ke URL, yang bisa digunakan untuk menampilkan pesan sukses di halaman login

    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Biesmo CRM
          </h1>
          <p className="text-gray-500 mt-1">
            Create your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="kamu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
            {/* Password Requirements */}
            <p className="text-gray-400 text-xs mt-1">
              Password must be at least 8 characters, include uppercase, lowercase, and a number.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          </form>

          {/* Link to Login Page */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login now
            </a>
          </p>
          
      </div>
    </div>
  )
}