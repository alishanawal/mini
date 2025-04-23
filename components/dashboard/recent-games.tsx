"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

type GameSession = {
  id: string
  category_id: number
  score: number
  correct_answers: number
  total_questions: number
  created_at: string
  category: {
    name_bn: string
    color: string
  }
}

export default function RecentGames() {
  const { user } = useAuth()
  const [games, setGames] = useState<GameSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecentGames = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("game_sessions")
          .select(`
            id,
            category_id,
            score,
            correct_answers,
            total_questions,
            created_at,
            categories (
              name_bn,
              color
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error

        if (data) {
          setGames(
            data.map((game) => ({
              ...game,
              category: game.categories,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching recent games:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentGames()
  }, [user])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>সাম্প্রতিক গেম</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>সাম্প্রতিক গেম</CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <p className="text-muted-foreground">কোন গেম খেলা হয়নি</p>
        ) : (
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${game.category.color}-500`}></div>
                  <span>{game.category.name_bn}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(game.created_at), "dd/MM/yyyy")}
                  </span>
                  <span className="font-medium">{game.score} পয়েন্ট</span>
                  <span className="text-sm">
                    {game.correct_answers}/{game.total_questions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
