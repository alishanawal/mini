"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const { signUp, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।")
      return
    }

    try {
      const result = await signUp(email, password, username, fullName)
      if (result?.emailConfirmationSent) {
        setConfirmationSent(true)
      }
    } catch (err: any) {
      setError(err.message || "রেজিস্টার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    }
  }

  if (confirmationSent) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">ইমেইল যাচাই করুন</h1>
          <p className="text-gray-500">আপনার ইমেইল ({email}) এ একটি যাচাইকরণ লিংক পাঠানো হয়েছে।</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং অ্যাকাউন্ট যাচাই করতে লিংকে ক্লিক করুন।</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            ইমেইল পাননি?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              লগইন পেজে ফিরে যান
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">রেজিস্টার করুন</h1>
        <p className="text-gray-500">নতুন অ্যাকাউন্ট তৈরি করুন</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">পূর্ণ নাম</Label>
          <Input
            id="fullName"
            placeholder="আপনার পূর্ণ নাম"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">ইউজারনেম</Label>
          <Input
            id="username"
            placeholder="আপনার ইউজারনেম"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <Input
            id="password"
            type="password"
            placeholder="আপনার পাসওয়ার্ড"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে</p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  )
}
