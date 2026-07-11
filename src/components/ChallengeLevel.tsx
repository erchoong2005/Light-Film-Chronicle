'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { EraId, Challenge } from '@/types'
import { eras } from '@/data/eras'

interface ChallengeLevelProps {
  challenge: Challenge
  onComplete: (eraId: EraId) => void
}

type Phase = 'intro' | 'playing' | 'result'

export default function ChallengeLevel({ challenge, onComplete }: ChallengeLevelProps) {
  const era = eras.find((e) => e.id === challenge.eraId)!

  const [phase, setPhase] = useState<Phase>('intro')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isCorrect = selectedOption !== null
    ? challenge.options.find((o) => o.id === selectedOption)?.isCorrect ?? false
    : false

  const handleStart = () => setPhase('playing')

  const handleSelectOption = useCallback(
    (optionId: number) => {
      if (revealed) return
      setSelectedOption(optionId)
      setRevealed(true)
    },
    [revealed]
  )

  const handleViewResult = () => {
    if (isCorrect) {
      onComplete(challenge.eraId)
    }
    setPhase('result')
  }

  const handleRetry = () => {
    setPhase('intro')
    setSelectedOption(null)
    setRevealed(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ── Intro Phase ── */}
      {phase === 'intro' && (
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#F6F2E9' }}>
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={`/images/${challenge.backgroundImages[0]}`}
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, #F6F2E9)' }} />
          </div>

          <div className="px-8 pb-6 -mt-16 relative z-10">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold mb-2"
              style={{ backgroundColor: '#C8A878', color: '#fff' }}
            >
              {era.period}
            </span>
            <h2 className="font-serif text-2xl font-bold mb-1" style={{ color: '#2C241C' }}>
              板块{challenge.eraId}：{era.name}
            </h2>
            <p className="text-xs font-sans opacity-50 mb-4" style={{ color: '#2C241C' }}>
              代表影片：《{challenge.filmName}》
            </p>

            <div className="rounded-xl p-4 mb-4 text-xs font-sans leading-relaxed" style={{ backgroundColor: '#EBE3D5', color: '#2C241C' }}>
              <p className="font-bold mb-1" style={{ color: '#C8A878' }}>时代背景</p>
              <p className="opacity-80">{challenge.eraIntro}</p>
            </div>

            <div className="rounded-xl p-4 mb-5 text-xs font-sans leading-relaxed" style={{ backgroundColor: '#EBE3D5', color: '#2C241C' }}>
              <p className="font-bold mb-1" style={{ color: '#C8A878' }}>🎬 闯关任务</p>
              <p className="opacity-80">{challenge.task}</p>
            </div>

            <button onClick={handleStart} className="btn-retro w-full text-sm font-serif">
              开始闯关
            </button>
          </div>
        </div>
      )}

      {/* ── Playing Phase ── */}
      {phase === 'playing' && (
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#F6F2E9' }}>
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={`/images/${challenge.backgroundImages[1] || challenge.backgroundImages[0]}`}
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 30%, #F6F2E9)' }} />
          </div>

          <div className="px-8 pb-6 -mt-8 relative z-10">
            <h3 className="font-serif text-lg font-bold mb-4" style={{ color: '#2C241C' }}>
              选择你的拍摄方案
            </h3>

            <div className="space-y-4 mb-5">
              {challenge.options.map((option) => {
                const isSelected = selectedOption === option.id
                const showResult = revealed

                let borderColor = '#C8A87840'
                let bgColor = '#EBE3D5'

                if (showResult) {
                  if (option.isCorrect) {
                    borderColor = '#6D8B68'
                    bgColor = '#6D8B6810'
                  } else if (isSelected && !option.isCorrect) {
                    borderColor = '#A85C50'
                    bgColor = '#A85C5010'
                  }
                } else if (isSelected) {
                  borderColor = '#C8A878'
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className="w-full text-left rounded-2xl p-5 transition-all cursor-pointer relative overflow-hidden border-2"
                    style={{ borderColor, backgroundColor: bgColor }}
                  >
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <Image
                        src={`/images/${challenge.optionBg}`}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative z-10 flex items-start gap-3">
                      <span
                        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: showResult
                            ? option.isCorrect
                              ? '#6D8B68'
                              : isSelected
                                ? '#A85C50'
                                : '#94908840'
                            : isSelected
                              ? '#C8A878'
                              : '#94908840',
                          color: showResult
                            ? option.isCorrect || isSelected
                              ? '#fff'
                              : '#949088'
                            : isSelected
                              ? '#fff'
                              : '#949088',
                        }}
                      >
                        {showResult
                          ? option.isCorrect
                            ? '✓'
                            : isSelected
                              ? '✗'
                              : String.fromCharCode(65 + option.id - 1)
                          : String.fromCharCode(65 + option.id - 1)}
                      </span>
                      <p className="text-sm font-sans leading-relaxed" style={{ color: '#2C241C' }}>
                        {option.text}
                      </p>
                    </div>
                    {showResult && option.isCorrect && (
                      <div className="relative z-10 mt-2 ml-10 text-xs font-bold" style={{ color: '#6D8B68' }}>
                        ✓ 正确方案
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {revealed && (
              <button onClick={handleViewResult} className="btn-retro w-full text-sm font-serif">
                {isCorrect ? '查看通关结果' : '查看失败结果'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Result Phase ── */}
      {phase === 'result' && (
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#F6F2E9' }}>
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={`/images/${isCorrect ? challenge.successImages[0] : challenge.failImages[0]}`}
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, #F6F2E9)' }} />
          </div>

          <div className="px-8 pb-6 -mt-10 relative z-10">
            {isCorrect && challenge.successImages.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {challenge.successImages.slice(1).map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`/images/${img}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {!isCorrect && challenge.failImages.length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {challenge.failImages.slice(1).map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={`/images/${img}`} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{
                  backgroundColor: isCorrect ? '#6D8B68' : '#A85C50',
                  color: '#fff',
                }}
              >
                {isCorrect ? '✓' : '✗'}
              </span>
              <h3 className="font-serif text-xl font-bold" style={{ color: '#2C241C' }}>
                {isCorrect ? '通关成功！' : '挑战失败'}
              </h3>
            </div>

            <div className="rounded-xl p-4 mb-5 text-sm font-sans leading-relaxed" style={{ backgroundColor: '#EBE3D5', color: '#2C241C' }}>
              <p className="opacity-80">
                {isCorrect ? challenge.successEnding : challenge.failEnding}
              </p>
            </div>

            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="btn-retro w-full text-sm font-serif"
                style={{ backgroundColor: '#A85C50' }}
              >
                重新挑战
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
