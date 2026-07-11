'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { collections } from '@/data/collections'
import { useGameState } from '@/lib/gameState'
import { EraId } from '@/types'
import { eras } from '@/data/eras'
import VenueIntroModal from '@/components/VenueIntroModal'
import CollectionUnlockOverlay from '@/components/CollectionUnlockOverlay'
import TimesheetButton from '@/components/TimesheetButton'
import BadgeModal from '@/components/BadgeModal'


export default function CollectionPage() {
  const router = useRouter()
  const { state } = useGameState()
  const [showIntro, setShowIntro] = useState(true)
  const [unlockEraId, setUnlockEraId] = useState<number | null>(null)
  const [detailItem, setDetailItem] = useState<typeof collections[number] | null>(null)
  const [closing, setClosing] = useState(false)
  const [badgeModalId, setBadgeModalId] = useState<number | null>(null)

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setDetailItem(null)
      setClosing(false)
    }, 250)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const unlock = params.get('unlock')
    if (unlock) {
      const id = parseInt(unlock, 10)
      if (!isNaN(id)) setUnlockEraId(id)
    }
  }, [])

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden door-enter"
      style={{
        background: 'linear-gradient(180deg, #2E261C 0%, #1E1A12 40%, #2A2318 100%)',
      }}
    >
      {/* Gold dust ambient particles */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(200,168,120,0.04) 0%, transparent 40%),' +
            'radial-gradient(circle at 85% 35%, rgba(200,168,120,0.03) 0%, transparent 35%),' +
            'radial-gradient(circle at 50% 80%, rgba(200,168,120,0.025) 0%, transparent 45%),' +
            'radial-gradient(circle at 70% 10%, rgba(200,168,120,0.02) 0%, transparent 30%)',
        }}
      />

      {/* Film grain */}
      <div className="pointer-events-none absolute inset-0 film-grain opacity-40" />

      {/* Back button */}
      <button
        onClick={() => router.push('/hub')}
        className="fixed top-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          backgroundColor: 'rgba(66,55,41,0.85)',
          border: '1px solid rgba(200,168,120,0.3)',
          color: '#C8A878',
          fontFamily: 'var(--font-noto-serif)',
          fontSize: '13px',
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-base">←</span>
        <span>返回</span>
      </button>

      <TimesheetButton />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-6 pt-16 pb-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="font-serif text-4xl md:text-5xl font-black tracking-[0.12em]"
            style={{
              color: '#C8A878',
              textShadow: '0 0 30px rgba(200,168,120,0.25), 0 0 60px rgba(200,168,120,0.1)',
            }}
          >
            时代典藏馆
          </h1>
          <p
            className="mt-2 text-sm tracking-[0.2em]"
            style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)' }}
          >
            七大时代限定藏品
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="block h-px w-16" style={{ backgroundColor: 'rgba(200,168,120,0.35)' }} />
            <span className="block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: '#C8A878' }} />
            <span className="block h-px w-16" style={{ backgroundColor: 'rgba(200,168,120,0.35)' }} />
          </div>
          <p
            className="mt-3 text-xs"
            style={{ color: '#B8AFA0', opacity: 0.6 }}
          >
            已收集 {Object.values(state.collectionStatus).filter(Boolean).length}/7 件藏品
          </p>
        </div>

        {/* Horizontal scrollable collection row */}
        <div className="w-full flex-1 flex items-center">
          <div
            className="flex gap-24 overflow-x-auto overflow-y-hidden w-full py-8 scroll-smooth"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#C8A878 rgba(46,38,28,0.5)',
            }}
          >
            {collections.map((item) => {
              const isUnlocked = !!state.collectionStatus[item.eraId as EraId]
              const challengeCompleted = !!state.challengeStatus[item.eraId as EraId]
              const era = eras.find((e) => e.id === item.eraId)

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  {/* Era achievement badge above the collection item */}
                  <button
                    onClick={() => setBadgeModalId(item.eraId)}
                    className="group mb-2 cursor-pointer"
                  >
                    <div
                      className="relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        border: challengeCompleted
                          ? '2px solid rgba(200,168,120,0.5)'
                          : '2px solid rgba(107,99,88,0.2)',
                        backgroundColor: 'rgba(46,38,28,0.6)',
                        filter: challengeCompleted ? 'none' : 'grayscale(1) brightness(0.4)',
                      }}
                    >
                      <Image
                        src={`/images/2.${item.eraId}【成就徽章：板块${['一','二','三','四','五','六','七'][item.eraId - 1]}】.png`}
                        alt={era?.name ?? ''}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                  </button>
                  {/* 3D Showcase Cube */}
                  <button
                    onClick={() => isUnlocked && setDetailItem(item)}
                    className="collection-3d relative rounded-xl overflow-hidden cursor-pointer group"
                    style={{
                      width: 300,
                      height: 300,
                      backgroundColor: 'rgba(66,55,41,0.88)',
                      border: isUnlocked
                        ? '2px solid rgba(200,168,120,0.5)'
                        : '2px solid rgba(107,99,88,0.3)',
                      boxShadow: isUnlocked
                        ? '0 4px 24px rgba(200,168,120,0.12), inset 0 0 40px rgba(200,168,120,0.03)'
                        : '0 2px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Era number label */}
                    <div
                      className="absolute top-4 left-4 z-20 rounded-full px-3 py-1"
                      style={{
                        backgroundColor: isUnlocked
                          ? 'rgba(200,168,120,0.2)'
                          : 'rgba(107,99,88,0.2)',
                        color: isUnlocked ? '#C8A878' : '#6B6358',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-noto-serif)',
                        border: `1px solid ${isUnlocked ? 'rgba(200,168,120,0.3)' : 'rgba(107,99,88,0.2)'}`,
                      }}
                    >
                      {era?.name}
                    </div>

                    {/* Image */}
                    <div
                      className="absolute inset-0 flex items-center justify-center p-5"
                      style={{
                        filter: isUnlocked ? 'none' : 'grayscale(1)',
                        opacity: isUnlocked ? 1 : 0.35,
                      }}
                    >
                      <Image
                        src={`/images/${item.image}`}
                        alt={item.name}
                        width={240}
                        height={240}
                        className="object-contain"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </div>

                    {/* Gold glow for unlocked */}
                    {isUnlocked && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'radial-gradient(ellipse at center, rgba(200,168,120,0.06) 0%, transparent 70%)',
                        }}
                      />
                    )}

                    {/* Lock overlay for locked items */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div
                          className="mb-4 flex items-center justify-center w-20 h-20 rounded-full"
                          style={{
                            backgroundColor: 'rgba(46,38,28,0.7)',
                            border: '1px solid rgba(107,99,88,0.3)',
                          }}
                        >
                          <span className="text-3xl" style={{ filter: 'grayscale(0.3)' }}>🔒</span>
                        </div>
                        <span
                          className="font-serif text-base font-bold tracking-wider"
                          style={{ color: '#6B6358' }}
                        >
                          未解锁
                        </span>
                      </div>
                    )}

                    {/* Corner decorations */}
                    {isUnlocked && (
                      <>
                        <div
                          className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                          style={{
                            borderLeft: '2px solid rgba(200,168,120,0.4)',
                            borderTop: '2px solid rgba(200,168,120,0.4)',
                          }}
                        />
                        <div
                          className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
                          style={{
                            borderRight: '2px solid rgba(200,168,120,0.4)',
                            borderBottom: '2px solid rgba(200,168,120,0.4)',
                          }}
                        />
                      </>
                    )}
                  </button>

                  {/* Collection name */}
                  <p
                    className="mt-5 font-serif text-base font-bold text-center max-w-[300px] leading-snug"
                    style={{
                      color: isUnlocked ? '#C8A878' : '#6B6358',
                      textShadow: isUnlocked ? '0 0 12px rgba(200,168,120,0.15)' : 'none',
                    }}
                  >
                    {item.name}
                  </p>
                </div>
              )
            })}
            {/* Right spacer for extended scroll */}
            <div className="flex-shrink-0 w-40" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-auto pt-4">
          <p
            className="text-xs tracking-wider animate-pulse"
            style={{ color: 'rgba(200,168,120,0.35)' }}
          >
            ← 左右滑动浏览藏品 →
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div
          className={`modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 ${
            closing ? 'closing' : ''
          }`}
          style={{ backgroundColor: 'rgba(30,26,18,0.85)' }}
          onClick={handleClose}
        >
          <div
            className={`modal-content relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ${
              closing ? 'closing' : ''
            }`}
            style={{
              backgroundColor: 'rgba(66,55,41,0.95)',
              border: '1px solid rgba(200,168,120,0.3)',
              boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 30px rgba(200,168,120,0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Corner decorations */}
            <div
              className="absolute left-0 top-0 h-10 w-10 pointer-events-none"
              style={{
                borderLeft: '2px solid rgba(200,168,120,0.4)',
                borderTop: '2px solid rgba(200,168,120,0.4)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 h-10 w-10 pointer-events-none"
              style={{
                borderRight: '2px solid rgba(200,168,120,0.4)',
                borderBottom: '2px solid rgba(200,168,120,0.4)',
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 cursor-pointer"
              style={{
                backgroundColor: 'rgba(46,38,28,0.8)',
                color: '#C8A878',
                border: '1px solid rgba(200,168,120,0.3)',
              }}
            >
              ✕
            </button>

            {/* Image section */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={`/images/${detailItem.image}`}
                alt={detailItem.name}
                fill
                className="object-contain p-6"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(transparent 50%, rgba(66,55,41,0.95))',
                }}
              />
              {/* Era tag */}
              <div
                className="absolute bottom-4 left-5 z-10 rounded-full px-3 py-1"
                style={{
                  backgroundColor: 'rgba(200,168,120,0.15)',
                  border: '1px solid rgba(200,168,120,0.3)',
                  color: '#C8A878',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-noto-serif)',
                }}
              >
                {eras.find((e) => e.id === detailItem.eraId)?.name} · {eras.find((e) => e.id === detailItem.eraId)?.period}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-2">
              <h2
                className="font-serif text-xl font-bold mb-4"
                style={{
                  color: '#C8A878',
                  textShadow: '0 0 15px rgba(200,168,120,0.2)',
                }}
              >
                {detailItem.name}
              </h2>

              <div className="space-y-3">
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(46,38,28,0.6)' }}
                >
                  <p
                    className="font-serif text-xs font-bold mb-2 tracking-wider"
                    style={{ color: '#C8A878' }}
                  >
                    藏品介绍
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: '#E9E2D5',
                      fontFamily: 'var(--font-noto-sans)',
                      fontWeight: 300,
                    }}
                  >
                    {detailItem.description}
                  </p>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(46,38,28,0.6)' }}
                >
                  <p
                    className="font-serif text-xs font-bold mb-2 tracking-wider"
                    style={{ color: '#C8A878' }}
                  >
                    解锁用途
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: '#B8AFA0',
                      fontFamily: 'var(--font-noto-sans)',
                      fontWeight: 300,
                    }}
                  >
                    {detailItem.usage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .closing {
          animation: fadeOut 250ms ease-in both;
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(46,38,28,0.5);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(200,168,120,0.4);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(200,168,120,0.6);
        }
      `}</style>

      {showIntro && (
        <VenueIntroModal venue="collection" onClose={() => setShowIntro(false)} />
      )}

      {unlockEraId && (
        <CollectionUnlockOverlay
          eraId={unlockEraId}
          onComplete={() => setUnlockEraId(null)}
        />
      )}

      {badgeModalId !== null && (
        <BadgeModal eraId={badgeModalId} onClose={() => setBadgeModalId(null)} />
      )}
    </div>
  )
}
