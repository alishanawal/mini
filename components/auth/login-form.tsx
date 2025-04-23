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

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { signIn, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await signIn(email, password)
    } catch (err: any) {
      if (err.message?.includes("Email not confirmed")) {
        setError("আপনার ইমেইল এখনও যাচাই করা হয়নি। অনুগ্রহ করে আপনার ইমেইল চেক করুন এবং যাচাইকরণ লিংকে ক্লিক করুন।")
      } else {
        setError(err.message || "লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">লগইন করুন</h1>
        <p className="text-gray-500">আপনার অ্যাকাউন্টে লগইন করুন</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="আপনার পাসওয়ার্ড"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  )
}
