"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import bcrypt from "bcryptjs"
import crypto from "crypto"

// Mock database - প্রোডাকশনে এটি আসল ডাটাবেস হবে
const users: any[] = []
const scores: any[] = []

// Validation schemas
const signupSchema = z
  .object({
    name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষর হতে হবে" }),
    email: z.string().email({ message: "সঠিক ইমেইল দিন" }),
    password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  })

const loginSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল দিন" }),
  password: z.string().min(1, { message: "পাসওয়ার্ড দিন" }),
})

// Session management
const sessions: Record<string, { userId: string; expires: Date }> = {}

function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  try {
    const validatedData = signupSchema.parse({
      name,
      email,
      password,
      confirmPassword,
    })

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return { success: false, message: "এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    users.push(newUser)

    // Create session
    const token = generateToken()
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    sessions[token] = {
      userId: newUser.id,
      expires,
    }

    // Set session cookie
    cookies().set("session", token, {
      httpOnly: true,
      expires,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true, message: "সফলভাবে নিবন্ধন করা হয়েছে" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "ফর্ম পূরণে ত্রুটি আছে",
        errors: error.errors.map((e) => ({ path: e.path[0], message: e.message })),
      }
    }
    return { success: false, message: "একটি ত্রুটি হয়েছে, আবার চেষ্টা করুন" }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    loginSchema.parse({ email, password })

    const user = users.find((user) => user.email === email)
    if (!user) {
      return { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল" }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "ইমেইল বা পাসওয়ার্ড ভুল" }
    }

    // Create session
    const token = generateToken()
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    sessions[token] = {
      userId: user.id,
      expires,
    }

    cookies().set("session", token, {
      httpOnly: true,
      expires,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    })

    return { success: true, message: "সফলভাবে লগইন করা হয়েছে" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "ফর্ম পূরণে ত্রুটি আছে",
        errors: error.errors.map((e) => ({ path: e.path[0], message: e.message })),
      }
    }
    return { success: false, message: "একটি ত্রুটি হয়েছে, আবার চেষ্টা করুন" }
  }
}

export async function logout() {
  const sessionToken = cookies().get("session")?.value

  if (sessionToken && sessions[sessionToken]) {
    delete sessions[sessionToken]
  }

  cookies().delete("session")
  redirect("/")
}

export async function getCurrentUser() {
  const sessionToken = cookies().get("session")?.value

  if (!sessionToken || !sessions[sessionToken]) {
    return null
  }

  if (sessions[sessionToken].expires < new Date()) {
    delete sessions[sessionToken]
    cookies().delete("session")
    return null
  }

  const userId = sessions[sessionToken].userId
  const user = users.find((user) => user.id === userId)

  if (!user) {
    return null
  }

  // Get user scores
  const userScores = scores.filter((score) => score.userId === userId)

  const { password, ...userWithoutPassword } = user
  return { ...userWithoutPassword, scores: userScores }
}

export async function saveScore(category: string, score: number, correctAnswers: number, totalQuestions: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "লগইন করা নেই" }
  }

  const newScore = {
    id: crypto.randomUUID(),
    userId: user.id,
    category,
    score,
    correctAnswers,
    totalQuestions,
    createdAt: new Date(),
  }

  scores.push(newScore)
  return { success: true, message: "স্কোর সংরক্ষণ করা হয়েছে" }
}
