'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { challenges } from '@/data/challenges'
import { eras } from '@/data/eras'
import { useGameState } from '@/lib/gameState'
import { EraId } from '@/types'
import TimesheetButton from '@/components/TimesheetButton'

type Phase = 'entry' | 'background' | 'transition' | 'task' | 'options' | 'result'

const optionIcons = [
  <svg key="camera" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="5" y="13" width="38" height="24" rx="4" />
    <rect x="17" y="9" width="14" height="6" rx="2" strokeWidth="1.2" />
    <circle cx="24" cy="25" r="9" />
    <circle cx="24" cy="25" r="4" fill="currentColor" opacity="0.35" />
  </svg>,
  <svg key="reel" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="8" strokeWidth="1.2" />
    <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="36.6" cy="15.4" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="39" cy="24" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="36.6" cy="32.6" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="24" cy="40" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="11.4" cy="32.6" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="9" cy="24" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="11.4" cy="15.4" r="2" fill="currentColor" opacity="0.5" />
  </svg>,
  <svg key="clapper" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
    <rect x="5" y="16" width="38" height="22" rx="3" />
    <rect x="5" y="16" width="38" height="10" rx="3" />
    <line x1="5" y1="21" x2="43" y2="21" strokeWidth="1" opacity="0.3" />
    <line x1="9" y1="17" x2="26" y2="24" strokeWidth="1.8" />
    <line x1="26" y1="24" x2="43" y2="17" strokeWidth="1.8" />
    <line x1="5" y1="26" x2="43" y2="26" strokeWidth="1" opacity="0.15" />
  </svg>,
]

const eraBadgeImages: Record<number, string> = {
  1: '2.1【成就徽章：板块一】.png',
  2: '2.2【成就徽章：板块二】.png',
  3: '2.3【成就徽章：板块三】.png',
  4: '2.4【成就徽章：板块四】.png',
  5: '2.5【成就徽章：板块五】.png',
  6: '2.6【成就徽章：板块六】.png',
  7: '2.7【成就徽章：板块七】.png',
}

