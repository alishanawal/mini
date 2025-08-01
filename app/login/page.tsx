"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "../actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const result = await login(formData)

      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("একটি ত্রুটি হয়েছে, আবার চেষ্টা করুন")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-3xl text-indigo-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">জ্ঞান জয়</h1>
          <p className="text-indigo-600">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
              <i className="fas fa-envelope mr-2"></i>ইমেইল
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="আপনার ইমেইল"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
              <i className="fas fa-lock mr-2"></i>পাসওয়ার্ড
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="আপনার পাসওয়ার্ড"
              required
              placeholder="আপনার পাসওয়ার্ড"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                লগইন হচ্ছে...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2"></i>
                লগইন করুন
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
              নিবন্ধন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
