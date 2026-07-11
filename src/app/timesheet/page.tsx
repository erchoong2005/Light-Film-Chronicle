'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useGameState } from '@/lib/gameState'
import { films } from '@/data/films'
import { eras } from '@/data/eras'
import { collections } from '@/data/collections'
import { EraId } from '@/types'

const badgeNames: Record<number, string> = {
  1: '影迷见习',
  2: '光影学徒',
  3: '银幕探索者',
  4: '胶片收藏家',
  5: '时代记录者',
  6: '百年光影大师',
}

const eraFilmMap: Record<EraId, number[]> = {
  1: [1, 2, 3, 4, 5],
  2: [6, 7, 8, 9],
  3: [10, 11, 12, 13, 14],
  4: [15, 16, 17, 18, 19],
  5: [20, 21, 22, 23, 24],
  6: [25, 26, 27, 28, 29],
  7: [30, 31, 32, 33, 34],
}

export default function TimesheetPage() {
  const router = useRouter()
  const { state, getEraProgress } = useGameState()

  const readCount = Object.values(state.filmReadStatus).filter(Boolean).length
  const quizCount = Object.values(state.filmQuizStatus).filter(Boolean).length
  const challengeCount = Object.values(state.challengeStatus).filter(Boolean).length
  const collectionCount = Object.values(state.collectionStatus).filter(Boolean).length

  return (
    <div
      className="relative min-h-screen w-full page-enter"
      style={{
        background:
          'linear-gradient(180deg, #2E261C 0%, #251F15 30%, #2A2318 60%, #2E261C 100%)',
      }}
    >
      {/* Aged paper texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 15%, rgba(200,168,120,0.035) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 80% 25%, rgba(200,168,120,0.025) 0%, transparent 45%),' +
            'radial-gradient(ellipse at 50% 70%, rgba(200,168,120,0.02) 0%, transparent 40%),' +
            'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(200,168,120,0.012) 80px, rgba(200,168,120,0.012) 81px)',
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

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-16">
        {/* ═══════════════════════════════════════
           SECTION 1: HEADER
           ═══════════════════════════════════════ */}
        <div className="text-center mb-8">
          <h1
            className="font-serif text-3xl md:text-4xl font-black tracking-[0.1em]"
            style={{
              color: '#C8A878',
              textShadow: '0 0 30px rgba(200,168,120,0.25), 0 0 60px rgba(200,168,120,0.1)',
            }}
          >
            百年光影研学场记单
          </h1>
          <p
            className="mt-2 text-sm tracking-[0.15em]"
            style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)', fontWeight: 300 }}
          >
            中国电影七大时代片场试炼档案
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="block h-px w-20" style={{ backgroundColor: 'rgba(200,168,120,0.35)' }} />
            <span className="block h-1.5 w-1.5 rotate-45" style={{ backgroundColor: '#C8A878' }} />
            <span className="block h-px w-20" style={{ backgroundColor: 'rgba(200,168,120,0.35)' }} />
          </div>
          <p className="mt-2 text-xs" style={{ color: 'rgba(200,168,120,0.4)' }}>
            Light &amp; Shadow Heritage Timesheet
          </p>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION 2: IDENTITY BADGE (enlarged)
           ═══════════════════════════════════════ */}
        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            backgroundColor: 'rgba(66,55,41,0.7)',
            border: '1.5px solid rgba(200,168,120,0.3)',
            boxShadow: '0 0 40px rgba(200,168,120,0.06)',
          }}
        >
          <div className="flex items-center gap-8">
            {/* Badge image - rectangular gold frame */}
            <div
              className="flex-shrink-0"
              style={{
                border: '3px solid rgba(200,168,120,0.6)',
                borderRadius: '4px',
                backgroundColor: 'rgba(46,38,28,0.8)',
                boxShadow: '0 0 30px rgba(200,168,120,0.25), 0 0 60px rgba(200,168,120,0.1)',
                lineHeight: 0,
              }}
            >
              <Image
                src={`/images/1.${state.badgeLevel}【身份铭牌${state.badgeLevel}】.png`}
                alt={badgeNames[state.badgeLevel]}
                width={300}
                height={120}
                className="block"
                style={{ height: '120px', width: 'auto' }}
              />
            </div>

            {/* Badge info - enlarged */}
            <div className="flex-1">
              <p
                className="text-sm tracking-wider mb-1"
                style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)' }}
              >
                当前段位
              </p>
              <p
                className="font-serif text-3xl font-bold mb-2"
                style={{
                  color: '#C8A878',
                  textShadow: '0 0 20px rgba(200,168,120,0.3)',
                }}
              >
                {badgeNames[state.badgeLevel]}
              </p>
              <div
                className="flex flex-wrap gap-x-8 gap-y-2 mt-3"
                style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)' }}
              >
                <span className="text-sm">
                  阅片 <span style={{ color: '#C8A878', fontWeight: 700, fontSize: '18px' }}>{readCount}</span>/34
                </span>
                <span className="text-sm">
                  答题 <span style={{ color: '#C8A878', fontWeight: 700, fontSize: '18px' }}>{quizCount}</span>/34
                </span>
                <span className="text-sm">
                  闯关 <span style={{ color: '#C8A878', fontWeight: 700, fontSize: '18px' }}>{challengeCount}</span>/7
                </span>
                <span className="text-sm">
                  藏品 <span style={{ color: '#C8A878', fontWeight: 700, fontSize: '18px' }}>{collectionCount}</span>/7
                </span>
              </div>
            </div>

            {/* Badge level indicator - enlarged */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
              {[6, 5, 4, 3, 2, 1].map((lvl) => (
                <div
                  key={lvl}
                  className="w-4 h-4 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      lvl <= state.badgeLevel
                        ? '#C8A878'
                        : 'rgba(107,99,88,0.2)',
                    boxShadow:
                      lvl <= state.badgeLevel
                        ? '0 0 8px rgba(200,168,120,0.5)'
                        : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION: ACHIEVEMENT BADGE BOARD
           ═══════════════════════════════════════ */}
        <div className="mb-8">
          <h2
            className="font-serif text-lg font-bold mb-5 tracking-wider"
            style={{ color: '#C8A878' }}
          >
            时代成就徽章墙
          </h2>

          {/* Pinboard */}
          <div
            className="relative rounded-2xl p-7 overflow-hidden"
            style={{
              backgroundColor: 'rgba(50,40,30,0.9)',
              border: '3px solid rgba(90,76,58,0.7)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.4)',
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(200,168,120,0.025) 28px, rgba(200,168,120,0.025) 29px),
                repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(0,0,0,0.04) 36px, rgba(0,0,0,0.04) 37px)
              `,
            }}
          >
            {/* Subtle cork texture dots */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08]" style={{
              backgroundImage: 'radial-gradient(circle at 30% 40%, #C8A878 0.5px, transparent 0.5px)',
              backgroundSize: '12px 12px',
            }} />

            <div className="relative z-10 flex flex-wrap justify-center gap-x-7 gap-y-6">
              {eras.map((era) => {
                const unlocked = !!state.challengeStatus[era.id]
                const cnNum = ['一','二','三','四','五','六','七'][era.id - 1]
                const imgName = `2.${era.id}【成就徽章：板块${cnNum}】.png`

                return (
                  <div key={era.id} className="flex flex-col items-center relative pt-3"
                  >
                    {/* Pushpin */}
                    <div
                      className="absolute top-0 z-10 w-3.5 h-3.5 rounded-full"
                      style={{
                        backgroundColor: unlocked ? '#C8A878' : '#6B6358',
                        boxShadow: unlocked
                          ? '0 0 8px rgba(200,168,120,0.5), inset 0 -1px 2px rgba(0,0,0,0.3)'
                          : 'inset 0 -1px 2px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(0,0,0,0.25)',
                      }}
                    >
                      <div
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2"
                        style={{
                          backgroundColor: unlocked ? 'rgba(200,168,120,0.4)' : 'rgba(107,99,88,0.3)',
                          transform: 'rotate(-15deg)',
                        }}
                      />
                    </div>

                    {/* Badge image */}
                    <div
                      className="relative w-[72px] h-[72px] rounded-full overflow-hidden transition-all duration-500"
                      style={{
                        border: unlocked
                          ? '2.5px solid rgba(200,168,120,0.6)'
                          : '2.5px solid rgba(107,99,88,0.2)',
                        backgroundColor: unlocked ? 'rgba(66,55,41,0.7)' : 'rgba(46,38,28,0.5)',
                        boxShadow: unlocked
                          ? '0 0 24px rgba(200,168,120,0.2)'
                          : 'none',
                        filter: unlocked ? 'none' : 'grayscale(1) brightness(0.35)',
                      }}
                    >
                      <Image
                        src={`/images/${imgName}`}
                        alt={era.name}
                        fill
                        className="object-contain p-1.5"
                      />
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="text-lg opacity-50">🔒</span>
                        </div>
                      )}
                    </div>

                    {/* Era name */}
                    <p
                      className="mt-2 text-[11px] font-serif text-center leading-tight max-w-[80px]"
                      style={{ color: unlocked ? '#C8A878' : '#6B6358' }}
                    >
                      {era.name}
                    </p>

                    {unlocked && (
                      <span
                        className="mt-1 text-[8px] px-1.5 py-0.5 rounded font-bold"
                        style={{
                          backgroundColor: 'rgba(109,139,104,0.15)',
                          color: '#6D8B68',
                          border: '1px solid rgba(109,139,104,0.2)',
                        }}
                      >
                        ✓ 已解锁
                      </span>
                    )}
                    {!unlocked && (
                      <span
                        className="mt-1 text-[8px] px-1.5 py-0.5 rounded font-bold"
                        style={{ color: '#4A4438' }}
                      >
                        待挑战
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION 3: ERA PROGRESS GRID
           ═══════════════════════════════════════ */}
        <div className="mb-8">
          <h2
            className="font-serif text-lg font-bold mb-5 tracking-wider"
            style={{ color: '#C8A878' }}
          >
            七大时代闯关进度
          </h2>

          {/* Top row: 4 eras */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            {eras.slice(0, 4).map((era) => {
              const completed = !!state.challengeStatus[era.id]
              const mainFilm = films.find(
                (f) => eraFilmMap[era.id]?.includes(f.id) && f.isMain
              )
              return (
                <EraCard
                  key={era.id}
                  era={era}
                  completed={completed}
                  mainFilmName={mainFilm?.name}
                />
              )
            })}
          </div>

          {/* Bottom row: 3 eras */}
          <div className="grid grid-cols-3 gap-3">
            {eras.slice(4).map((era) => {
              const completed = !!state.challengeStatus[era.id]
              const mainFilm = films.find(
                (f) => eraFilmMap[era.id]?.includes(f.id) && f.isMain
              )
              return (
                <EraCard
                  key={era.id}
                  era={era}
                  completed={completed}
                  mainFilmName={mainFilm?.name}
                />
              )
            })}
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION 4: COLLECTION PROGRESS
           ═══════════════════════════════════════ */}
        <div className="mb-8">
          <h2
            className="font-serif text-lg font-bold mb-5 tracking-wider"
            style={{ color: '#C8A878' }}
          >
            藏品收集进度
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-2">
            {collections.map((item) => {
              const isUnlocked = !!state.collectionStatus[item.eraId as EraId]
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div
                    className="relative w-32 h-32 rounded-lg overflow-hidden"
                    style={{
                      border: isUnlocked
                        ? '2px solid rgba(200,168,120,0.5)'
                        : '2px solid rgba(107,99,88,0.2)',
                      backgroundColor: isUnlocked
                        ? 'rgba(66,55,41,0.88)'
                        : 'rgba(46,38,28,0.6)',
                      filter: isUnlocked ? 'none' : 'grayscale(1) brightness(0.5)',
                    }}
                  >
                    <Image
                      src={`/images/${item.image}`}
                      alt={item.name}
                      fill
                      className="object-contain p-3"
                    />
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl opacity-50">🔒</span>
                      </div>
                    )}
                  </div>
                  <p
                    className="mt-2.5 text-sm text-center font-serif max-w-[128px] leading-tight"
                    style={{
                      color: isUnlocked ? '#C8A878' : '#6B6358',
                    }}
                  >
                    {item.name}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(107,99,88,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(collectionCount / 7) * 100}%`,
                  background: 'linear-gradient(90deg, rgba(200,168,120,0.6), #C8A878)',
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: '#B8AFA0' }}>
              <span>
                已收集 <span style={{ color: '#C8A878', fontWeight: 700 }}>{collectionCount}</span>/7 件
              </span>
              <span>
                {collectionCount === 7
                  ? '全部集齐！'
                  : `还差 ${7 - collectionCount} 件`}
              </span>
            </div>
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION 5: ERA DETAIL PROGRESS
           ═══════════════════════════════════════ */}
        <div className="mb-8">
          <h2
            className="font-serif text-lg font-bold mb-5 tracking-wider"
            style={{ color: '#C8A878' }}
          >
            各时代研学详情
          </h2>

          <div className="space-y-3">
            {eras.map((era) => {
              const progress = getEraProgress(era.id)
              const completed = !!state.challengeStatus[era.id]
              const eraFilmIds = eraFilmMap[era.id] || []
              const eraFilms = films.filter((f) => eraFilmIds.includes(f.id))
              const readInEra = eraFilms.filter((f) => state.filmReadStatus[f.id]).length
              const quizInEra = eraFilms.filter((f) => state.filmQuizStatus[f.id]).length
              const pct = progress.total > 0 ? ((readInEra + quizInEra) / (progress.total * 2)) * 100 : 0

              return (
                <div
                  key={era.id}
                  className="rounded-xl p-4 transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(66,55,41,0.5)',
                    border: completed
                      ? '1px solid rgba(200,168,120,0.3)'
                      : '1px solid rgba(107,99,88,0.15)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: completed ? '#C8A878' : 'rgba(107,99,88,0.2)',
                        color: completed ? '#2E261C' : '#6B6358',
                      }}
                    >
                      {era.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-bold truncate" style={{ color: '#E9E2D5' }}>
                        {era.name}
                      </p>
                      <p className="text-[11px]" style={{ color: '#B8AFA0' }}>
                        {era.period}
                      </p>
                    </div>
                    {completed && (
                      <div
                        className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{
                          backgroundColor: 'rgba(109,139,104,0.15)',
                          color: '#6D8B68',
                          border: '1px solid rgba(109,139,104,0.3)',
                        }}
                      >
                        ✓ 已通关
                      </div>
                    )}
                  </div>

                  {/* Progress stats */}
                  <div className="flex items-center gap-4 text-[11px] mb-2" style={{ color: '#B8AFA0' }}>
                    <span>
                      阅片 <span style={{ color: '#C8A878', fontWeight: 700 }}>{readInEra}</span>/{progress.total}
                    </span>
                    <span>
                      答题 <span style={{ color: '#C8A878', fontWeight: 700 }}>{quizInEra}</span>/{progress.total}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(107,99,88,0.15)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: completed ? '#6D8B68' : '#C8A878',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           SECTION 6: STATS SUMMARY
           ═══════════════════════════════════════ */}
        <div className="mb-8">
          <h2
            className="font-serif text-lg font-bold mb-5 tracking-wider"
            style={{ color: '#C8A878' }}
          >
            学习数据统计
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="影片阅览" value={readCount} total={34} />
            <StatCard label="知识答题" value={quizCount} total={34} />
            <StatCard label="时代闯关" value={challengeCount} total={7} />
            <StatCard label="藏品收集" value={collectionCount} total={7} />
          </div>
        </div>

        <div className="film-strip-h w-full mb-8" />

        {/* ═══════════════════════════════════════
           FOOTER
           ═══════════════════════════════════════ */}
        <div className="text-center py-6">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.3)' }} />
            <span className="block h-1 w-1 rotate-45" style={{ backgroundColor: 'rgba(200,168,120,0.4)' }} />
            <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.3)' }} />
          </div>
          <p
            className="font-serif text-sm leading-relaxed"
            style={{ color: '#C8A878', textShadow: '0 0 15px rgba(200,168,120,0.15)' }}
          >
            完成全部七大时代试炼
          </p>
          <p
            className="font-serif text-base font-bold mt-1 tracking-wider"
            style={{
              color: '#C8A878',
              textShadow: '0 0 20px rgba(200,168,120,0.25)',
            }}
          >
            晋升「百年光影全域宗师」终极段位
          </p>
          <p className="text-xs mt-3" style={{ color: 'rgba(200,168,120,0.3)' }}>
            光影纪年 · 中国电影发展史研学平台
          </p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   ERA CARD COMPONENT
   ══════════════════════════════════════════ */

