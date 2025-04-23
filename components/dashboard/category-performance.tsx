"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

type CategoryPerformance = {
  category_id: number
  category_name: string
  color: string
  total_games: number
  total_score: number
  correct_answers: number
  total_questions: number
  accuracy: number
}

export default function CategoryPerformance() {
  const { user } = useAuth()
  const [performance, setPerformance] = useState<CategoryPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryPerformance = async () => {
      if (!user) return

      try {
        // First get all categories
        const { data: categories, error: categoriesError } = await supabase
          .from("categories")
          .select("id, name_bn, color")

        if (categoriesError) throw categoriesError

        // Then get game sessions grouped by category
        const { data: sessions, error: sessionsError } = await supabase
          .from("game_sessions")
          .select(`
            category_id,
            score,
            correct_answers,
            total_questions
          `)
          .eq("user_id", user.id)

        if (sessionsError) throw sessionsError

        // Process the data
        const categoryMap = new Map<number, CategoryPerformance>()

        // Initialize with all categories
        categories.forEach((category) => {
          categoryMap.set(category.id, {
            category_id: category.id,
            category_name: category.name_bn,
            color: category.color,
            total_games: 0,
            total_score: 0,
            correct_answers: 0,
            total_questions: 0,
            accuracy: 0,
          })
        })

        // Update with session data
        sessions.forEach((session) => {
          const category = categoryMap.get(session.category_id)
          if (category) {
            category.total_games += 1
            category.total_score += session.score
            category.correct_answers += session.correct_answers
            category.total_questions += session.total_questions
            category.accuracy =
              category.total_questions > 0 ? (category.correct_answers / category.total_questions) * 100 : 0
          }
        })

        setPerformance(Array.from(categoryMap.values()))
      } catch (error) {
        console.error("Error fetching category performance:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryPerformance()
  }, [user])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>বিষয়ভিত্তিক পারফরম্যান্স</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
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
        <CardTitle>বিষয়ভিত্তিক পারফরম্যান্স</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performance.map((item) => (
            <div key={item.category_id}>
              <div className="flex justify-between mb-1">
                <span>{item.category_name}</span>
                <span>{Math.round(item.accuracy)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${item.color}-500 rounded-full`}
                  style={{ width: `${item.accuracy}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.total_games} গেম • {item.correct_answers}/{item.total_questions} সঠিক উত্তর
              </div>
            </div>
          ))}

          {performance.every((item) => item.total_games === 0) && (
            <p className="text-muted-foreground">কোন গেম খেলা হয়নি</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
