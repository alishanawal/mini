"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signup } from "../actions/auth"

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setErrors([])

    try {
      const result = await signup(formData)

      if (result.success) {
        router.push("/")
        router.refresh()
      } else {
        setError(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      setError("একটি ত্রুটি হয়েছে, আবার চেষ্টা করুন")
    } finally {
      setLoading(false)
    }
  }

  function getErrorForField(field: string) {
    return errors.find((error) => error.path === field)?.message
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
            <i className="fas fa-user-plus text-3xl text-indigo-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">জ্ঞান জয়</h1>
          <p className="text-indigo-600">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
              <i className="fas fa-user mr-2"></i>নাম
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="আপনার নাম"
              required
            />
            {getErrorForField("name") && (
              <p className="text-red-600 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {getErrorForField("name")}
              </p>
            )}
          </div>

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
            {getErrorForField("email") && (
              <p className="text-red-600 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {getErrorForField("email")}
              </p>
            )}
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
              placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              required
            />
            {getErrorForField("password") && (
              <p className="text-red-600 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {getErrorForField("password")}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
              <i className="fas fa-lock mr-2"></i>পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="পাসওয়ার্ড আবার লিখুন"
              required
            />
            {getErrorForField("confirmPassword") && (
              <p className="text-red-600 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {getErrorForField("confirmPassword")}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                নিবন্ধন হচ্ছে...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus mr-2"></i>
                নিবন্ধন করুন
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
