"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
      return
    }

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন।")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="text-2xl font-bold text-indigo-800">
          জ্ঞান জয়
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">নতুন পাসওয়ার্ড সেট করুন</h1>
            <p className="text-gray-500">অনুগ্রহ করে আপনার নতুন পাসওয়ার্ড দিন</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="নতুন পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="পাসওয়ার্ড আবার লিখুন"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "পাসওয়ার্ড আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </Button>
          </form>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
        <p className="mt-2">© {new Date().getFullYear()} জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  )
}
