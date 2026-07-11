export interface Film {
  id: number
  name: string
  year: number
  director: string
 主演: string
  type: string
  剧情简介: string
  获奖记录: string
  era: EraId
  isMain: boolean
}

export type EraId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface Era {
  id: EraId
  name: string
  period: string
  description: string
}

export interface Challenge {
  eraId: EraId
  filmName: string
  eraIntro: string
  task: string
  options: ChallengeOption[]
  successEnding: string
  failEnding: string
  successImages: string[]
  failImages: string[]
  backgroundImages: string[]
  switchImages: string[]
  optionBg: string
}

export interface ChallengeOption {
  id: number
  text: string
  isCorrect: boolean
}

export interface QuizQuestion {
  filmId: number
  filmName: string
  eraId: EraId
  questions: {
    id: number
    question: string
    options: string[]
    answer: number
  }[]
}

export interface Collection {
  id: number
  eraId: EraId
  name: string
  description: string
  image: string
  usage: string
}

export interface Keyword {
  name: string
  definition: string
}

export interface FilmKeywords {
  filmId: number
  keywords: Keyword[]
}

export interface GameState {
  hasVisited: boolean
  filmReadStatus: Record<number, boolean>
  filmQuizStatus: Record<number, boolean>
  challengeStatus: Record<EraId, boolean>
  collectionStatus: Record<EraId, boolean>
  badgeLevel: number
}
