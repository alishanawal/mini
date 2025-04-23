import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import ProfileForm from "@/components/profile/profile-form"
import DashboardHeader from "@/components/dashboard/dashboard-header"

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6">প্রোফাইল</h1>

        <div className="max-w-md mx-auto">
          <ProfileForm profile={profile} />
        </div>
      </main>
    </div>
  )
}
