import { redirect } from "next/navigation"
import Link from "next/link"
import { getCurrentUser, logout } from "../actions/auth"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const categoryData: Record<string, { name: string; color: string }> = {
    science: { name: "বিজ্ঞান", color: "blue" },
    history: { name: "ইতিহাস", color: "green" },
    math: { name: "গণিত", color: "yellow" },
    geography: { name: "ভূগোল", color: "purple" },
    literature: { name: "সাহিত্য", color: "red" },
    general: { name: "সাধারণ জ্ঞান", color: "indigo" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-indigo-800 flex items-center">
                <i className="fas fa-user-circle mr-3"></i>
                প্রোফাইল
              </h1>
              <p className="text-gray-600">স্বাগতম, {user.name}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/"
                className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-2 px-6 rounded-full border border-indigo-600 transition-colors flex items-center"
              >
                <i className="fas fa-home mr-2"></i>
                হোম
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  লগআউট
                </button>
              </form>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              ব্যক্তিগত তথ্য
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <i className="fas fa-user text-gray-400 mr-3"></i>
                  <div>
                    <p className="text-gray-500 text-sm">নাম</p>
                    <p className="font-medium text-lg">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-gray-400 mr-3"></i>
                  <div>
                    <p className="text-gray-500 text-sm">ইমেইল</p>
                    <p className="font-medium text-lg">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-calendar text-gray-400 mr-3"></i>
                  <div>
                    <p className="text-gray-500 text-sm">যোগদানের তারিখ</p>
                    <p className="font-medium text-lg">{new Date(user.createdAt).toLocaleDateString("bn-BD")}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-gamepad text-gray-400 mr-3"></i>
                  <div>
                    <p className="text-gray-500 text-sm">মোট গেম</p>
                    <p className="font-medium text-lg">{user.scores?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-trophy mr-2"></i>
              আপনার স্কোর
            </h2>

            {!user.scores || user.scores.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <i className="fas fa-gamepad text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg mb-4">আপনি এখনও কোন গেম খেলেননি</p>
                <Link
                  href="/"
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                >
                  <i className="fas fa-play mr-2"></i>
                  গেম খেলুন
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                          <i className="fas fa-book mr-2"></i>বিষয়
                        </th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                          <i className="fas fa-star mr-2"></i>স্কোর
                        </th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                          <i className="fas fa-check-circle mr-2"></i>সঠিক উত্তর
                        </th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                          <i className="fas fa-calendar mr-2"></i>তারিখ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.scores
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((score: any, index: number) => (
                          <tr key={score.id} className={`border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${categoryData[score.category]?.color || "gray"}-100 text-${categoryData[score.category]?.color || "gray"}-800`}
                              >
                                <i className="fas fa-tag mr-2"></i>
                                {categoryData[score.category]?.name || score.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-lg text-green-600">{score.score}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium">
                                {score.correctAnswers}/{score.totalQuestions}
                              </span>
                              <span className="text-gray-500 ml-2">
                                ({Math.round((score.correctAnswers / score.totalQuestions) * 100)}%)
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {new Date(score.createdAt).toLocaleDateString("bn-BD")}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
