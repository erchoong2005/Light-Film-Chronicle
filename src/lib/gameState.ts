'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameState, EraId } from '@/types'

const STORAGE_KEY = 'film-heritage-game-state'

const defaultState: GameState = {
  hasVisited: false,
  filmReadStatus: {},
  filmQuizStatus: {},
  challengeStatus: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  collectionStatus: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false },
  badgeLevel: 1,
}

function loadState(): GameState {
  if (typeof window === 'undefined') return { ...defaultState }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultState, ...JSON.parse(saved) }
    }
  } catch {}
  return { ...defaultState }
}

function saveState(state: GameState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export function calculateBadgeLevel(state: GameState): number {
  const readCount = Object.values(state.filmReadStatus).filter(Boolean).length
  const quizCount = Object.values(state.filmQuizStatus).filter(Boolean).length
  const challengeCount = Object.values(state.challengeStatus).filter(Boolean).length
  const collectionCount = Object.values(state.collectionStatus).filter(Boolean).length

  if (readCount >= 34 && quizCount >= 34 && challengeCount >= 7 && collectionCount >= 7) return 6
  if ((readCount >= 20 || challengeCount >= 5) && collectionCount >= 4) return 5
  if ((readCount >= 12 || challengeCount >= 3) && collectionCount >= 2) return 4
  if (readCount >= 8 || challengeCount >= 1 || quizCount >= 8) return 3
  if (readCount >= 3 || quizCount >= 3) return 2
  return 1
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      return loadState()
    }
    return defaultState
  })
  const [loaded] = useState(true)

  useEffect(() => {
    saveState(state)
  }, [state])

  const markVisited = useCallback(() => {
    setState(prev => ({ ...prev, hasVisited: true }))
  }, [])

  const markFilmRead = useCallback((filmId: number) => {
    setState(prev => ({
      ...prev,
      filmReadStatus: { ...prev.filmReadStatus, [filmId]: !prev.filmReadStatus[filmId] },
    }))
  }, [])

  const markFilmQuiz = useCallback((filmId: number) => {
    setState(prev => {
      const newQuizStatus = { ...prev.filmQuizStatus, [filmId]: true }
      const newState = { ...prev, filmQuizStatus: newQuizStatus }
      newState.badgeLevel = calculateBadgeLevel(newState)
      return newState
    })
  }, [])

  const markChallengeComplete = useCallback((eraId: EraId) => {
    setState(prev => {
      const newChallengeStatus = { ...prev.challengeStatus, [eraId]: true }
      const newCollectionStatus = { ...prev.collectionStatus, [eraId]: true }
      const newState = {
        ...prev,
        challengeStatus: newChallengeStatus,
        collectionStatus: newCollectionStatus,
      }
      newState.badgeLevel = calculateBadgeLevel(newState)
      return newState
    })
  }, [])

  const resetState = useCallback(() => {
    setState({ ...defaultState })
  }, [])

  const getEraProgress = useCallback((eraId: EraId) => {
    const chapterFilms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34].filter(fid => {
      const filmMap: Record<number, EraId> = {
        1:1,2:1,3:1,4:1,5:1,6:2,7:2,8:2,9:2,10:3,11:3,12:3,13:3,14:3,
        15:4,16:4,17:4,18:4,19:4,20:5,21:5,22:5,23:5,24:5,
        25:6,26:6,27:6,28:6,29:6,30:7,31:7,32:7,33:7,34:7
      }
      return filmMap[fid] === eraId
    })
    const readCount = chapterFilms.filter(fid => state.filmReadStatus[fid]).length
    const quizCount = chapterFilms.filter(fid => state.filmQuizStatus[fid]).length
    return { total: chapterFilms.length, readCount, quizCount }
  }, [state])

  return {
    state,
    loaded,
    markVisited,
    markFilmRead,
    markFilmQuiz,
    markChallengeComplete,
    resetState,
    getEraProgress,
  }
}
