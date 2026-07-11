'use client'

import Image from 'next/image'
import { GameState, EraId } from '@/types'

interface TimesheetModalProps {
  isOpen: boolean
  onClose: () => void
  state: GameState
  getEraProgress: (eraId: EraId) => { total: number; readCount: number; quizCount: number }
}

const badgeNames: Record<number, string> = {
  1: '影迷见习',
  2: '光影学徒',
  3: '银幕探索者',
  4: '胶片收藏家',
  5: '时代记录者',
  6: '百年光影大师',
}

const eraLabels: { id: EraId; name: string; period: string }[] = [
  { id: 1, name: '萌芽初创期', period: '1905-1949' },
  { id: 2, name: '十七年国营', period: '1949-1966' },
  { id: 3, name: '产业停滞恢复', period: '1967-1978' },
  { id: 4, name: '第五代黄金', period: '1979-1999' },
  { id: 5, name: '商业贺岁片', period: '2000-2010' },
  { id: 6, name: '工业化科幻', period: '2011-2018' },
  { id: 7, name: '全媒体新时代', period: '2019至今' },
]

export default function TimesheetModal({
  isOpen,
  onClose,
  state,
  getEraProgress,
}: TimesheetModalProps) {
  if (!isOpen) return null

  const readCount = Object.values(state.filmReadStatus).filter(Boolean).length
  const quizCount = Object.values(state.filmQuizStatus).filter(Boolean).length
  const challengeCount = Object.values(state.challengeStatus).filter(Boolean).length
  const collectionCount = Object.values(state.collectionStatus).filter(Boolean).length

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(44,36,28,0.6)' }}>
      <div
        className="modal-content w-full max-w-lg max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl"
        style={{ backgroundColor: '#F6F2E9' }}
      >
        {/* Title */}
        <div className="text-center px-8 pt-8 pb-4" style={{ borderBottom: '2px solid #C8A87830' }}>
          <h1 className="font-serif text-2xl font-black tracking-wider" style={{ color: '#2C241C' }}>
            百年光影研学场记单
          </h1>
          <p className="font-sans text-xs opacity-40 mt-1" style={{ color: '#2C241C' }}>
            Light &amp; Shadow Heritage Timesheet
          </p>
          <div className="film-strip mx-auto w-32 mt-3" />
        </div>

        {/* Badge section */}
        <div className="px-8 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid #C8A87820' }}>
          <div
            className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2"
            style={{ borderColor: '#C8A878', backgroundColor: '#EBE3D5' }}
          >
            <Image
              src={`/images/1.${state.badgeLevel}【身份铭牌${state.badgeLevel}】.png`}
              alt={badgeNames[state.badgeLevel]}
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="font-sans text-[11px] opacity-50" style={{ color: '#2C241C' }}>
              当前身份
            </p>
            <p className="font-serif text-lg font-bold" style={{ color: '#2C241C' }}>
              {badgeNames[state.badgeLevel]}
            </p>
            <div className="flex gap-3 mt-1 text-[11px] font-sans" style={{ color: '#2C241C' }}>
              <span>阅 {readCount}/34</span>
              <span className="opacity-30">·</span>
              <span>答 {quizCount}/34</span>
              <span className="opacity-30">·</span>
              <span>闯 {challengeCount}/7</span>
            </div>
          </div>
        </div>

        {/* Era progress grid */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid #C8A87820' }}>
          <h3 className="font-serif text-sm font-bold mb-4" style={{ color: '#2C241C' }}>
            七大时代闯关进度
          </h3>

          <div className="grid grid-cols-4 gap-3 mb-3">
            {eraLabels.slice(0, 4).map((era) => (
              <EraStamp key={era.id} era={era} completed={!!state.challengeStatus[era.id]} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {eraLabels.slice(4).map((era) => (
              <EraStamp key={era.id} era={era} completed={!!state.challengeStatus[era.id]} />
            ))}
          </div>
        </div>

        {/* Era detail progress */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid #C8A87820' }}>
          <h3 className="font-serif text-sm font-bold mb-3" style={{ color: '#2C241C' }}>
            各时代研学详情
          </h3>
          <div className="space-y-2">
            {eraLabels.map((era) => {
              const progress = getEraProgress(era.id)
              return (
                <div
                  key={era.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-sans"
                  style={{ backgroundColor: '#EBE3D5', color: '#2C241C' }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    style={{
                      backgroundColor: state.challengeStatus[era.id] ? '#C8A878' : '#94908840',
                      color: state.challengeStatus[era.id] ? '#fff' : '#949088',
                    }}
                  >
                    {era.id}
                  </span>
                  <span className="font-serif font-bold flex-shrink-0 w-20 truncate">{era.name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="opacity-50">阅{progress.readCount}/{progress.total}</span>
                    <span className="opacity-30">·</span>
                    <span className="opacity-50">答{progress.quizCount}/{progress.total}</span>
                  </div>
                  {state.challengeStatus[era.id] && (
                    <span className="text-[10px] font-bold" style={{ color: '#6D8B68' }}>✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Collection progress */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid #C8A87820' }}>
          <h3 className="font-serif text-sm font-bold mb-3" style={{ color: '#2C241C' }}>
            藏品收集进度
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {eraLabels.map((era) => {
              const unlocked = !!state.collectionStatus[era.id]
              return (
                <div
                  key={era.id}
                  className="flex-1 h-3 rounded-full transition-colors"
                  style={{ backgroundColor: unlocked ? '#C8A878' : '#94908830' }}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[11px] font-sans" style={{ color: '#2C241C' }}>
            <span className="opacity-50">已收集 {collectionCount}/7 件藏品</span>
            <span className="opacity-50">
              {collectionCount === 7 ? '全部集齐！' : `还差 ${7 - collectionCount} 件`}
            </span>
          </div>
        </div>

        {/* Stats summary */}
        <div className="px-8 py-5" style={{ borderBottom: '1px solid #C8A87820' }}>
          <h3 className="font-serif text-sm font-bold mb-3" style={{ color: '#2C241C' }}>
            学习数据统计
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatBox label="影片阅览" value={readCount} total={34} />
            <StatBox label="知识答题" value={quizCount} total={34} />
            <StatBox label="时代闯关" value={challengeCount} total={7} />
            <StatBox label="藏品收集" value={collectionCount} total={7} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 text-center">
          <p className="text-[11px] font-sans opacity-30" style={{ color: '#2C241C' }}>
            光影纪年 · 中国电影发展史研学平台
          </p>
          <button
            onClick={onClose}
            className="btn-retro mt-4 w-full text-sm font-serif py-2.5"
          >
            关闭场记单
          </button>
        </div>
      </div>
    </div>
  )
}

function EraStamp({
  era,
  completed,
}: {
  era: { id: number; name: string; period: string }
  completed: boolean
}) {
  return (
    <div
      className="relative rounded-xl p-3 text-center overflow-hidden"
      style={{ backgroundColor: '#EBE3D5' }}
    >
      <p className="text-[10px] font-sans opacity-50" style={{ color: '#2C241C' }}>
        {era.period}
      </p>
      <p className="font-serif text-xs font-bold mt-0.5" style={{ color: '#2C241C' }}>
        {era.name}
      </p>

      {completed ? (
        <div
          className="mt-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: '#6D8B6820', color: '#6D8B68' }}
        >
          ✓ 已通关
        </div>
      ) : (
        <div
          className="mt-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: '#94908820', color: '#949088' }}
        >
          待挑战
        </div>
      )}

      {completed && (
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
          style={{
            backgroundColor: '#6D8B68',
            color: '#fff',
            transform: 'rotate(12deg)',
          }}
        >
          ✓
        </div>
      )}
    </div>
  )
}

function StatBox({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: '#EBE3D5' }}>
      <p className="text-[11px] font-sans opacity-50 mb-1" style={{ color: '#2C241C' }}>
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="font-serif text-lg font-bold" style={{ color: '#2C241C' }}>
          {value}
        </span>
        <span className="text-xs opacity-40" style={{ color: '#2C241C' }}>
          / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: '#94908820' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 100 ? '#6D8B68' : '#C8A878',
          }}
        />
      </div>
    </div>
  )
}
