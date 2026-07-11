'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { challenges } from '@/data/challenges'
import { eras } from '@/data/eras'
import { useGameState } from '@/lib/gameState'
import { EraId } from '@/types'
import VenueIntroModal from '@/components/VenueIntroModal'
import TimesheetButton from '@/components/TimesheetButton'

export default function ExperiencePage() {
  const router = useRouter()
  const { state } = useGameState()
  const [showIntro, setShowIntro] = useState(true)
  const [doorOpen, setDoorOpen] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* Door opening sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setDoorOpen(true), 200)
    const t2 = setTimeout(() => setShowCards(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleCardClick = (eraId: number) => {
    router.push(`/experience/${eraId}`)
  }

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${doorOpen ? '' : ''}`}
      style={{ backgroundColor: '#2E261C' }}
    >
      {/* ══ Door push flash overlay ══ */}
      {!doorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#0A0806' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full" style={{
              border: '2px solid rgba(200,168,120,0.3)',
              animation: 'flashPulse 0.8s ease-out 3',
            }} />
            <p className="font-serif text-xs tracking-[0.3em]" style={{ color: 'rgba(200,168,120,0.4)' }}>加载中</p>
          </div>
        </div>
      )}

      {doorOpen && (
        <div className="door-push absolute inset-0">
          {/* Background image with higher saturation */}
          <div className="absolute inset-0">
            <Image
              src="/images/3.3 第三版【七大板块选择页面】.png"
              alt=""
              fill
              className="object-cover"
              priority
              style={{ filter: 'saturate(1.3) brightness(0.9)' }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(46,38,28,0.55)' }} />
          </div>
        </div>
      )}

      {/* Content – only visible after door open */}
      {doorOpen && (
        <>
          <div className="fixed top-6 left-6 z-20">
            <button
              onClick={() => router.push('/hub')}
              className="flex items-center gap-2 text-sm tracking-wider cursor-pointer transition-all duration-300 hover:opacity-80"
              style={{ color: '#C8A878', fontFamily: 'var(--font-noto-serif)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#C8A878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              返回
            </button>
          </div>

          <TimesheetButton />

          {/* Title */}
          <div className={`fixed top-16 left-0 right-0 z-10 text-center transition-all duration-800 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest" style={{ color: '#C8A878', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
              光影片场 · 七大时代试炼
            </h1>
            <div className="mx-auto mt-2 flex items-center justify-center gap-3">
              <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.3)' }} />
              <span className="block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: '#C8A878' }} />
              <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.3)' }} />
            </div>
          </div>

          {/* Horizontal scrollable cards area */}
          <div
            ref={scrollRef}
            className="absolute inset-0 z-10 overflow-x-auto overflow-y-hidden"
            style={{ top: '30vh', height: '55vh' }}
          >
            <div className="flex items-center h-full gap-6 px-12" style={{ minWidth: 'max-content' }}>
              {challenges.map((challenge, index) => {
                const era = eras.find(e => e.id === challenge.eraId)
                if (!era) return null
                const isCompleted = !!state.challengeStatus[challenge.eraId as EraId]

                return (
                  <button
                    key={challenge.eraId}
                    onClick={() => handleCardClick(challenge.eraId)}
                    className={`flex-shrink-0 text-left transition-all duration-500 cursor-pointer group hover-lift ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{
                      width: '280px',
                      aspectRatio: '3 / 2',
                      animationDelay: `${index * 0.12}s`,
                      transitionDelay: `${index * 0.1}s`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `1.5px solid ${isCompleted ? 'rgba(200,168,120,0.6)' : 'rgba(200,168,120,0.18)'}`,
                      boxShadow: isCompleted
                        ? '0 4px 24px rgba(200,168,120,0.12), inset 0 0 30px rgba(200,168,120,0.03)'
                        : '0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Card background image */}
                    <div className="absolute inset-0">
                      <Image
                        src={`/images/${challenge.backgroundImages[0]}`}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(46,38,28,0.4) 0%, rgba(46,38,28,0.85) 100%)' }} />
                    </div>

                    {/* Card content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold font-serif"
                          style={{
                            backgroundColor: isCompleted ? 'rgba(200,168,120,0.2)' : 'rgba(200,168,120,0.1)',
                            color: isCompleted ? '#C8A878' : '#B8AFA0',
                            border: `1px solid ${isCompleted ? 'rgba(200,168,120,0.4)' : 'rgba(200,168,120,0.15)'}`,
                          }}
                        >
                          {isCompleted ? '✓' : challenge.eraId}
                        </div>
                        <p className="text-[10px] tracking-wider opacity-70 font-sans" style={{ color: '#C8A878' }}>{era.period}</p>
                      </div>
                      <h3 className="font-serif text-lg font-bold tracking-wider" style={{ color: '#E9E2D5', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>{era.name}</h3>
                      <p className="text-xs mt-1 font-sans" style={{ color: '#B8AFA0', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        代表影片：《{challenge.filmName}》
                      </p>

                      {isCompleted && (
                        <div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: 'rgba(200,168,120,0.2)', color: '#C8A878', backdropFilter: 'blur(4px)' }}>
                          已通关
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scroll hint */}
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-10 text-center transition-all duration-700 ${showCards ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-[10px] tracking-wider font-sans" style={{ color: 'rgba(200,168,120,0.3)' }}>
              ← 左右拖动浏览 →
            </p>
          </div>
        </>
      )}

      {/* Door-push + flash keyframes */}
      <style jsx>{`
        @keyframes flashPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); box-shadow: 0 0 60px rgba(200,168,120,0.6); }
        }
      `}</style>

      {showIntro && (
        <VenueIntroModal venue="experience" onClose={() => setShowIntro(false)} />
      )}
    </div>
  )
}
