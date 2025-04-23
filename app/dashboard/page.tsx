import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import UserStats from "@/components/dashboard/user-stats"
import RecentGames from "@/components/dashboard/recent-games"
import CategoryPerformance from "@/components/dashboard/category-performance"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">ড্যাশবোর্ড</h1>

        <div className="space-y-6">
          <UserStats />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentGames />
            <CategoryPerformance />
          </div>
        </div>
      </main>
    </div>
  )
}
