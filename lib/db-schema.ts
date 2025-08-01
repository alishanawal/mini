export type User = {
  id: string
  name: string
  email: string
  password: string // This will be hashed
  createdAt: Date
  scores: Score[]
}

export type Score = {
  id: string
  userId: string
  category: string
  score: number
  correctAnswers: number
  totalQuestions: number
  createdAt: Date
}
