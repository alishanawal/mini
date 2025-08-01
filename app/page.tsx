import { getCurrentUser } from "./actions/auth"
import GameComponent from "@/components/game-component"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-2">জ্ঞান জয়</h1>
          <p className="text-lg text-indigo-600">শিক্ষামূলক গেমে স্বাগতম! জ্ঞান অর্জন করো এবং নিজের দক্ষতা বৃদ্ধি করো</p>
          {user && <p className="mt-4 text-gray-600">স্বাগতম, {user.name}!</p>}
        </header>

        {/* Game Container */}
        <div className="max-w-4xl mx-auto">
          <GameComponent user={user} />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>জ্ঞান জয় - শিক্ষামূলক গেম | শিক্ষার্থীদের জন্য তৈরি</p>
          <p className="mt-2">© 2023 জ্ঞান জয়. সকল স্বত্ব সংরক্ষিত</p>
        </footer>
      </div>
    </div>
  )
}
