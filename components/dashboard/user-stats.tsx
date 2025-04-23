"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

type UserStats = {
  totalGames: number
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  averageScore: number
}

export default function UserStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalGames: 0,
    totalScore: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    averageScore: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("game_sessions")
          .select("score, correct_answers, total_questions")
          .eq("user_id", user.id)

        if (error) throw error

        if (data && data.length > 0) {
          const totalGames = data.length
          const totalScore = data.reduce((sum, session) => sum + session.score, 0)
          const correctAnswers = data.reduce((sum, session) => sum + session.correct_answers, 0)
          const totalQuestions = data.reduce((sum, session) => sum + session.total_questions, 0)
          const averageScore = totalGames > 0 ? totalScore / totalGames : 0

          setStats({
            totalGames,
            totalScore,
            correctAnswers,
            totalQuestions,
            averageScore,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">মোট গেম</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGames}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">মোট স্কোর</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalScore}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">সঠিক উত্তর</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.correctAnswers}/{stats.totalQuestions} (
            {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
