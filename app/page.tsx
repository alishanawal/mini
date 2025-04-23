import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-800">
          জ্ঞান জয়
        </Link>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">লগইন</Button>
          </Link>
          <Link href="/signup">
            <Button>রেজিস্টার</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">জ্ঞান জয় - শিক্ষামূলক গেম</h1>
          <p className="text-xl text-indigo-600 mb-8">শিক্ষামূলক গেমে স্বাগতম! জ্ঞান অর্জন করো এবং নিজের দক্ষতা বৃদ্ধি করো</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                শুরু করুন
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                লগইন করুন
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
        <p className="mt-2">© {new Date().getFullYear()} জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  )
}
