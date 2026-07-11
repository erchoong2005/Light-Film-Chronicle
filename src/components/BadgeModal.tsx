'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { eras } from '@/data/eras'
import { useGameState } from '@/lib/gameState'
import { EraId } from '@/types'

const cnNums = ['一','二','三','四','五','六','七']

interface BadgeModalProps {
  eraId: number
  onClose: () => void
}

export default function BadgeModal({ eraId, onClose }: BadgeModalProps) {
  const { state } = useGameState()
  const unlocked = !!state.challengeStatus[eraId as EraId]
  const era = eras.find(e => e.id === eraId)
  const overlayRef = useRef<HTMLDivElement>(null)

  const imgName = `2.${eraId}【成就徽章：板块${cnNums[eraId - 1]}】.png`

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(30,26,20,0.88)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative rounded-2xl p-10 flex flex-col items-center w-[420px]"
        style={{
          backgroundColor: 'rgba(66,55,41,0.95)',
          border: '1.5px solid rgba(200,168,120,0.4)',
          boxShadow: '0 0 60px rgba(200,168,120,0.15)',
          animation: 'modalFadeIn 300ms ease',
        }}
      >
        {/* Badge image */}
        <div
          className="relative w-52 h-52 rounded-full overflow-hidden mb-6"
          style={{
            border: unlocked ? '3px solid rgba(200,168,120,0.7)' : '3px solid rgba(107,99,88,0.3)',
            backgroundColor: 'rgba(46,38,28,0.6)',
            boxShadow: unlocked ? '0 0 40px rgba(200,168,120,0.3)' : 'none',
            filter: unlocked ? 'none' : 'grayscale(1) brightness(0.4)',
          }}
        >
          <Image
            src={`/images/${imgName}`}
            alt={era?.name ?? ''}
            fill
            className="object-contain p-4"
          />
        </div>

        {/* Era info */}
        <p className="font-serif text-lg font-bold text-center" style={{ color: '#C8A878' }}>
          {era?.name}
        </p>
        <p className="text-xs mt-1 mb-3" style={{ color: '#B8AFA0' }}>
          {era?.period}
        </p>

        {unlocked ? (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: 'rgba(109,139,104,0.15)',
              color: '#6D8B68',
              border: '1px solid rgba(109,139,104,0.3)',
            }}
          >
            ✓ 已解锁该时代成就徽章
          </span>
        ) : (
          <span className="text-xs" style={{ color: '#6B6358' }}>
            🔒 完成该时代闯关即可解锁
          </span>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="mt-6 font-serif text-sm transition-all duration-200 hover:scale-105"
          style={{ color: '#C8A878' }}
        >
          关闭
        </button>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
