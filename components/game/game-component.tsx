"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Category = {
  id: number
  name: string
  name_bn: string
  icon: string
  color: string
}

type Question = {
  id: number
  question_text: string
  options: string[]
  correct_answer: number
  difficulty: string
}

type GameComponentProps = {
  initialPlayerName: string
  categories: Category[]
  userId: string
}

export default function GameComponent({ initialPlayerName, categories, userId }: GameComponentProps) {
  const [currentScreen, setCurrentScreen] = useState<"welcome" | "quiz" | "results">("welcome")
  const [playerName, setPlayerName] = useState(initialPlayerName)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setCurrentCategory(category)
  }

  // Start the game
  const startGame = async () => {
    if (!currentCategory) {
      alert("দয়া করে একটি বিষয় নির্বাচন করুন")
      return
    }

    setIsLoading(true)

    try {
      // Fetch questions from the database
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("category_id", currentCategory.id)
        .limit(totalQuestions)

      if (error) throw error

      if (data && data.length > 0) {
        // Shuffle the questions
        const shuffledQuestions = [...data].sort(() => Math.random() - 0.5)
        setQuestions(shuffledQuestions.slice(0, totalQuestions))

        // Create a new game session
        const { data: sessionData, error: sessionError } = await supabase
          .from("game_sessions")
          .insert({
            user_id: userId,
            category_id: currentCategory.id,
            total_questions: Math.min(data.length, totalQuestions),
          })
          .select()

        if (sessionError) throw sessionError

        if (sessionData && sessionData.length > 0) {
          setSessionId(sessionData[0].id)
        }

        // Reset game state
        setCurrentQuestionIndex(0)
        setScore(0)
        setCorrectAnswers(0)
        setCurrentScreen("quiz")
      } else {
        alert("এই বিষয়ে কোন প্রশ্ন নেই। অন্য বিষয় নির্বাচন করুন।")
      }
    } catch (error) {
      console.error("Error starting game:", error)
      alert("গেম শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle option selection
  const handleOptionSelect = async (selectedOptionIndex: number) => {
    if (!questions[currentQuestionIndex] || !sessionId) return

    const question = questions[currentQuestionIndex]
    const isCorrect = selectedOptionIndex === question.correct_answer

    try {
      // Record the answer
      await supabase.from("user_answers").insert({
        session_id: sessionId,
        question_id: question.id,
        selected_option: selectedOptionIndex,
        is_correct: isCorrect,
      })

      // Update score
      let points = 0
      if (isCorrect) {
        if (question.difficulty === "সহজ") points = 10
        else if (question.difficulty === "মধ্যম") points = 20
        else if (question.difficulty === "কঠিন") points = 30
        else points = 10

        setScore((prevScore) => prevScore + points)
        setCorrectAnswers((prev) => prev + 1)
      }

      // Move to next question after a delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        } else {
          finishGame()
        }
      }, 1500)
    } catch (error) {
      console.error("Error recording answer:", error)
    }
  }

  // Finish the game
  const finishGame = async () => {
    if (!sessionId) return

    try {
      // Update the game session
      await supabase
        .from("game_sessions")
        .update({
          score,
          correct_answers: correctAnswers,
        })
        .eq("id", sessionId)

      setCurrentScreen("results")
    } catch (error) {
      console.error("Error finishing game:", error)
    }
  }

  // Play again with the same category
  const playAgain = () => {
    startGame()
  }

  // Change category
  const changeCategory = () => {
    setCurrentCategory(null)
    setCurrentScreen("welcome")
  }

  // Render the welcome screen
  const renderWelcomeScreen = () => (
    <div className="bg-white rounded-xl shadow-xl p-8 text-center">
      <div className="w-32 h-32 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
        <i className="fas fa-graduation-cap text-6xl text-indigo-600"></i>
      </div>
      <h2 className="text-3xl font-bold text-indigo-800 mb-4">আপনার জ্ঞান পরীক্ষা করুন</h2>
      <p className="text-gray-600 mb-8">
        এই গেমটি আপনাকে বিভিন্ন বিষয়ে জ্ঞান অর্জন করতে সাহায্য করবে। প্রতিটি সঠিক উত্তরের জন্য পয়েন্ট পাবেন এবং আপনার অগ্রগতি ট্র্যাক করতে
        পারবেন।
      </p>

      <div className="mb-8">
        <label className="block text-left text-gray-700 mb-2 font-medium">বিষয় নির্বাচন করুন:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card bg-${category.color}-50 rounded-lg p-4 cursor-pointer border-2 ${currentCategory?.id === category.id ? `border-${category.color}-500 ring-2 ring-${category.color}-300` : `border-${category.color}-100 hover:border-${category.color}-300`}`}
              onClick={() => handleCategorySelect(category)}
            >
              <i className={`fas fa-${category.icon} text-3xl text-${category.color}-600 mb-2`}></i>
              <h3 className={`font-semibold text-${category.color}-800`}>{category.name_bn}</h3>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={startGame}
        disabled={isLoading || !currentCategory}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "লোড হচ্ছে..." : "গেম শুরু করুন"} <i className="fas fa-play ml-2"></i>
      </button>
    </div>
  )

  // Render the quiz screen
  const renderQuizScreen = () => {
    if (questions.length === 0) return <div>লোড হচ্ছে...</div>

    const question = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-indigo-800">{currentCategory?.name_bn}</h2>
            <p className="text-gray-600">{playerName}</p>
          </div>
          <div className="flex items-center">
            <div className="relative w-12 h-12 mr-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                />
                <path
                  className="text-indigo-600"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                  style={{
                    transition: "stroke-dashoffset 0.5s",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-800">{Math.round(progress)}%</span>
                </div>
              </svg>
            </div>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-bold text-indigo-800">স্কোর: {score}</span>
            </div>
          </div>
        </div>

        <div className="question-card bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">
              প্রশ্ন {currentQuestionIndex + 1}/{questions.length}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
              {question.difficulty}
            </span>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-6">{question.question_text}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className="option-btn bg-white hover:bg-gray-50 text-left p-4 rounded-lg border border-gray-200 font-medium text-gray-800"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render the results screen
  const renderResultsScreen = () => (
    <div className="bg-white rounded-xl shadow-xl p-8 text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <i className="fas fa-trophy text-4xl text-green-600"></i>
      </div>
      <h2 className="text-3xl font-bold text-indigo-800 mb-2">অভিনন্দন!</h2>
      <p className="text-gray-600 mb-1">{playerName}</p>
      <p className="text-gray-600 mb-8">আপনি গেমটি সম্পন্ন করেছেন</p>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-gray-600">সঠিক উত্তর</p>
          <p className="text-3xl font-bold text-blue-600">
            {correctAnswers}/{questions.length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-gray-600">আপনার স্কোর</p>
          <p className="text-3xl font-bold text-green-600">{score}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            style={{ width: `${(correctAnswers / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          আপনার পারফরম্যান্স: {Math.round((correctAnswers / questions.length) * 100)}%
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={playAgain}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full"
        >
          আবার খেলুন <i className="fas fa-redo ml-2"></i>
        </button>
        <button
          onClick={changeCategory}
          className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-2 px-6 rounded-full border border-indigo-600"
        >
          নতুন বিষয় <i className="fas fa-exchange-alt ml-2"></i>
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      {currentScreen === "welcome" && renderWelcomeScreen()}
      {currentScreen === "quiz" && renderQuizScreen()}
      {currentScreen === "results" && renderResultsScreen()}
    </div>
  )
}