function AchievementBadgeUnlock({ eraId, eraName, onComplete }: { eraId: number; eraName: string; onComplete: () => void }) {
  const router = useRouter()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 1800),
      setTimeout(() => setPhase(6), 2400),
      setTimeout(() => setPhase(7), 3000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleNavigate = (path: string) => {
    onComplete()
    router.push(path)
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 100,
        backgroundColor: phase >= 1 ? 'rgba(46,38,28,0.92)' : 'transparent',
        transition: 'background-color 300ms ease',
      }}
    >
      {phase >= 2 && (
        <div className="flex flex-col items-center">
          <div className="badge-float-wrapper">
            <div className={phase >= 5 ? 'badge-spin' : ''}>
              <div
                className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden border-2"
                style={{
                  borderColor: 'rgba(200,168,120,0.6)',
                  boxShadow: '0 0 40px rgba(200,168,120,0.3)',
                  filter: phase < 3 ? 'grayscale(1) brightness(0.5)' : 'grayscale(0) brightness(1)',
                  transition: 'filter 500ms ease',
                }}
              >
                <Image
                  src={`/images/${eraBadgeImages[eraId]}`}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ mixBlendMode: 'multiply' }}
                />
                {phase < 3 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-4xl"
                      style={{ opacity: phase >= 2 ? 1 : 0, transition: 'opacity 300ms ease' }}
                    >
                      🔒
                    </span>
                  </div>
                )}
                {phase >= 4 && (
                  <div
                    className="absolute inset-0 badge-sweep-anim"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(200,168,120,0.6) 50%, transparent 100%)',
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {phase >= 6 && (
            <p
              className="text-fade-in text-center mt-8 font-serif text-xl md:text-2xl font-bold"
              style={{ color: '#C8A878', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              解锁【{eraName}】成就徽章
            </p>
          )}

          {phase >= 7 && (
            <div className="text-fade-in flex flex-col gap-3 mt-6">
              <button onClick={() => handleNavigate('/experience')} className="btn-gold text-sm px-8 py-3">
                结束闯关
              </button>
              <button onClick={() => handleNavigate('/timesheet')} className="btn-gold text-sm px-8 py-3">
                查看光影场记单成就徽章
              </button>
              <button onClick={() => handleNavigate(`/collection?unlock=${eraId}`)} className="btn-gold text-sm px-8 py-3">
                前往藏品馆查看藏品解锁
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .badge-float-wrapper {
          animation: badgeFloatUp 800ms ease-out forwards;
        }
        @keyframes badgeFloatUp {
          0% { transform: translateY(20px) scale(0.3); opacity: 0; }
          100% { transform: translateY(-8px) scale(1); opacity: 1; }
        }
        .badge-spin {
          animation: badgeSpin 1200ms ease-in-out;
        }
        @keyframes badgeSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(720deg); }
        }
        .badge-sweep-anim {
          animation: badgeSweep 600ms ease-in-out forwards;
        }
        @keyframes badgeSweep {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function FadeImage({ src, className = '' }: { src: string; className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Image src={`/images/${src}`} alt="" fill className="object-cover" />
    </div>
  )
}

function CrossfadePair({ current, previous }: { current: string; previous: string | null }) {
  return (
    <div className="absolute inset-0">
      {previous && (
        <div className="absolute inset-0" style={{ zIndex: 2, animation: 'xfadeOut 1000ms ease forwards' }}>
          <Image src={`/images/${previous}`} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Image src={`/images/${current}`} alt="" fill className="object-cover" priority />
      </div>
      <style jsx>{`
        @keyframes xfadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function ChallengePage() {
  const params = useParams()
  const router = useRouter()
  const { markChallengeComplete } = useGameState()

  const eraId = parseInt(params.eraId as string, 10) as EraId
  const challenge = challenges.find(c => c.eraId === eraId)
  const era = eras.find(e => e.id === eraId)

  const [phase, setPhase] = useState<Phase>('entry')
  const [flashVisible, setFlashVisible] = useState(true)
  const [switchIdx, setSwitchIdx] = useState(0)
  const [prevSwitch, setPrevSwitch] = useState<string | null>(null)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [resultStep, setResultStep] = useState(0)
  const [resultImgIdx, setResultImgIdx] = useState(0)
  const [prevResult, setPrevResult] = useState<string | null>(null)
  const [showBadge, setShowBadge] = useState(false)
  const [optionVisible, setOptionVisible] = useState(0)
  const [bgTextVisible, setBgTextVisible] = useState(false)
  const [resultFlashBlack, setResultFlashBlack] = useState(false)

  if (!challenge || !era) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#2E261C' }}>
        <p className="font-serif text-lg" style={{ color: '#C8A878' }}>未找到该时代挑战数据</p>
        <button onClick={() => router.push('/experience')} className="btn-gold text-sm">返回体验馆</button>
      </div>
    )
  }

  const isCorrect = selectedOptionId !== null
    ? challenge.options.find(o => o.id === selectedOptionId)?.isCorrect ?? false
    : false

  const resultImages = isCorrect ? challenge.successImages : challenge.failImages

  /* ── Entry: flash-black overlay then fade to background ── */
  useEffect(() => {
    if (phase !== 'entry') return
    const t1 = setTimeout(() => setFlashVisible(false), 1500)
    const t2 = setTimeout(() => setPhase('background'), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  /* ── Background: wait for user click ── */
  useEffect(() => {
    if (phase !== 'background') return
    setBgTextVisible(false)
    const t1 = setTimeout(() => setBgTextVisible(true), 4000)
    return () => clearTimeout(t1)
  }, [phase])

  const handleBgClick = useCallback(() => {
    setPhase('transition')
  }, [])

  /* ── Transition: cycle switchImages, then go to task ── */
  useEffect(() => {
    if (phase !== 'transition') return
    const total = challenge.switchImages.length
    if (switchIdx >= total - 1) {
      const t = setTimeout(() => setPhase('task'), 3000)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setPrevSwitch(challenge.switchImages[switchIdx])
      setSwitchIdx(switchIdx + 1)
    }, 4000)
    return () => clearTimeout(t)
  }, [phase, switchIdx, challenge])

  useEffect(() => {
    if (!prevSwitch) return
    const t = setTimeout(() => setPrevSwitch(null), 1000)
    return () => clearTimeout(t)
  }, [prevSwitch])

  /* ── Task: click to proceed ── */
  const handleTaskClick = useCallback(() => {
    setPhase('options')
    setOptionVisible(0)
  }, [])

  /* ── Options: staggered appearance ── */
  useEffect(() => {
    if (phase !== 'options') return
    if (optionVisible < 3) {
      const t = setTimeout(() => setOptionVisible(optionVisible + 1), 300)
      return () => clearTimeout(t)
    }
  }, [phase, optionVisible])

  const handleSelectOption = useCallback((optionId: number) => {
    setSelectedOptionId(optionId)
    setResultFlashBlack(true)
    setTimeout(() => {
      setResultFlashBlack(false)
      setResultStep(0)
      setResultImgIdx(0)
      setPrevResult(null)
      setPhase('result')
    }, 600)
  }, [])

  /* ── Result: show title + ending text from first image; "了解" on last ── */
  useEffect(() => {
    if (phase !== 'result') return
    if (resultStep === 0) {
      // Show first result image immediately with title + text
      const t = setTimeout(() => setResultStep(1), 800)
      return () => clearTimeout(t)
    }
  }, [phase, resultStep])

  useEffect(() => {
    if (phase !== 'result' || resultStep < 1 || resultStep >= 2) return
    const total = resultImages.length
    if (resultImgIdx >= total) return
    const t = setTimeout(() => {
      if (resultImgIdx >= total - 1) {
        // Last image shown — now allow "了解" button
        setResultStep(2)
      } else {
        setPrevResult(resultImages[resultImgIdx])
        setResultImgIdx(resultImgIdx + 1)
      }
    }, 4000)
    return () => clearTimeout(t)
  }, [phase, resultStep, resultImgIdx, resultImages])

  useEffect(() => {
    if (!prevResult) return
    const t = setTimeout(() => setPrevResult(null), 1000)
    return () => clearTimeout(t)
  }, [prevResult])

  const handleUnderstand = useCallback(() => {
    if (isCorrect) {
      markChallengeComplete(challenge.eraId as EraId)
      setShowBadge(true)
    } else {
      router.push('/experience')
    }
  }, [isCorrect, challenge, markChallengeComplete, router])

  const handleRetry = useCallback(() => {
    setPhase('entry')
    setFlashVisible(true)
    setSwitchIdx(0)
    setPrevSwitch(null)
    setSelectedOptionId(null)
    setResultStep(0)
    setResultImgIdx(0)
    setPrevResult(null)
    setOptionVisible(0)
  }, [])

  const handleBadgeComplete = useCallback(() => {
    setShowBadge(false)
    router.push('/experience')
  }, [router])

  const currentSwitch = challenge.switchImages[switchIdx]

  const endingText = isCorrect ? challenge.successEnding : challenge.failEnding
  const finalTitle = isCorrect ? '闯关成功' : '闯关失败'
  const finalColor = isCorrect ? '#C8A878' : '#A85C50'

  return (
    <div className="door-enter relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: '#2E261C' }}>

      {showBadge && (
        <AchievementBadgeUnlock
          eraId={eraId}
          eraName={era.name}
          onComplete={handleBadgeComplete}
        />
      )}

      {/* ═══ ENTRY: flash-black ═══ */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 50,
          backgroundColor: '#000',
          opacity: flashVisible ? 1 : 0,
          transition: 'opacity 1000ms ease',
          pointerEvents: flashVisible ? 'auto' : 'none',
        }}
      />

      {/* ═══ OPTION→RESULT FLASH-BLACK ═══ */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 49,
          backgroundColor: '#000',
          opacity: resultFlashBlack ? 1 : 0,
          transition: 'opacity 400ms ease',
          pointerEvents: resultFlashBlack ? 'auto' : 'none',
        }}
      />

      <TimesheetButton />

      {/* ═══ BACKGROUND PHASE ═══ */}
      {phase === 'background' && (
        <div
          className="absolute inset-0"
          onClick={handleBgClick}
          style={{ cursor: 'pointer' }}
        >
          <FadeImage src={challenge.backgroundImages[0]} />
          {bgTextVisible && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 py-20"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              <div className="max-w-2xl text-center text-fade-in">
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold mb-6"
                  style={{ color: '#C8A878', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                >
                  {challenge.filmName}
                </h2>
                <p
                  className="text-sm md:text-base font-sans leading-relaxed"
                  style={{ color: '#E9E2D5', textShadow: '0 2px 6px rgba(0,0,0,0.6)', lineHeight: 1.8 }}
                >
                  {challenge.eraIntro}
                </p>
              </div>
              <p
                className="text-fade-in absolute bottom-8 text-xs font-sans"
                style={{ color: 'rgba(233,226,213,0.4)' }}
              >
                点击任意处继续
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══ TRANSITION PHASE ═══ */}
      {phase === 'transition' && (
        <div className="absolute inset-0">
          <CrossfadePair current={currentSwitch} previous={prevSwitch} />
        </div>
      )}

      {/* ═══ TASK PHASE ═══ */}
      {phase === 'task' && (
        <div
          className="absolute inset-0"
          onClick={handleTaskClick}
          style={{ cursor: 'pointer' }}
        >
          <FadeImage src={currentSwitch} />
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <div
              className="max-w-xl text-center px-8 py-6"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: '12px' }}
            >
              <p
                className="text-fade-in text-sm md:text-base font-sans leading-relaxed"
                style={{ color: '#E9E2D5', lineHeight: 1.8 }}
              >
                {challenge.task}
              </p>
            </div>
            <p
              className="text-fade-in absolute bottom-8 text-xs font-sans"
              style={{ color: 'rgba(233,226,213,0.4)', animationDelay: '0.7s' }}
            >
              点击任意处继续
            </p>
          </div>
        </div>
      )}

      {/* ═══ OPTIONS PHASE ═══ */}
      {phase === 'options' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image src={`/images/${challenge.optionBg}`} alt="" fill className="object-cover" priority />
          </div>
          <div className="relative z-10 flex min-h-screen">
            <div className="flex-1" />
            <div className="w-80 md:w-96 flex flex-col justify-center gap-5 py-16 pr-6">
              {challenge.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className="flex items-start gap-5 rounded-2xl p-6 text-left cursor-pointer transition-all duration-300 hover-lift"
                  style={{
                    opacity: optionVisible > index ? 1 : 0,
                    transform: optionVisible > index ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    transitionDelay: `${index * 300}ms`,
                    backgroundColor: 'rgba(66,55,41,0.85)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    border: '1.5px solid rgba(200,168,120,0.3)',
                  }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ backgroundColor: 'rgba(200,168,120,0.1)', border: '1px solid rgba(200,168,120,0.15)' }}
                  >
                    <span style={{ color: 'rgba(200,168,120,0.6)' }}>
                      {optionIcons[index % 3]}
                    </span>
                  </div>
                  <p className="text-sm font-sans leading-relaxed pt-2" style={{ color: '#E9E2D5' }}>
                    {option.text}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ RESULT PHASE ═══ */}
      {phase === 'result' && (
        <div className="absolute inset-0">
          {/* Step 0: brief pause */}
          {resultStep === 0 && (
            <div className="absolute inset-0" style={{ backgroundColor: '#2E261C' }}>
              <FadeImage src={resultImages[0]} />
            </div>
          )}

          {/* Step 1+: image cycling with title + text overlay */}
          {resultStep >= 1 && (
            <div className="absolute inset-0">
              <div className="absolute inset-0">
                {resultImgIdx < resultImages.length && (
                  <CrossfadePair
                    current={resultImages[resultImgIdx]}
                    previous={prevResult}
                  />
                )}
              </div>

              {/* Title + ending text overlay (persists through all images) */}
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
                }}
              >
                <div className="max-w-2xl text-center">
                  <h2
                    className="font-serif text-3xl md:text-4xl font-bold mb-4"
                    style={{
                      color: finalColor,
                      textShadow: '0 4px 16px rgba(0,0,0,0.7)',
                      animation: 'textFadeIn 800ms ease forwards',
                    }}
                  >
                    {finalTitle}
                  </h2>
                  <p
                    className="text-sm md:text-base font-sans leading-relaxed"
                    style={{
                      color: '#E9E2D5',
                      textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                      lineHeight: 1.8,
                      animation: 'textFadeIn 800ms ease 300ms forwards',
                      opacity: 0,
                    }}
                  >
                    {endingText}
                  </p>
                </div>
              </div>

              {/* "了解" button — only on last image */}
              {resultStep >= 2 && (
                <div
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
                  style={{
                    animation: 'textFadeIn 600ms ease forwards',
                  }}
                >
                  {isCorrect ? (
                    <button onClick={handleUnderstand} className="btn-gold text-base px-10 py-3">
                      了解
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3 items-center">
                      <button onClick={handleUnderstand} className="btn-gold text-base px-10 py-3">
                        了解
                      </button>
                      <button
                        onClick={handleRetry}
                        className="btn-gold text-sm px-8 py-2"
                        style={{ borderColor: '#A85C50', color: '#A85C50' }}
                      >
                        重新挑战
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <style jsx>{`
            @keyframes textFadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

    </div>
  )
}
