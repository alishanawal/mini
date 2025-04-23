import LoginForm from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col">
      <header className="container mx-auto px-4 py-8">
        <Link href="/" className="text-2xl font-bold text-indigo-800">
          জ্ঞান জয়
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
        <p className="mt-2">© {new Date().getFullYear()} জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
      </footer>
    </div>
  )
}
