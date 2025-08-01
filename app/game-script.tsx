"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, saveScore } from "./actions/auth"

export default function GameScript() {
  const router = useRouter()

  useEffect(() => {
    async function initGame() {
      const user = await getCurrentUser()

      document.addEventListener("DOMContentLoaded", () => {
        // Game variables
        let currentCategory = ""
        let playerName = user ? user.name : ""
        let questions = []
        let currentQuestionIndex = 0
        let score = 0
        let correctAnswers = 0
        const totalQuestions = 10

        // DOM elements
        const welcomeScreen = document.getElementById("welcome-screen")
        const quizScreen = document.getElementById("quiz-screen")
        const resultsScreen = document.getElementById("results-screen")
        const startGameBtn = document.getElementById("start-game-btn")
        const categoryCards = document.querySelectorAll(".category-card")
        const playerNameInput = document.getElementById("player-name")
        const categoryTitle = document.getElementById("category-title")
        const playerDisplay = document.getElementById("player-display")
        const questionNumber = document.getElementById("question-number")
        const questionText = document.getElementById("question-text")
        const optionsContainer = document.getElementById("options-container")
        const nextQuestionBtn = document.getElementById("next-question-btn")
        const feedbackMessage = document.getElementById("feedback-message")
        const scoreDisplay = document.getElementById("score")
        const progressRing = document.getElementById("progress-ring")
        const progressText = document.getElementById("progress-text")
        const finalPlayerName = document.getElementById("final-player-name")
        const finalScore = document.getElementById("final-score")
        const correctAnswersDisplay = document.getElementById("correct-answers")
        const performanceBar = document.getElementById("performance-bar")
        const performanceText = document.getElementById("performance-text")
        const playAgainBtn = document.getElementById("play-again-btn")
        const changeCategoryBtn = document.getElementById("change-category-btn")
        const difficultyDisplay = document.getElementById("difficulty")

        // Dummy data for categoryData and questionsDatabase
        const categoryData = {
          science: { name: "বিজ্ঞান", color: "green" },
          history: { name: "ইতিহাস", color: "blue" },
          sports: { name: "ক্রীড়া", color: "red" },
          math: { name: "গণিত", color: "purple" },
        }

        const questionsDatabase = {
          science: [
            { question: "বিজ্ঞান প্রশ্ন ১", options: ["A", "B", "C", "D"], answer: 0, difficulty: "সহজ" },
            { question: "বিজ্ঞান প্রশ্ন ২", options: ["A", "B", "C", "D"], answer: 1, difficulty: "মধ্যম" },
          ],
          history: [
            { question: "ইতিহাস প্রশ্ন ১", options: ["A", "B", "C", "D"], answer: 2, difficulty: "কঠিন" },
            { question: "ইতিহাস প্রশ্ন ২", options: ["A", "B", "C", "D"], answer: 3, difficulty: "সহজ" },
          ],
          sports: [
            { question: "ক্রীড়া প্রশ্ন ১", options: ["A", "B", "C", "D"], answer: 0, difficulty: "মধ্যম" },
            { question: "ক্রীড়া প্রশ্ন ২", options: ["A", "B", "C", "D"], answer: 1, difficulty: "কঠিন" },
          ],
          math: [
            { question: "গণিত প্রশ্ন ১", options: ["A", "B", "C", "D"], answer: 2, difficulty: "সহজ" },
            { question: "গণিত প্রশ্ন ২", options: ["A", "B", "C", "D"], answer: 3, difficulty: "মধ্যম" },
          ],
        }

        // If user is logged in, pre-fill the player name
        if (user && playerNameInput) {
          playerNameInput.value = user.name
        }

        // Event listeners
        if (categoryCards) {
          categoryCards.forEach((card) => {
            card.addEventListener("click", function () {
              // Remove active class from all cards
              categoryCards.forEach((c) => {
                c.classList.remove("ring-2", "ring-offset-2")
                const category = c.dataset.category
                c.classList.remove(`ring-${categoryData[category].color}-500`)
              })

              // Add active class to selected card
              currentCategory = this.dataset.category
              this.classList.add("ring-2", "ring-offset-2", `ring-${categoryData[currentCategory].color}-500`)
            })
          })
        }

        if (startGameBtn) startGameBtn.addEventListener("click", startGame)
        if (nextQuestionBtn) nextQuestionBtn.addEventListener("click", loadNextQuestion)
        if (playAgainBtn) playAgainBtn.addEventListener("click", playAgain)
        if (changeCategoryBtn) changeCategoryBtn.addEventListener("click", changeCategory)

        // Game functions
        function startGame() {
          playerName = playerNameInput.value.trim()

          if (!playerName) {
            alert("দয়া করে আপনার নাম লিখুন")
            return
          }

          if (!currentCategory) {
            alert("দয়া করে একটি বিষয় নির্বাচন করুন")
            return
          }

          // Get questions for selected category
          questions = [...questionsDatabase[currentCategory]]
          shuffleArray(questions)
          questions = questions.slice(0, totalQuestions)

          // Reset game state
          currentQuestionIndex = 0
          score = 0
          correctAnswers = 0

          // Update UI
          welcomeScreen.classList.add("hidden")
          quizScreen.classList.remove("hidden")

          const categoryInfo = categoryData[currentCategory]
          categoryTitle.textContent = categoryInfo.name
          categoryTitle.classList.add(`text-${categoryInfo.color}-600`)
          playerDisplay.textContent = `খেলোয়াড়: ${playerName}`

          // Load first question
          loadQuestion()
        }

        function loadQuestion() {
          if (currentQuestionIndex >= questions.length) {
            showResults()
            return
          }

          const question = questions[currentQuestionIndex]

          // Update question number and text
          questionNumber.textContent = `প্রশ্ন ${currentQuestionIndex + 1}/${totalQuestions}`
          questionText.textContent = question.question
          difficultyDisplay.textContent = question.difficulty

          // Update progress
          const progress = (currentQuestionIndex / totalQuestions) * 100
          progressRing.style.strokeDashoffset = 100 - progress
          progressText.textContent = `${Math.round(progress)}%`

          // Clear previous options
          optionsContainer.innerHTML = ""

          // Create and append option buttons
          question.options.forEach((option, index) => {
            const optionBtn = document.createElement("button")
            optionBtn.className = `option-btn bg-white hover:bg-gray-50 text-left p-4 rounded-lg border border-gray-200 font-medium text-gray-800`
            optionBtn.textContent = option
            optionBtn.dataset.optionIndex = index
            optionBtn.addEventListener("click", selectOption)
            optionsContainer.appendChild(optionBtn)
          })

          // Hide next button and clear feedback
          nextQuestionBtn.classList.add("hidden")
          feedbackMessage.textContent = ""
          feedbackMessage.className = "text-lg font-semibold"
        }

        function selectOption(e) {
          const selectedOptionIndex = Number.parseInt(e.target.dataset.optionIndex)
          const question = questions[currentQuestionIndex]
          const isCorrect = selectedOptionIndex === question.answer

          // Disable all options
          const optionButtons = document.querySelectorAll(".option-btn")
          optionButtons.forEach((btn) => {
            btn.disabled = true
            btn.classList.remove("hover:bg-gray-50")
          })

          // Mark correct answer
          optionButtons[question.answer].classList.add("bg-green-100", "border-green-300", "text-green-800")

          if (isCorrect) {
            // Correct answer
            e.target.classList.add("bg-green-100", "border-green-300", "text-green-800", "correct-answer")
            feedbackMessage.textContent = "সঠিক উত্তর!"
            feedbackMessage.classList.add("text-green-600")

            // Update score
            let points = 10
            if (question.difficulty === "মধ্যম") points = 20
            if (question.difficulty === "কঠিন") points = 30

            score += points
            correctAnswers++
            scoreDisplay.textContent = score
          } else {
            // Wrong answer
            e.target.classList.add("bg-red-100", "border-red-300", "text-red-800", "wrong-answer")
            feedbackMessage.textContent = "ভুল উত্তর!"
            feedbackMessage.classList.add("text-red-600")
          }

          // Show next button
          nextQuestionBtn.classList.remove("hidden")
        }

        function loadNextQuestion() {
          currentQuestionIndex++
          loadQuestion()
        }

        async function showResults() {
          quizScreen.classList.add("hidden")
          resultsScreen.classList.remove("hidden")

          // Update results
          finalPlayerName.textContent = playerName
          finalScore.textContent = score
          correctAnswersDisplay.textContent = `${correctAnswers}/${totalQuestions}`

          // Calculate performance
          const performancePercentage = (correctAnswers / totalQuestions) * 100
          performanceBar.style.width = `${performancePercentage}%`

          let performanceTextStr = ""
          if (performancePercentage >= 80) {
            performanceTextStr = "অসাধারণ! আপনি এই বিষয়ে খুব ভালো জানেন।"
            performanceBar.className = "h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
          } else if (performancePercentage >= 50) {
            performanceTextStr = "ভালো! তবে আরও কিছু শেখার আছে।"
            performanceBar.className = "h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"
          } else {
            performanceTextStr = "চেষ্টা চালিয়ে যান! আরও পড়াশোনা করুন।"
            performanceBar.className = "h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
          }

          performanceText.textContent = `আপনার পারফরম্যান্স: ${Math.round(performancePercentage)}% - ${performanceTextStr}`

          // Save score if user is logged in
          if (user) {
            await saveScore(currentCategory, score, correctAnswers, totalQuestions)
          }
        }

        function playAgain() {
          resultsScreen.classList.add("hidden")
          quizScreen.classList.remove("hidden")

          // Reset game state
          currentQuestionIndex = 0
          score = 0
          correctAnswers = 0
          scoreDisplay.textContent = "0"

          // Shuffle questions again
          shuffleArray(questions)

          // Load first question
          loadQuestion()
        }

        function changeCategory() {
          resultsScreen.classList.add("hidden")
          welcomeScreen.classList.remove("hidden")

          // Reset category selection
          categoryCards.forEach((card) => {
            card.classList.remove("ring-2", "ring-offset-2")
            const category = card.dataset.category
            card.classList.remove(`ring-${categoryData[category].color}-500`)
          })

          currentCategory = ""
          playerNameInput.value = playerName
        }

        // Utility functions
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
          }
          return array
        }

        // Set default category on page load
        if (categoryCards && categoryCards.length > 0) {
          categoryCards[0].click()
        }
      })
    }

    initGame()
  }, [router])

  return null
}
