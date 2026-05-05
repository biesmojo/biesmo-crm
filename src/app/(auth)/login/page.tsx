"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginInput, loginSchema } from "@/lib/validations"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

// ✅ Pindahkan semua logic ke komponen terpisah
function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const registered = searchParams.get("registered")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
                return
            }

            router.push("/")
            router.refresh()
        } catch (err) {
            setError("An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Biesmo CRM</h1>
                    <p className="text-gray-500 mt-1">Please sign in to your account</p>
                </div>

                {registered && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-600 text-sm">Registration successful! Please log in.</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="kamu@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors"
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Belum punya akun?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">Daftar sekarang</a>
                </p>
            </div>
        </div>
    )
}

// ✅ Page export hanya bertugas membungkus dengan Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}