"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
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
            <h1 className="text-3xl font-bold">পাসওয়ার্ড রিসেট</h1>
            <p className="text-gray-500">আপনার ইমেইল এ পাসওয়ার্ড রিসেট লিংক পাঠানো হবে</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  পাসওয়ার্ড রিসেট লিংক {email} এ পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link href="/login" className="text-indigo-600 hover:underline">
                  লগইন পেজে ফিরে যান
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="আপনার ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "লিংক পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-indigo-600 hover:underline">
                  লগইন পেজে ফিরে যান
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
        <p className="mt-2">© {new Date().getFullYear()} জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  )
}
