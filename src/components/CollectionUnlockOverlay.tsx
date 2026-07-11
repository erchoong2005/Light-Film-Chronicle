'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { collections } from '@/data/collections'
import { eras } from '@/data/eras'

export default function CollectionUnlockOverlay({
  eraId,
  onComplete,
}: {
  eraId: number
  onComplete: () => void
}) {
  const router = useRouter()
  const [phase, setPhase] = useState(0)
  const item = collections.find((c) => c.eraId === eraId)
  const era = eras.find((e) => e.id === eraId)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
      setTimeout(() => setPhase(5), 2200),
      setTimeout(() => setPhase(6), 2600),
      setTimeout(() => setPhase(7), 3200),
      setTimeout(() => setPhase(8), 3800),
      setTimeout(() => setPhase(9), 4400),
      setTimeout(() => setPhase(10), 5000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  if (!item || !era) return null

  const handleDone = () => {
    onComplete()
    router.replace('/collection')
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
      {/* Lock animation phase */}
      {phase >= 1 && phase < 4 && (
        <div className="flex flex-col items-center">
          <div className="lock-enter">
            <div
              className={`flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full ${phase >= 2 ? 'lock-shake' : ''}`}
              style={{
                backgroundColor: 'rgba(46,38,28,0.7)',
                border: `2px solid ${phase >= 3 ? 'rgba(107,168,120,0.6)' : 'rgba(200,168,120,0.4)'}`,
                transition: 'border-color 500ms ease, box-shadow 500ms ease',
                boxShadow: phase >= 3 ? '0 0 40px rgba(200,168,120,0.3)' : '0 0 20px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="text-5xl md:text-6xl"
                style={{
                  transition: 'all 500ms ease',
                  transform: phase >= 3 ? 'scale(1.1)' : 'scale(1)',
                  filter: phase >= 3 ? 'none' : 'grayscale(0.3)',
                }}
              >
                {phase >= 3 ? '🔓' : '🔒'}
              </span>
            </div>
          </div>
          {phase >= 2 && (
            <p
              className="lock-text-fade text-center mt-6 font-serif text-lg font-bold tracking-wider"
              style={{ color: '#C8A878' }}
            >
              {phase >= 3 ? '藏品已解锁' : '正在解锁藏品...'}
            </p>
          )}
        </div>
      )}

      {/* Original unlock animation phase (shifted) */}
      {phase >= 4 && (
        <div className="flex flex-col items-center">
          <div className={`badge-float-wrapper ${phase >= 4 && phase < 5 ? 'lock-fade-out' : ''}`}>
            <div className={phase >= 7 ? 'badge-spin' : ''}>
              <div
                className="relative w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden border-2"
                style={{
                  borderColor: 'rgba(200,168,120,0.6)',
                  boxShadow: '0 0 40px rgba(200,168,120,0.3)',
                  filter: phase < 6 ? 'grayscale(1) brightness(0.5)' : 'grayscale(0) brightness(1)',
                  transition: 'filter 500ms ease',
                }}
              >
                <Image
                  src={`/images/${item.image}`}
                  alt={item.name}
                  fill
                  className="object-contain p-4"
                />
                {phase < 6 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-4xl"
                      style={{ opacity: phase >= 5 ? 1 : 0, transition: 'opacity 300ms ease' }}
                    >
                      🔒
                    </span>
                  </div>
                )}
                {phase >= 7 && (
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

          {phase >= 9 && (
            <p
              className="text-fade-in text-center mt-8 font-serif text-xl md:text-2xl font-bold"
              style={{ color: '#C8A878', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              解锁【{item.name}】
            </p>
          )}

          {phase >= 10 && (
            <div className="text-fade-in flex flex-col gap-3 mt-6">
              <button onClick={handleDone} className="btn-gold text-sm px-8 py-3">
                前往藏品馆
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .lock-enter {
          animation: lockFadeIn 500ms ease-out forwards;
        }
        @keyframes lockFadeIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        .lock-shake {
          animation: lockShake 500ms ease-in-out;
        }
        @keyframes lockShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px) rotate(-3deg); }
          30% { transform: translateX(5px) rotate(2deg); }
          45% { transform: translateX(-4px) rotate(-2deg); }
          60% { transform: translateX(3px) rotate(1deg); }
          75% { transform: translateX(-2px); }
        }
        .lock-text-fade {
          animation: textFadeIn 400ms ease-out forwards;
        }
        .lock-fade-out {
          animation: lockFadeOut 400ms ease-in forwards;
        }
        @keyframes lockFadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }
        .badge-float-wrapper {
          animation: badgeFloatUp 800ms ease-out forwards;
        }
        @keyframes badgeFloatUp {
          from { opacity: 0; transform: translateY(30px) scale(0.85); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes badgeSpin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .badge-spin {
          animation: badgeSpin 600ms ease-out forwards;
        }
        .text-fade-in {
          animation: textFadeIn 500ms ease-out forwards;
        }
        @keyframes textFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .badge-sweep-anim {
          animation: goldSweep 800ms ease-in-out forwards;
        }
        @keyframes goldSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
