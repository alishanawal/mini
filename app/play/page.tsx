import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import GameComponent from "@/components/game/game-component"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default async function PlayPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Get categories
  const { data: categories } = await supabase.from("categories").select("*")

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <GameComponent
          initialPlayerName={profile?.full_name || profile?.username || ""}
          categories={categories || []}
          userId={session.user.id}
        />
      </main>
    </div>
  )
}
