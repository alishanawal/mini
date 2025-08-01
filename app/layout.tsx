import "./globals.css"
import type { Metadata } from "next"
import { Hind_Siliguri } from "next/font/google"
import NavBar from "@/components/nav-bar"
import type React from "react"

// Initialize the Hind Siliguri font
const hindSiliguri = Hind_Siliguri({
  weight: ["400", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-hind-siliguri",
})

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
    <html lang="bn" className={hindSiliguri.variable}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={hindSiliguri.className}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
