"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function ConfirmationPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Get the token from the URL
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (token && type === "email_confirmation") {
          // Verify the token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email_confirmation",
          })

          if (error) {
            throw error
          }

          setStatus("success")
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Error confirming email:", error)
        setStatus("error")
      }
    }

    handleConfirmation()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="text-2xl font-bold text-indigo-800">
          জ্ঞান জয়
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">ইমেইল যাচাইকরণ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p>অনুগ্রহ করে অপেক্ষা করুন...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-xl font-bold">ইমেইল যাচাইকরণ সফল হয়েছে!</h2>
                <p>আপনার অ্যাকাউন্ট সফলভাবে যাচাই করা হয়েছে। আপনি এখন লগইন করতে পারেন।</p>
                <p className="text-sm text-gray-500">আপনাকে স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে নিয়ে যাওয়া হবে...</p>
                <Button asChild>
                  <Link href="/dashboard">ড্যাশবোর্ডে যান</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center space-y-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <h2 className="text-xl font-bold">ইমেইল যাচাইকরণ ব্যর্থ হয়েছে</h2>
                <p>দুঃখিত, আপনার ইমেইল যাচাইকরণ লিংক অবৈধ বা মেয়াদ উত্তীর্ণ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
                <Button asChild>
                  <Link href="/login">লগইন পেজে ফিরে যান</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
        <p className="mt-2">© {new Date().getFullYear()} জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  )
}
