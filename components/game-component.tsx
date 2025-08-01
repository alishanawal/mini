"use client"

import { useState, useEffect } from "react"
import { saveScore } from "@/app/actions/auth"

interface User {
  id: string
  name: string
  email: string
}

interface GameComponentProps {
  user: User | null
}

export default function GameComponent({ user }: GameComponentProps) {
  const [currentCategory, setCurrentCategory] = useState("")
  const [playerName, setPlayerName] = useState(user?.name || "")
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameState, setGameState] = useState<"welcome" | "quiz" | "results">("welcome")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const totalQuestions = 10

  // Category data
  const categoryData = {
    science: { name: "বিজ্ঞান", icon: "flask", color: "blue" },
    history: { name: "ইতিহাস", icon: "landmark", color: "green" },
    math: { name: "গণিত", icon: "square-root-alt", color: "yellow" },
    geography: { name: "ভূগোল", icon: "globe-asia", color: "purple" },
    literature: { name: "সাহিত্য", icon: "book-open", color: "red" },
    general: { name: "সাধারণ জ্ঞান", icon: "brain", color: "indigo" },
  }

  // Questions database
  const questionsDatabase = {
    science: [
      {
        question: "পৃথিবীর বায়ুমণ্ডলে কোন গ্যাসের পরিমাণ সবচেয়ে বেশি?",
        options: ["অক্সিজেন", "নাইট্রোজেন", "কার্বন ডাইঅক্সাইড", "হাইড্রোজেন"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "ফটোসিনথেসিস প্রক্রিয়ায় উদ্ভিদ কোন গ্যাস গ্রহণ করে?",
        options: ["অক্সিজেন", "নাইট্রোজেন", "কার্বন ডাইঅক্সাইড", "হাইড্রোজেন"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "মানবদেহের সবচেয়ে বড় অঙ্গ কোনটি?",
        options: ["হৃদপিণ্ড", "ফুসফুস", "ত্বক", "মস্তিষ্ক"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "নিউটনের গতির কয়টি সূত্র আছে?",
        options: ["১টি", "২টি", "৩টি", "৪টি"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "পানি কত ডিগ্রি সেলসিয়াসে ফুটে?",
        options: ["৫০°C", "৭৫°C", "১০০°C", "১২০°C"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "নিচের কোনটি অ্যাসিডের বৈশিষ্ট্য নয়?",
        options: ["নীল লিটমাসকে লাল করে", "স্বাদ টক", "সাবান তৈরি করে", "ধাতুর সাথে বিক্রিয়া করে"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "DNA-এর পূর্ণরূপ কি?",
        options: [
          "ডাইনামিক নিউক্লিক অ্যাসিড",
          "ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড",
          "ডুয়েল নিউক্লিয়ার অ্যাসিড",
          "ডেভেলপমেন্টাল নিউক্লিয়ার অ্যাসিড",
        ],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "নিচের কোনটি নবায়নযোগ্য শক্তির উৎস?",
        options: ["কয়লা", "প্রাকৃতিক গ্যাস", "সৌরশক্তি", "পেট্রোলিয়াম"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "আলোকবর্ষ কি পরিমাপ করে?",
        options: ["সময়", "দূরত্ব", "উজ্জ্বলতা", "তাপমাত্রা"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "নিচের কোনটি ধাতু নয়?",
        options: ["সোনা", "রূপা", "কার্বন", "লোহা"],
        answer: 2,
        difficulty: "মধ্যম",
      },
    ],
    history: [
      {
        question: "বাংলাদেশ কত সালে স্বাধীনতা লাভ করে?",
        options: ["১৯৬৫", "১৯৭১", "১৯৪৭", "১৯৫২"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "বাংলা ভাষা আন্দোলন কত সালে হয়েছিল?",
        options: ["১৯৪৭", "১৯৫২", "১৯৭১", "১৯৮৫"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "মুঘল সাম্রাজ্যের প্রতিষ্ঠাতা কে?",
        options: ["আকবর", "বাবর", "হুমায়ুন", "শাহজাহান"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "তাজমহল কে নির্মাণ করেছিলেন?",
        options: ["আকবর", "জাহাঙ্গীর", "শাহজাহান", "ওরঙ্গজেব"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?",
        options: ["শেখ মুজিবুর রহমান", "জিয়াউর রহমান", "আবু সাঈদ চৌধুরী", "এস এ সাত্তার"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "পলাশীর যুদ্ধ কত সালে হয়েছিল?",
        options: ["১৭৫৭", "১৭৬৪", "১৮৫৭", "১৯৪৭"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "নিচের কোনটি বাংলার নবাব ছিলেন না?",
        options: ["সিরাজউদ্দৌলা", "মীর জাফর", "মীর কাসিম", "টিপু সুলতান"],
        answer: 3,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের সংবিধান কত সালে গৃহীত হয়?",
        options: ["১৯৭১", "১৯৭২", "১৯৭৫", "১৯৮১"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "ছিয়াত্তরের মন্বন্তর কত সালে হয়েছিল?",
        options: ["১৭৭০", "১৮৫৭", "১৯৪৩", "১৯৭১"],
        answer: 0,
        difficulty: "কঠিন",
      },
      {
        question: "সিপাহী বিদ্রোহ কত সালে হয়েছিল?",
        options: ["১৭৫৭", "১৮৫৭", "১৯০৫", "১৯৪৭"],
        answer: 1,
        difficulty: "মধ্যম",
      },
    ],
    math: [
      {
        question: "এক ডজন সমান কতটি?",
        options: ["৬", "১০", "১২", "২০"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "এক শতকের সমান কত বছর?",
        options: ["১০", "৫০", "১০০", "১০০০"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "তিন কোণ বিশিষ্ট জ্যামিতিক আকৃতিকে কি বলে?",
        options: ["চতুর্ভুজ", "ত্রিভুজ", "পঞ্চভুজ", "বৃত্ত"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "১০০০ গ্রাম সমান কত কিলোগ্রাম?",
        options: ["১", "১০", "১০০", "১০০০"],
        answer: 0,
        difficulty: "সহজ",
      },
      {
        question: "একটি সমকোণী ত্রিভুজের একটি কোণের পরিমাপ কত?",
        options: ["৪৫°", "৬০°", "৯০°", "১৮০°"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "২ এর ঘাত ৩ সমান কত?",
        options: ["৪", "৬", "৮", "৯"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "একটি বৃত্তের পরিধি নির্ণয়ের সূত্র কি?",
        options: ["πr²", "২πr", "৪πr²", "πd"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "একটি সংখ্যার সাথে ৫ যোগ করলে ১২ হয়। সংখ্যাটি কত?",
        options: ["৫", "৭", "১২", "১৭"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "একটি সমবাহু ত্রিভুজের প্রতিটি কোণের পরিমাপ কত?",
        options: ["৩০°", "৪৫°", "৬০°", "৯০°"],
        answer: 2,
        difficulty: "কঠিন",
      },
      {
        question: "১ থেকে ১০ পর্যন্ত মৌলিক সংখ্যা কয়টি?",
        options: ["২", "৪", "৫", "৬"],
        answer: 1,
        difficulty: "কঠিন",
      },
    ],
    geography: [
      {
        question: "বাংলাদেশের রাজধানী কোথায়?",
        options: ["চট্টগ্রাম", "ঢাকা", "খুলনা", "রাজশাহী"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের জাতীয় ফুল কি?",
        options: ["গোলাপ", "গাঁদা", "শাপলা", "জবা"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের দীর্ঘতম নদী কোনটি?",
        options: ["যমুনা", "পদ্মা", "মেঘনা", "ব্রহ্মপুত্র"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের দক্ষিণে কোন দেশ অবস্থিত?",
        options: ["ভারত", "মিয়ানমার", "নেপাল", "বাংলাদেশের দক্ষিণে সমুদ্র"],
        answer: 3,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের বৃহত্তম বন কোনটি?",
        options: ["ভাওয়াল জাতীয় উদ্যান", "লাউয়াছড়া জাতীয় উদ্যান", "সুন্দরবন", "মধুপুর গড়"],
        answer: 2,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের জাতীয় পশু কি?",
        options: ["হাতি", "বাঘ", "হরিণ", "ময়ূর"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের কোন জেলায় সমুদ্র সৈকত নেই?",
        options: ["কক্সবাজার", "চট্টগ্রাম", "খুলনা", "কুমিল্লা"],
        answer: 3,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের কোন মাসে বর্ষাকাল শুরু হয়?",
        options: ["এপ্রিল", "জুন", "আগস্ট", "অক্টোবর"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের সর্বোচ্চ পর্বতশৃঙ্গ কোনটি?",
        options: ["কেওক্রাডং", "তাজিংডং", "সাকা হাফং", "মোদক মুয়াল"],
        answer: 2,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের জাতীয় ফল কি?",
        options: ["আম", "জাম", "কাঁঠাল", "লিচু"],
        answer: 2,
        difficulty: "সহজ",
      },
    ],
    literature: [
      {
        question: "কাজী নজরুল ইসলাম কে কি নামে পরিচিত?",
        options: ["বিদ্রোহী কবি", "রবীন্দ্রনাথ", "মাইকেল মধুসূদন", "জসীমউদ্দীন"],
        answer: 0,
        difficulty: "সহজ",
      },
      {
        question: "রবীন্দ্রনাথ ঠাকুর কত সালে নোবেল পুরস্কার পান?",
        options: ["১৯১৩", "১৯২১", "১৯৩০", "১৯৪৫"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "মাইকেল মধুসূদন দত্তের বিখ্যাত কাব্যগ্রন্থ কোনটি?",
        options: ["কপালকুণ্ডলা", "মেঘনাদবধ কাব্য", "গীতাঞ্জলি", "পদ্মাবতী"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলা সাহিত্যের প্রথম উপন্যাস কোনটি?",
        options: ["আলালের ঘরের দুলাল", "কপালকুণ্ডলা", "দুর্গেশনন্দিনী", "চোখের বালি"],
        answer: 0,
        difficulty: "কঠিন",
      },
      {
        question: "রবীন্দ্রনাথ ঠাকুরের 'গীতাঞ্জলি' কোন ভাষায় অনূদিত হয়েছিল?",
        options: ["ইংরেজি", "ফরাসি", "জার্মান", "রুশ"],
        answer: 0,
        difficulty: "কঠিন",
      },
      {
        question: "কোন কবিকে 'পল্লীকবি' বলা হয়?",
        options: ["জসীমউদ্দীন", "কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "মাইকেল মধুসূদন দত্ত"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলা সাহিত্যের প্রথম মহিলা ঔপন্যাসিক কে?",
        options: ["বেগম রোকেয়া", "স্বর্ণকুমারী দেবী", "মহাশ্বেতা দেবী", "আশাপূর্ণা দেবী"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "'হাজার বছর ধরে' উপন্যাসের রচয়িতা কে?",
        options: ["জহির রায়হান", "হুমায়ূন আহমেদ", "আখতারুজ্জামান ইলিয়াস", "সৈয়দ শামসুল হক"],
        answer: 0,
        difficulty: "মধ্যম",
      },
      {
        question: "কোন কবিতাটি কাজী নজরুল ইসলামের লেখা নয়?",
        options: ["বিদ্রোহী", "কামাল পাশা", "আনন্দময়ীর আগমনে", "বাংলাদেশের স্বাধীনতা"],
        answer: 3,
        difficulty: "কঠিন",
      },
      {
        question: "রবীন্দ্রনাথ ঠাকুরের 'শেষের কবিতা' কোন ধরনের রচনা?",
        options: ["উপন্যাস", "কবিতা", "নাটক", "প্রবন্ধ"],
        answer: 0,
        difficulty: "মধ্যম",
      },
    ],
    general: [
      {
        question: "বাংলাদেশের জাতীয় ক্রিকেট দলের অধিনায়ক কে?",
        options: ["মাশরাফি বিন মর্তুজা", "সাকিব আল হাসান", "তামিম ইকবাল", "মুশফিকুর রহিম"],
        answer: 2,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের জাতীয় দিবস কত তারিখে পালিত হয়?",
        options: ["২১শে ফেব্রুয়ারি", "২৬শে মার্চ", "১৬ই ডিসেম্বর", "১লা মে"],
        answer: 1,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের জাতীয় সংসদের আসন সংখ্যা কত?",
        options: ["২০০", "৩০০", "৩৫০", "৪০০"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের জাতীয় পতাকার ডিজাইনার কে?",
        options: ["কামরুল হাসান", "শহীদ মিনার", "কামরুল হাসান", "পটুয়া কামরুল হাসান"],
        answer: 0,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের জাতীয় সঙ্গীতের রচয়িতা কে?",
        options: ["কাজী নজরুল ইসলাম", "রবীন্দ্রনাথ ঠাকুর", "দ্বিজেন্দ্রলাল রায়", "আতাউর রহমান"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের প্রথম প্রধানমন্ত্রী কে ছিলেন?",
        options: ["শেখ মুজিবুর রহমান", "তাজউদ্দীন আহমেদ", "জিয়াউর রহমান", "খালেদা জিয়া"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের জাতীয় উদ্যান কোনটি?",
        options: ["সুন্দরবন", "ভাওয়াল জাতীয় উদ্যান", "লাউয়াছড়া জাতীয় উদ্যান", "রমনা পার্ক"],
        answer: 1,
        difficulty: "কঠিন",
      },
      {
        question: "বাংলাদেশের জাতীয় খেলা কি?",
        options: ["ক্রিকেট", "ফুটবল", "হকি", "কাবাডি"],
        answer: 3,
        difficulty: "সহজ",
      },
      {
        question: "বাংলাদেশের জাতীয় স্মৃতিসৌধ কোথায় অবস্থিত?",
        options: ["ঢাকা", "সাভার", "কুমিল্লা", "চট্টগ্রাম"],
        answer: 1,
        difficulty: "মধ্যম",
      },
      {
        question: "বাংলাদেশের জাতীয় কবি কে?",
        options: ["রবীন্দ্রনাথ ঠাকুর", "কাজী নজরুল ইসলাম", "জসীমউদ্দীন", "মাইকেল মধুসূদন দত্ত"],
        answer: 1,
        difficulty: "সহজ",
      },
    ],
  }

  useEffect(() => {
    if (user) {
      setPlayerName(user.name)
    }
  }, [user])

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const startGame = () => {
    if (!playerName.trim()) {
      alert("দয়া করে আপনার নাম লিখুন")
      return
    }

    if (!currentCategory) {
      alert("দয়া করে একটি বিষয় নির্বাচন করুন")
      return
    }

    const categoryQuestions = questionsDatabase[currentCategory as keyof typeof questionsDatabase] || []
    const shuffledQuestions = shuffleArray(categoryQuestions)
    setQuestions(shuffledQuestions.slice(0, totalQuestions))
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setGameState("quiz")
    setSelectedOption(null)
    setShowFeedback(false)
    setIsAnswered(false)
  }

  const selectOption = (optionIndex: number) => {
    if (isAnswered) return

    setSelectedOption(optionIndex)
    setIsAnswered(true)
    setShowFeedback(true)

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = optionIndex === currentQuestion.answer

    if (isCorrect) {
      let points = 10
      if (currentQuestion.difficulty === "মধ্যম") points = 20
      if (currentQuestion.difficulty === "কঠিন") points = 30

      setScore((prev) => prev + points)
      setCorrectAnswers((prev) => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      showResults()
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setIsAnswered(false)
    }
  }

  const showResults = async () => {
    setGameState("results")

    // Save score if user is logged in
    if (user) {
      try {
        await saveScore(currentCategory, score, correctAnswers, totalQuestions)
      } catch (error) {
        console.error("Error saving score:", error)
      }
    }
  }

  const playAgain = () => {
    const categoryQuestions = questionsDatabase[currentCategory as keyof typeof questionsDatabase] || []
    const shuffledQuestions = shuffleArray(categoryQuestions)
    setQuestions(shuffledQuestions.slice(0, totalQuestions))
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setGameState("quiz")
    setSelectedOption(null)
    setShowFeedback(false)
    setIsAnswered(false)
  }

  const changeCategory = () => {
    setGameState("welcome")
    setCurrentCategory("")
    setSelectedOption(null)
    setShowFeedback(false)
    setIsAnswered(false)
  }

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const currentQuestion = questions[currentQuestionIndex]

  if (gameState === "welcome") {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
          <i className="fas fa-graduation-cap text-6xl text-indigo-600"></i>
        </div>
        <h2 className="text-3xl font-bold text-indigo-800 mb-4">আপনার জ্ঞান পরীক্ষা করুন</h2>
        <p className="text-gray-600 mb-8">
          এই গেমটি আপনাকে বিভিন্ন বিষয়ে জ্ঞান অর্জন করতে সাহায্য করবে। প্রতিটি সঠিক উত্তরের জন্য পয়েন্ট পাবেন এবং আপনার অগ্রগতি ট্র্যাক
          করতে পারবেন।
        </p>

        <div className="mb-8">
          <label htmlFor="player-name" className="block text-left text-gray-700 mb-2 font-medium">
            আপনার নাম লিখুন:
          </label>
          <input
            type="text"
            id="player-name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="আপনার নাম"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div className="mb-8">
          <label className="block text-left text-gray-700 mb-2 font-medium">বিষয় নির্বাচন করুন:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(categoryData).map(([key, category]) => (
              <div
                key={key}
                className={`category-card bg-${category.color}-50 rounded-lg p-4 cursor-pointer border-2 transition-all ${
                  currentCategory === key
                    ? `border-${category.color}-500 ring-2 ring-${category.color}-500 ring-offset-2`
                    : `border-${category.color}-100 hover:border-${category.color}-300`
                }`}
                onClick={() => setCurrentCategory(key)}
              >
                <i className={`fas fa-${category.icon} text-3xl text-${category.color}-600 mb-2`}></i>
                <h3 className={`font-semibold text-${category.color}-800`}>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105"
        >
          গেম শুরু করুন <i className="fas fa-play ml-2"></i>
        </button>
      </div>
    )
  }

  if (gameState === "quiz" && currentQuestion) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2
              className={`text-xl font-bold text-${categoryData[currentCategory as keyof typeof categoryData]?.color || "indigo"}-800`}
            >
              {categoryData[currentCategory as keyof typeof categoryData]?.name || currentCategory}
            </h2>
            <p className="text-gray-600">খেলোয়াড়: {playerName}</p>
          </div>
          <div className="flex items-center">
            <div className="relative w-12 h-12 mr-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                />
                <path
                  className="text-indigo-600 transition-all duration-500"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3"
                  stroke="currentColor"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-800">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="bg-indigo-100 px-4 py-2 rounded-full">
              <span className="font-bold text-indigo-800">স্কোর: {score}</span>
            </div>
          </div>
        </div>

        <div className="question-card bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">
              প্রশ্ন {currentQuestionIndex + 1}/{totalQuestions}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentQuestion.difficulty === "সহজ"
                  ? "bg-green-100 text-green-800"
                  : currentQuestion.difficulty === "মধ্যম"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => selectOption(index)}
                disabled={isAnswered}
                className={`option-btn text-left p-4 rounded-lg border font-medium transition-all ${
                  isAnswered
                    ? index === currentQuestion.answer
                      ? "bg-green-100 border-green-300 text-green-800"
                      : selectedOption === index
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800 hover:scale-102"
                } ${selectedOption === index && !isAnswered ? "ring-2 ring-indigo-500" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {showFeedback && (
              <span className={selectedOption === currentQuestion.answer ? "text-green-600" : "text-red-600"}>
                {selectedOption === currentQuestion.answer ? "সঠিক উত্তর!" : "ভুল উত্তর!"}
              </span>
            )}
          </div>
          {showFeedback && (
            <button
              onClick={nextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              {currentQuestionIndex + 1 >= questions.length ? "ফলাফল দেখুন" : "পরবর্তী প্রশ্ন"}{" "}
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          )}
        </div>
      </div>
    )
  }

  if (gameState === "results") {
    const performancePercentage = (correctAnswers / totalQuestions) * 100
    let performanceText = ""
    let performanceColor = ""

    if (performancePercentage >= 80) {
      performanceText = "অসাধারণ! আপনি এই বিষয়ে খুব ভালো জানেন।"
      performanceColor = "from-green-500 to-blue-500"
    } else if (performancePercentage >= 50) {
      performanceText = "ভালো! তবে আরও কিছু শেখার আছে।"
      performanceColor = "from-yellow-500 to-green-500"
    } else {
      performanceText = "চেষ্টা চালিয়ে যান! আরও পড়াশোনা করুন।"
      performanceColor = "from-red-500 to-yellow-500"
    }

    return (
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
              {correctAnswers}/{totalQuestions}
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
              className={`h-full bg-gradient-to-r ${performanceColor} rounded-full transition-all duration-1000`}
              style={{ width: `${performancePercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            আপনার পারফরম্যান্স: {Math.round(performancePercentage)}% - {performanceText}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={playAgain}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            আবার খেলুন <i className="fas fa-redo ml-2"></i>
          </button>
          <button
            onClick={changeCategory}
            className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-2 px-6 rounded-full border border-indigo-600 transition-colors"
          >
            নতুন বিষয় <i className="fas fa-exchange-alt ml-2"></i>
          </button>
        </div>
      </div>
    )
  }

  return null
}
