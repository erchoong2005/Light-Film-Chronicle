'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGameState, calculateBadgeLevel } from '@/lib/gameState'
import { questions } from '@/data/quiz'
import { eras } from '@/data/eras'
import { EraId } from '@/types'
import TimesheetButton from '@/components/TimesheetButton'

/* ── helpers ── */
type QuizItem = { filmId: number; filmName: string; eraId: EraId; qIdx: number; question: typeof questions[0]['questions'][0] }

/* ═══════════════ component ═══════════════ */

function BadgeLevelUpOverlay({ prevLevel, newLevel, onComplete }: { prevLevel: number; newLevel: number; onComplete: () => void }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => { setShow(false); setTimeout(onComplete, 400) }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(46,38,28,0.92)' }}>
      <div className="text-center">
        <div className="nameplate-level-up mx-auto mb-6 relative" style={{ width: 180, height: 120 }}>
          <div
            className="nameplate-glow absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(200,168,120,0.12), rgba(200,168,120,0.05))',
              border: '1px solid rgba(200,168,120,0.3)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={`/images/${newLevel}.${newLevel}【身份铭牌${newLevel}】.png`}
              alt={`铭牌Lv.${newLevel}`}
              width={160}
              height={100}
              className="object-contain"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
          </div>
        </div>
        <p
          className="badge-text-in font-serif text-xl font-bold tracking-wider"
          style={{ color: '#C8A878', textShadow: '0 0 20px rgba(200,168,120,0.3)' }}
        >
          铭牌升级！Lv.{prevLevel} → Lv.{newLevel}
        </p>
        <p
          className="badge-text-in mt-2 font-sans text-xs tracking-wider"
          style={{ color: 'rgba(200,168,120,0.6)', animationDelay: '0.3s' }}
        >
          学识精进，光影之路更进一步
        </p>
      </div>
    </div>
  )
}

