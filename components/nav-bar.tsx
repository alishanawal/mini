"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/app/actions/auth"

export default function NavBar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-800">
            জ্ঞান জয়
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              হোম
            </Link>

            {!loading &&
              (user ? (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">
                    প্রোফাইল
                  </Link>
                  <span className="text-gray-500">স্বাগতম, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                    লগইন
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    নিবন্ধন
                  </Link>
                </>
              ))}
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              href="/"
              className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              হোম
            </Link>

            {!loading &&
              (user ? (
                <>
                  <Link
                    href="/profile"
                    className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded transition-colors"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    লগইন
                  </Link>
                  <Link
                    href="/signup"
                    className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    নিবন্ধন
                  </Link>
                </>
              ))}
          </div>
        )}
      </div>
    </nav>
  )
}
