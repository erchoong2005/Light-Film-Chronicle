'use client'

import { Era, Challenge, EraId } from '@/types'

interface ExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  eras: Era[]
  challenges: Challenge[]
  challengeStatus: Record<EraId, boolean>
  onStartChallenge: (challenge: Challenge) => void
}

export default function ExperienceModal({
  isOpen,
  onClose,
  eras,
  challenges,
  challengeStatus,
  onStartChallenge,
}: ExperienceModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(44,36,28,0.5)' }}>
      <div className="modal-content w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#F6F2E9' }}>
        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between" style={{ backgroundColor: '#EBE3D5' }}>
          <div>
            <h2 className="font-serif text-xl font-bold" style={{ color: '#2C241C' }}>
              🎬 体验馆 · 时代闯关
            </h2>
            <p className="text-xs font-sans opacity-50 mt-1" style={{ color: '#2C241C' }}>
              选择一个时代，扮演片场角色完成拍摄挑战任务
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: '#2C241C' }}
          >
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {challenges.map((challenge) => {
              const era = eras.find((e) => e.id === challenge.eraId)
              if (!era) return null
              const isCompleted = !!challengeStatus[challenge.eraId]

              return (
                <button
                  key={challenge.eraId}
                  onClick={() => onStartChallenge(challenge)}
                  className="card-hover group relative rounded-2xl overflow-hidden text-left cursor-pointer border-2 transition-all"
                  style={{
                    backgroundColor: '#EBE3D5',
                    borderColor: isCompleted ? '#C8A878' : 'transparent',
                  }}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                        style={{ backgroundColor: '#6D8B6820', color: '#6D8B68' }}
                      >
                        ✓ 已通关
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-3"
                      style={{
                        backgroundColor: isCompleted ? '#C8A878' : '#94908840',
                        color: isCompleted ? '#fff' : '#949088',
                      }}
                    >
                      {challenge.eraId}
                    </div>

                    <p className="text-xs font-sans opacity-50 mb-1" style={{ color: '#2C241C' }}>
                      {era.period}
                    </p>
                    <h3 className="font-serif text-base font-bold mb-1" style={{ color: '#2C241C' }}>
                      {era.name}
                    </h3>
                    <div className="film-strip w-8 my-2" />
                    <p className="text-xs font-sans opacity-60" style={{ color: '#2C241C' }}>
                      代表影片：《{challenge.filmName}》
                    </p>

                    <div className="mt-4 text-xs font-serif font-bold opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: '#C8A878' }}>
                      {isCompleted ? '再次挑战 →' : '进入闯关 →'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
