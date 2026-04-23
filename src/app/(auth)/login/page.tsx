"use client"
// "use client" -> komponen ini jalan di client side, bukan server side
// diperlukan untuk menggunakan state, effect, dll yang hanya bisa digunakan di client side

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInput, loginSchema } from "@/lib/validations"
import Email from "next-auth/providers/email"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")
    // useSearchParams -> untuk membaca query parameter dari URL, dalam hal ini untuk mengecek apakah pengguna baru saja berhasil registrasi
    // registered -> akan bernilai "true" jika pengguna baru saja berhasil registrasi, sehingga kita bisa menampilkan pesan sukses di halaman login

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        // zodResolver -> menghubungkan zod schema dengan react-hook-form untuk validasi form, sehingga error validasi bisa ditangani oleh react-hook-form
        // form akan divalidasi menggunakan loginSchema yang sudah dibuat dengan zod, jika ada error validasi maka error tersebut akan disimpan di formState.errors dan bisa ditampilkan di UI
    })

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
                // redirect: false -> agar tidak langsung redirect setelah login, sehingga kita bisa menangani hasil login terlebih dahulu
                // supaya bisa tampilkan error jika login gagal
            })

            if (result?.error) {
                setError("Invalid email or password")
                return
            }

            // jika login berhasil, redirect ke dashboard
            router.push("/")
            router.refresh()

            // router.refresh() -> untuk me-refresh halaman setelah redirect, sehingga data user yang baru login bisa langsung muncul di UI
        
        } catch (err) {
            setError("An error occurred during login")
        } finally {
            setIsLoading(false)
            // finally -> agar selalu dijalankan setelah try/catch, sehingga isLoading akan selalu di-set ke false setelah proses login selesai, baik berhasil maupun gagal
            // supaya loading stater selalu di reset setelah proses login selesai
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Biesmo CRM
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Please sign in to your account
                    </p>
                </div>

                {/* Show success message if user just registered */}
                {registered && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">
                            Registration successful! Please log in.
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

        </form>

        {/* Link ke register */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </a>
        </p>

      </div>
    </div>
  )
}    