function EraCard({
  era,
  completed,
  mainFilmName,
}: {
  era: { id: number; name: string; period: string }
  completed: boolean
  mainFilmName?: string
}) {
  return (
    <div
      className="relative rounded-xl p-3 overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'rgba(66,55,41,0.6)',
        border: completed
          ? '2px solid rgba(200,168,120,0.45)'
          : '2px solid rgba(107,99,88,0.15)',
      }}
    >
      {/* Era number */}
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{
            backgroundColor: completed ? '#C8A878' : 'rgba(107,99,88,0.2)',
            color: completed ? '#2E261C' : '#6B6358',
          }}
        >
          {era.id}
        </span>
        <span className="text-[10px]" style={{ color: '#B8AFA0' }}>
          {era.period}
        </span>
      </div>

      {/* Era name */}
      <p
        className="font-serif text-xs font-bold mb-1 truncate"
        style={{ color: completed ? '#E9E2D5' : '#6B6358' }}
      >
        {era.name}
      </p>

      {/* Main film */}
      {mainFilmName && (
        <p
          className="text-[10px] truncate mb-2"
          style={{ color: '#B8AFA0', opacity: 0.7 }}
        >
          代表作：{mainFilmName}
        </p>
      )}

      {/* Status stamp */}
      {completed ? (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
          style={{
            backgroundColor: 'rgba(109,139,104,0.15)',
            color: '#6D8B68',
            border: '1px solid rgba(109,139,104,0.25)',
          }}
        >
          <span>✓</span>
          <span>已通关</span>
        </div>
      ) : (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
          style={{
            backgroundColor: 'rgba(107,99,88,0.1)',
            color: '#6B6358',
          }}
        >
          <span>🔒</span>
          <span>待挑战</span>
        </div>
      )}

      {/* Completed stamp overlay */}
      {completed && (
        <div
          className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full text-[9px]"
          style={{
            backgroundColor: '#6D8B68',
            color: '#fff',
            transform: 'rotate(12deg)',
            boxShadow: '0 2px 6px rgba(109,139,104,0.4)',
          }}
        >
          ✓
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   STAT CARD COMPONENT
   ══════════════════════════════════════════ */

function StatCard({
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
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'rgba(66,55,41,0.5)',
        border: '1px solid rgba(107,99,88,0.15)',
      }}
    >
      <p
        className="text-xs mb-1"
        style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)' }}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span
          className="font-serif text-2xl font-bold"
          style={{
            color: '#C8A878',
            textShadow: '0 0 12px rgba(200,168,120,0.2)',
          }}
        >
          {value}
        </span>
        <span className="text-xs" style={{ color: 'rgba(184,175,160,0.5)' }}>
          / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full mt-2.5 overflow-hidden" style={{ backgroundColor: 'rgba(107,99,88,0.15)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background:
              pct >= 100
                ? 'linear-gradient(90deg, rgba(109,139,104,0.6), #6D8B68)'
                : 'linear-gradient(90deg, rgba(200,168,120,0.6), #C8A878)',
          }}
        />
      </div>
    </div>
  )
}
