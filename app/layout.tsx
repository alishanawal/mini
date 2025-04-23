import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "জ্ঞান জয় - শিক্ষামূলক গেম",
  description: "শিক্ষামূলক গেমে স্বাগতম! জ্ঞান অর্জন করো এবং নিজের দক্ষতা বৃদ্ধি করো",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