export default function QuizPage() {
  const router = useRouter()
  const { state, markFilmQuiz } = useGameState()

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [currentFilmIdx, setCurrentFilmIdx] = useState(0)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [badgeLevelUp, setBadgeLevelUp] = useState<{ prev: number; next: number } | null>(null)

  /* flatten all quiz items */
  const allQuizItems = useMemo(() => {
    const items: QuizItem[] = []
    for (const group of questions) {
      group.questions.forEach((q, idx) => {
        items.push({ filmId: group.filmId, filmName: group.filmName, eraId: group.eraId, qIdx: idx, question: q })
      })
    }
    return items
  }, [])

  /* group quiz items by era */
  const eraGroups = useMemo(() => {
    const map = new Map<number, { eraId: EraId; films: { filmId: number; filmName: string; items: QuizItem[] }[] }>()
    for (const item of allQuizItems) {
      if (!map.has(item.eraId)) {
        map.set(item.eraId, { eraId: item.eraId, films: [] })
      }
      const eraGroup = map.get(item.eraId)!
      let filmGroup = eraGroup.films.find(f => f.filmId === item.filmId)
      if (!filmGroup) {
        filmGroup = { filmId: item.filmId, filmName: item.filmName, items: [] }
        eraGroup.films.push(filmGroup)
      }
      filmGroup.items.push(item)
    }
    return Array.from(map.values())
  }, [allQuizItems])

  /* build a flat list of (filmIdx, qIdx) pairs for navigation */
  const totalFilms = useMemo(() => {
    const result: { eraIdx: number; filmIdx: number; qIdx: number; filmName: string; eraId: EraId }[] = []
    eraGroups.forEach((eraGroup, eraIdx) => {
      eraGroup.films.forEach((film, filmIdx) => {
        film.items.forEach((q, qIdx) => {
          result.push({ eraIdx, filmIdx, qIdx, filmName: film.filmName, eraId: eraGroup.eraId })
        })
      })
    })
    return result
  }, [eraGroups])

  /* current question */
  const currentPos = totalFilms[currentFilmIdx]
  const currentItem = currentPos ? allQuizItems.find(item =>
    item.filmName === currentPos.filmName && item.qIdx === currentPos.qIdx
  ) : null

  /* unique global index for answers */
  const getGlobalIdx = useCallback((filmName: string, qIdx: number) => {
    return allQuizItems.findIndex(item => item.filmName === filmName && item.qIdx === qIdx)
  }, [allQuizItems])

  const selectAnswer = useCallback((filmName: string, qIdx: number, optionIdx: number) => {
    const gIdx = getGlobalIdx(filmName, qIdx)
    setQuizAnswers(prev => ({ ...prev, [gIdx]: optionIdx }))
  }, [getGlobalIdx])

  const submitQuiz = useCallback(() => {
    const prevLevel = state.badgeLevel
    setQuizSubmitted(true)
    const seen = new Set<number>()
    allQuizItems.forEach((item, idx) => {
      const userAns = quizAnswers[idx]
      if (userAns === item.question.answer && !seen.has(item.filmId)) {
        seen.add(item.filmId)
        markFilmQuiz(item.filmId)
      }
    })
    const newLevel = calculateBadgeLevel({
      ...state,
      filmQuizStatus: { ...state.filmQuizStatus, ...Object.fromEntries([...seen].map(id => [id, true])) },
    })
    if (newLevel > prevLevel) {
      setBadgeLevelUp({ prev: prevLevel, next: newLevel })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [allQuizItems, quizAnswers, markFilmQuiz, state])

  const totalAnswered = Object.keys(quizAnswers).length
  const totalQuestions = allQuizItems.length
  const progressPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0

  /* ── compute score ── */
  const scoreInfo = useMemo(() => {
    if (!quizSubmitted) return null
    let correct = 0
    allQuizItems.forEach((item, idx) => {
      if (quizAnswers[idx] === item.question.answer) correct++
    })
    return { correct, total: totalQuestions, pct: Math.round((correct / totalQuestions) * 100) }
  }, [quizSubmitted, allQuizItems, quizAnswers, totalQuestions])

  /* ═══════════════ render ═══════════════ */
  return (
    <div
      className="door-enter relative min-h-screen"
      style={{ background: 'linear-gradient(180deg, #1E1A14 0%, #2E261C 40%, #1E1A14 100%)' }}
    >
      {/* Film grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,168,120,0.15) 2px, rgba(200,168,120,0.15) 3px)`,
        }}
      />

      {/* Scattered sprocket outlines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`sprocket-deco-${i}`}
            className="absolute"
            style={{
              width: 14,
              height: 10,
              borderRadius: 2,
              border: '1px solid rgba(200,168,120,0.04)',
              left: `${(i * 23 + 7) % 100}%`,
              top: `${(i * 31 + 13) % 100}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      {/* Gold dust particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full animate-pulse"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              backgroundColor: 'rgba(200,168,120,0.12)',
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Diagonal light beam */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(200,168,120,0.015) 50%, transparent 70%)',
        }}
      />

      <TimesheetButton />

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => router.push('/archive')}
          className="flex items-center gap-2 font-serif text-sm tracking-wider transition-colors hover:text-[#C8A878] cursor-pointer"
          style={{ color: '#E9E2D5' }}
        >
          <span className="text-lg">←</span>
          <span>返回资料馆</span>
        </button>

        <h1
          className="font-serif text-lg tracking-[0.3em] font-bold"
          style={{ color: '#C8A878' }}
        >
          阅览互动
        </h1>

        <div className="text-xs font-sans opacity-50" style={{ color: '#C8A878' }}>
          {totalAnswered}/{totalQuestions} 题已答
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-20 px-6 mb-4">
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(66,55,41,0.6)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #C8A878, #D4B470)',
            }}
          />
        </div>
      </div>

      {/* Score banner */}
      {quizSubmitted && scoreInfo && (
        <div className="relative z-20 px-6 mb-6">
          <div
            className="max-w-3xl mx-auto rounded-xl p-5 text-center"
            style={{
              backgroundColor: 'rgba(109,139,104,0.15)',
              border: '1px solid rgba(109,139,104,0.35)',
            }}
          >
            <p className="font-serif text-xl font-bold mb-1" style={{ color: '#6D8B68' }}>
              答题完成！
            </p>
            <p className="font-sans text-sm" style={{ color: '#E9E2D5', opacity: 0.85 }}>
              共答对 <span className="font-bold" style={{ color: '#6D8B68' }}>{scoreInfo.correct}</span> / {scoreInfo.total} 题（{scoreInfo.pct}%）
            </p>
            <p className="text-xs mt-2 opacity-50 font-sans" style={{ color: '#C8A878' }}>
              答对的影片已标记为已答状态
            </p>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        {eraGroups.map((eraGroup) => {
          const era = eras.find(e => e.id === eraGroup.eraId)
          return (
            <div key={eraGroup.eraId} className="mb-12">
              {/* Era header */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-serif"
                  style={{ backgroundColor: '#C8A878', color: '#1E1A14' }}
                >
                  {eraGroup.eraId}
                </span>
                <div>
                  <h2 className="font-serif text-lg font-bold tracking-wider" style={{ color: '#C8A878' }}>
                    {era?.name}
                  </h2>
                  <p className="text-[11px] font-sans opacity-40" style={{ color: '#E9E2D5' }}>
                    {era?.period}
                  </p>
                </div>
                <div className="flex-1 h-px ml-2" style={{ backgroundColor: 'rgba(200,168,120,0.15)' }} />
              </div>

              {/* Films in this era */}
              {eraGroup.films.map((film) => (
                <div key={film.filmId} className="mb-8 ml-6">
                  {/* Film name header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C8A878' }} />
                    <h3 className="font-serif text-base font-bold" style={{ color: '#E9E2D5' }}>
                      《{film.filmName}》
                    </h3>
                    {(() => {
                      const gIdx = getGlobalIdx(film.filmName, 0)
                      const allCorrect = film.items.every(q => {
                        const g = getGlobalIdx(film.filmName, q.qIdx)
                        return quizAnswers[g] === q.question.answer
                      })
                      if (quizSubmitted) {
                        return (
                          <span
                            className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: allCorrect ? 'rgba(109,139,104,0.2)' : 'rgba(168,92,80,0.2)',
                              color: allCorrect ? '#6D8B68' : '#A85C50',
                            }}
                          >
                            {allCorrect ? '✓ 全对' : '部分错误'}
                          </span>
                        )
                      }
                      return null
                    })()}
                  </div>

                  {/* Questions */}
                  {film.items.map((item) => {
                    const gIdx = getGlobalIdx(film.filmName, item.qIdx)
                    const userAns = quizAnswers[gIdx]

                    return (
                      <div
                        key={item.qIdx}
                        className="mb-4 rounded-xl p-5"
                        style={{
                          backgroundColor: 'rgba(66,55,41,0.5)',
                          border: '1px solid rgba(200,168,120,0.12)',
                        }}
                      >
                        <p className="font-serif text-sm font-bold leading-relaxed mb-4" style={{ color: '#E9E2D5' }}>
                          <span className="opacity-40 font-sans text-xs mr-2" style={{ color: '#C8A878' }}>
                            第{item.qIdx + 1}题
                          </span>
                          {item.question.question}
                        </p>

                        <div className="space-y-2.5">
                          {item.question.options.map((opt, optIdx) => {
                            const isCorrect = optIdx === item.question.answer
                            const isSelected = userAns === optIdx

                            let optBg = 'rgba(46,38,28,0.5)'
                            let optBorder = 'rgba(200,168,120,0.12)'
                            let optColor = '#E9E2D5'

                            if (quizSubmitted) {
                              if (isCorrect) {
                                optBg = 'rgba(109,139,104,0.3)'
                                optBorder = '#6D8B68'
                                optColor = '#6D8B68'
                              } else if (isSelected && !isCorrect) {
                                optBg = 'rgba(168,92,80,0.3)'
                                optBorder = '#A85C50'
                                optColor = '#A85C50'
                              }
                            } else if (isSelected) {
                              optBg = 'rgba(200,168,120,0.15)'
                              optBorder = '#C8A878'
                              optColor = '#C8A878'
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => selectAnswer(film.filmName, item.qIdx, optIdx)}
                                className="w-full text-left rounded-lg px-4 py-3 text-sm font-sans transition-all cursor-pointer disabled:cursor-default"
                                style={{
                                  backgroundColor: optBg,
                                  border: `1px solid ${optBorder}`,
                                  color: optColor,
                                }}
                              >
                                {String.fromCharCode(65 + optIdx)}. {opt}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Fixed submit bar */}
      {!quizSubmitted && totalAnswered > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center py-4 px-6"
          style={{
            background: 'linear-gradient(transparent, rgba(30,26,20,0.95) 30%)',
          }}
        >
          <button
            onClick={submitQuiz}
            className="px-8 py-3 rounded-xl font-bold font-serif text-sm tracking-wider transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #C8A878, #D4B470)',
              color: '#2C241C',
              boxShadow: '0 4px 20px rgba(200,168,120,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          >
            提交全部答案
          </button>
        </div>
      )}

      {/* Fixed submit after submission */}
      {quizSubmitted && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center py-4 px-6"
          style={{
            background: 'linear-gradient(transparent, rgba(30,26,20,0.95) 30%)',
          }}
        >
          <button
            onClick={() => router.push('/archive')}
            className="px-8 py-3 rounded-xl font-bold font-serif text-sm tracking-wider cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #C8A878, #D4B470)',
              color: '#2C241C',
              boxShadow: '0 4px 20px rgba(200,168,120,0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          >
            返回资料馆
          </button>
        </div>
      )}

      {/* Badge level-up overlay */}
      {badgeLevelUp && (
        <BadgeLevelUpOverlay
          prevLevel={badgeLevelUp.prev}
          newLevel={badgeLevelUp.next}
          onComplete={() => setBadgeLevelUp(null)}
        />
      )}
    </div>
  )
}
