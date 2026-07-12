'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameState } from '@/lib/gameState'
import { films } from '@/data/films'
import { eras } from '@/data/eras'
import type { Film, Era, EraId } from '@/types'
import VenueIntroModal from '@/components/VenueIntroModal'
import TimesheetButton from '@/components/TimesheetButton'
import { filmKeywords } from '@/data/keywords'
import type { Keyword } from '@/types'

const ERA_PX = 280

function filmsByEra(eraId: EraId) {
  return films.filter((f) => f.era === eraId)
}

/* ─── Clapperboard button (阅览互动) ─── */
function QuizButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/quiz')}
      className="fixed top-5 right-36 z-50 flex items-center cursor-pointer group"
      style={{
        background: 'rgba(26,22,18,0.92)',
        border: '1.5px solid rgba(200,168,120,0.55)',
        borderRadius: '4px',
        padding: '0',
        boxShadow: '0 0 10px rgba(200,168,120,0.12)',
        transition: 'all 300ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,168,120,0.25)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(200,168,120,0.12)' }}
    >
      <div style={{
        width: 28, height: 14,
        background: 'repeating-linear-gradient(90deg, #1a1612 0px, #1a1612 3px, #C8A878 3px, #C8A878 6px)',
        borderBottom: '2px solid rgba(200,168,120,0.6)',
        transform: 'skewX(-8deg)',
        transformOrigin: 'bottom right',
        flexShrink: 0,
      }} />
      <span className="font-serif text-[10px] font-bold tracking-wider px-2" style={{ color: '#C8A878' }}>阅览互动</span>
      <div className="flex flex-col gap-[2px] px-2 py-1">
        {[0,1,2].map(i => (
          <div key={i} className="w-[4px] h-[3px] rounded-[1px]" style={{ backgroundColor: 'rgba(200,168,120,0.3)' }} />
        ))}
      </div>
    </button>
  )
}

export default function ArchivePage() {
  const router = useRouter()
  const { state, markFilmRead } = useGameState()

  const [showIntro, setShowIntro] = useState(true)
  const [eraModal, setEraModal] = useState<Era | null>(null)
  const [filmModal, setFilmModal] = useState<Film | null>(null)
  const [activeKeyword, setActiveKeyword] = useState<Keyword | null>(null)

  // Entry animation phases
  const [stripRevealed, setStripRevealed] = useState(false)
  const [erasVisible, setErasVisible] = useState<boolean[]>([])
  const [labelsVisible, setLabelsVisible] = useState<Set<number>>(new Set())

  useEffect(() => {
    const t1 = setTimeout(() => setStripRevealed(true), 200)
    const t2 = setTimeout(() => setErasVisible(eras.map(() => true)), 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const eraFilmMap = useMemo(() => {
    const map: Record<number, Film[]> = {}
    eras.forEach((era) => { map[era.id] = filmsByEra(era.id) })
    return map
  }, [])

  // Build label layout — larger labels, more distance from strip
  const scatterLayout = useMemo(() => {
    const layout: {
      eraId: EraId
      film: Film
      side: 'above' | 'below'
      xPos: number
      yOff: number
      lineLen: number
      globalIdx: number
      eraIdx: number
    }[] = []
    let globalIdx = 0
    const usedXs: number[] = []

    eras.forEach((era, eraIdx) => {
      const eraFilms = eraFilmMap[era.id] || []
      const count = eraFilms.length
      const spacing = ERA_PX / (count + 1)

      eraFilms.forEach((film, i) => {
        const side = i % 2 === 0 ? 'above' : 'below'
        let xPos = eraIdx * ERA_PX + spacing * (i + 1)

        // Collision detection — larger min gap for bigger labels
        const MIN_GAP = 36
        for (const px of usedXs) {
          if (Math.abs(xPos - px) < MIN_GAP) {
            xPos = px + MIN_GAP
          }
        }
        usedXs.push(xPos)

        const row = Math.floor(i / 2)
        // Larger yOff = more distance from strip; accounts for pill height + gap
        const yOff = 30 + row * 20
        const lineLen = 14

        layout.push({ eraId: era.id, film, side, xPos, yOff, lineLen, globalIdx, eraIdx })
        globalIdx++
      })
    })
    return layout
  }, [eraFilmMap])

  // Left-to-right label reveal: 批次按时代从左到右
  useEffect(() => {
    if (!erasVisible[0]) return
    const byEra: Record<number, number[]> = {}
    scatterLayout.forEach((l) => {
      if (!byEra[l.eraId]) byEra[l.eraId] = []
      byEra[l.eraId].push(l.globalIdx)
    })

    const eraIds = Object.keys(byEra).map(Number).sort()
    let delay = 600
    eraIds.forEach((eid) => {
      const indices = byEra[eid]
      indices.forEach((idx) => {
        const t = setTimeout(() => {
          setLabelsVisible((prev) => new Set(prev).add(idx))
        }, delay)
        delay += 100
      })
      delay += 200 // pause between eras
    })
  }, [erasVisible, scatterLayout])

  const totalWidth = eras.length * ERA_PX

  return (
    <div className="door-enter relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, #1E1A14 0%, #2E261C 40%, #1E1A14 100%)' }}>
      {/* Film grain */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />

      {/* Gold dust */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage:
          'radial-gradient(circle at 20% 15%, rgba(200,168,120,0.04) 0%, transparent 30%),' +
          'radial-gradient(circle at 80% 25%, rgba(200,168,120,0.03) 0%, transparent 35%),' +
          'radial-gradient(circle at 45% 70%, rgba(200,168,120,0.025) 0%, transparent 40%),' +
          'radial-gradient(circle at 75% 85%, rgba(200,168,120,0.02) 0%, transparent 30%)',
      }} />

      <QuizButton />
      <TimesheetButton />

      {/* Back button — film-arrow */}
      <button
        onClick={() => router.push('/hub')}
        className="fixed top-5 left-5 z-40 flex items-center gap-2 cursor-pointer group"
        style={{
          background: 'rgba(26,22,18,0.8)',
          border: '1px solid rgba(200,168,120,0.25)',
          borderRadius: '2px',
          padding: '6px 12px',
          transition: 'all 300ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,120,0.6)'; e.currentTarget.style.background = 'rgba(26,22,18,0.95)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,120,0.25)'; e.currentTarget.style.background = 'rgba(26,22,18,0.8)' }}
      >
        <div className="flex items-center gap-[1px]">
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 7 - i, height: 2,
              background: '#C8A878',
              transform: `rotate(${i === 2 ? 0 : i === 1 ? 25 : 45}deg)`,
              marginBottom: i === 1 ? -1 : i === 2 ? -2 : 0,
            }} />
          ))}
        </div>
        <span className="font-serif text-[11px] tracking-wider" style={{ color: '#C8A878' }}>返回</span>
      </button>

      {/* ─── MAIN SCROLL AREA ─── */}
      <div className="relative z-20 overflow-x-auto" style={{ height: '100vh' }}>
        <div className="relative" style={{ width: `${totalWidth}px`, height: '100%' }}>

          {/* Header title */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-center">
            <h1 className="font-serif text-base tracking-[0.3em] font-bold" style={{ color: '#C8A878' }}>资料馆</h1>
          </div>

          {/* ── FILM STRIP CENTER AXIS ── */}
          <div
            className="absolute"
            style={{
              top: '50%', left: 0,
              transform: 'translateY(-50%)',
              height: '120px',
              width: stripRevealed ? '100%' : '0%',
              transition: 'width 900ms ease-out',
              overflow: 'hidden',
            }}
          >
            {/* Strip body */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, #1A1610 0%, #2A2318 35%, #322B1E 50%, #2A2318 65%, #1A1610 100%)',
              borderTop: '2px solid rgba(200,168,120,0.3)',
              borderBottom: '2px solid rgba(200,168,120,0.3)',
              boxShadow: '0 0 50px rgba(200,168,120,0.06), inset 0 0 40px rgba(200,168,120,0.02)',
            }}>
              {/* Top sprocket holes */}
              <div className="absolute top-[8px] left-0 right-0 flex">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div key={`st${i}`} className="flex-shrink-0 w-[7px] h-[4px] rounded-[1px] mx-[7px]" style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(200,168,120,0.15)' : 'rgba(200,168,120,0.08)',
                  }} />
                ))}
              </div>
              {/* Bottom sprocket holes */}
              <div className="absolute bottom-[8px] left-0 right-0 flex">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div key={`sb${i}`} className="flex-shrink-0 w-[7px] h-[4px] rounded-[1px] mx-[7px]" style={{
                    backgroundColor: i % 2 === 0 ? 'rgba(200,168,120,0.15)' : 'rgba(200,168,120,0.08)',
                  }} />
                ))}
              </div>

              {/* Era zone dividers */}
              {eras.slice(1).map((era, i) => (
                <div key={i} className="absolute top-0 bottom-0" style={{
                  left: i * ERA_PX + ERA_PX,
                  width: '1px',
                  background: 'linear-gradient(180deg, transparent, rgba(200,168,120,0.1), transparent)',
                }} />
              ))}
            </div>

            {/* Era blocks on the strip */}
            <div className="absolute flex items-center" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
              {eras.map((era, ei) => (
                <button
                  key={era.id}
                  onClick={() => setEraModal(era)}
                  className="z-30 flex items-center justify-center cursor-pointer transition-all duration-500"
                  style={{
                    width: `${ERA_PX}px`, height: '100%',
                    opacity: erasVisible[ei] ? 1 : 0,
                    transform: erasVisible[ei] ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${ei * 0.08}s`,
                  }}
                >
                  <div
                    className="flex flex-col items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      width: '160px', height: '68px',
                      background: 'linear-gradient(135deg, rgba(46,38,28,0.95), rgba(66,55,41,0.9))',
                      border: '1px solid rgba(200,168,120,0.4)',
                      borderRadius: '4px',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.5)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C8A878'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,168,120,0.25)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,120,0.4)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.5)' }}
                  >
                    <span className="text-xs font-serif font-bold tracking-wider" style={{ color: '#C8A878' }}>{era.period}</span>
                    <span className="text-[11px] font-sans opacity-60 mt-0.5" style={{ color: '#E9E2D5' }}>{era.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── FILM LABELS (scattered above/below the strip) ── */}
          <div className="absolute inset-0" style={{ top: 0 }}>
            {scatterLayout.map((b) => {
              const dir = b.side === 'above' ? -1 : 1
              const stripHalf = 60
              const gap = 4
              const pillEst = 28 // approximate pill height (text-sm + py-1.5)
              const visible = labelsVisible.has(b.globalIdx)

              // Position the button so the line end sits yOff from the strip edge.
              // Above: pill at top, line below; button bottom = center - stripHalf - yOff
              // Below: line at top, pill below; button top   = center + stripHalf + yOff
              const topVal = dir === -1
                ? `calc(50% - ${stripHalf + b.yOff + b.lineLen + gap + pillEst}px)`
                : `calc(50% + ${stripHalf + b.yOff}px)`

              return (
                <div
                  key={b.film.id}
                  className="absolute z-20"
                  style={{
                    left: `${b.xPos}px`,
                    top: topVal,
                    transform: 'translateX(-50%)',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 400ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: `${gap}px`,
                    pointerEvents: 'auto',
                  }}
                >
                  {/* Connecting line — rendered in DOM order matching flex visual order */}
                  {dir === 1 && (
                    <div
                      style={{
                        width: '1px',
                        height: `${b.lineLen}px`,
                        backgroundColor: 'rgba(200,168,120,0.3)',
                      }}
                    />
                  )}
                  {/* Label pill — bigger */}
                  <button
                    onClick={() => setFilmModal(b.film)}
                    className="group cursor-pointer"
                  >
                    <div
                      className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-serif font-bold tracking-wide transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(42,35,24,0.92)',
                        border: '1px solid rgba(200,168,120,0.2)',
                        color: state.filmReadStatus[b.film.id] ? '#6D8B68' : '#C8A878',
                        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      {b.film.isMain && <span className="mr-0.5">★</span>}
                      《{b.film.name}》
                    </div>
                  </button>
                  {dir === -1 && (
                    <div
                      style={{
                        width: '1px',
                        height: `${b.lineLen}px`,
                        backgroundColor: 'rgba(200,168,120,0.3)',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* ─── Era Modal ─── */}
      {eraModal && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(30,26,20,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setEraModal(null) }}
        >
          <div className="modal-content gold-sweep relative w-full max-w-lg rounded-2xl p-8" style={{
            backgroundColor: 'rgba(46,38,28,0.95)',
            border: '1px solid rgba(200,168,120,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            <button onClick={() => setEraModal(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer" style={{ color: '#E9E2D5' }}>✕</button>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white font-serif" style={{ backgroundColor: '#C8A878' }}>{eraModal.id}</span>
              <div>
                <h2 className="font-serif text-xl font-bold" style={{ color: '#C8A878' }}>{eraModal.name}</h2>
                <p className="text-xs font-sans opacity-50" style={{ color: '#E9E2D5' }}>{eraModal.period}</p>
              </div>
            </div>
            <div className="film-strip-h w-full mb-5" />
            <p className="font-sans text-sm leading-relaxed" style={{ color: '#E9E2D5', opacity: 0.85 }}>{eraModal.description}</p>
            <div className="mt-6 text-center">
              <button onClick={() => setEraModal(null)} className="btn-gold text-sm px-8 py-2">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Film Modal ─── */}
      {filmModal && (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(30,26,20,0.85)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setFilmModal(null) }}
        >
          <div className="modal-content relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8" style={{
            backgroundColor: 'rgba(46,38,28,0.95)',
            border: '1px solid rgba(200,168,120,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            <button onClick={() => setFilmModal(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer" style={{ color: '#E9E2D5' }}>✕</button>
            <div className="flex gap-5 mb-4">
              {/* Poster */}
              <div className="flex-shrink-0 w-[140px] h-[200px] rounded-xl overflow-hidden" style={{ border: '1px solid rgba(200,168,120,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
                <img
                  src={`/images/posters/${filmModal.id}.jpg`}
                  alt={`《${filmModal.name}》海报`}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-2xl font-bold" style={{ color: '#C8A878' }}>《{filmModal.name}》</h2>
                <p className="text-sm font-sans opacity-50 mt-1" style={{ color: '#E9E2D5' }}>
                  {filmModal.year}年
                  {filmModal.isMain && <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(200,168,120,0.2)', color: '#C8A878' }}>时代代表作</span>}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div>
                    <p className="text-[11px] font-sans opacity-40 mb-0.5" style={{ color: '#C8A878' }}>导演</p>
                    <p className="font-sans text-sm font-bold" style={{ color: '#E9E2D5' }}>{filmModal.director}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-sans opacity-40 mb-0.5" style={{ color: '#C8A878' }}>主演</p>
                    <p className="font-sans text-sm font-bold truncate" style={{ color: '#E9E2D5' }}>{filmModal.主演}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-sans opacity-40 mb-0.5" style={{ color: '#C8A878' }}>类型</p>
                    <p className="font-sans text-sm font-bold" style={{ color: '#E9E2D5' }}>{filmModal.type}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="film-strip-h w-full mb-5" />
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-[11px] font-sans opacity-40 mb-1" style={{ color: '#C8A878' }}>剧情简介</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#E9E2D5', opacity: 0.85 }}>{filmModal.剧情简介}</p>
              </div>
              <div>
                <p className="text-[11px] font-sans opacity-40 mb-1" style={{ color: '#C8A878' }}>获奖记录</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#E9E2D5', opacity: 0.85 }}>{filmModal.获奖记录}</p>
              </div>
            </div>

            {/* Keyword tags */}
            {(() => {
              const kws = filmKeywords.find((fk) => fk.filmId === filmModal.id)
              if (!kws || kws.keywords.length === 0) return null
              return (
                <div className="mb-6">
                  <p className="text-[11px] font-sans opacity-40 mb-2" style={{ color: '#C8A878' }}>关键词延伸</p>
                  <div className="flex flex-wrap gap-2">
                    {kws.keywords.map((kw) => (
                      <button
                        key={kw.name}
                        onClick={() => setActiveKeyword(kw)}
                        className="group/tag cursor-pointer rounded-full px-3 py-1 text-xs font-bold font-sans transition-all duration-200"
                        style={{
                          backgroundColor: 'rgba(200,168,120,0.12)',
                          border: '1px solid rgba(200,168,120,0.3)',
                          color: '#C8A878',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200,168,120,0.25)'; e.currentTarget.style.borderColor = 'rgba(200,168,120,0.6)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(200,168,120,0.12)'; e.currentTarget.style.borderColor = 'rgba(200,168,120,0.3)' }}
                      >
                        {kw.name}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}

            <div className="flex items-center justify-between">
              <button
                onClick={() => markFilmRead(filmModal.id)}
                className="text-sm px-6 py-2.5 rounded-lg font-bold font-serif tracking-wider transition-all cursor-pointer"
                style={{ backgroundColor: state.filmReadStatus[filmModal.id] ? '#6D8B68' : '#C8A878', color: state.filmReadStatus[filmModal.id] ? '#fff' : '#2C241C' }}
              >
                {state.filmReadStatus[filmModal.id] ? '✓ 已看' : '标记已看'}
              </button>
              <button onClick={() => setFilmModal(null)} className="btn-gold text-sm px-6 py-2.5">关闭</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Keyword Modal (second layer, on top of film modal) ─── */}
      {activeKeyword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ backgroundColor: 'rgba(30,26,20,0.5)' }}>
          <div
            className="relative w-full max-w-md rounded-2xl p-7 modal-content"
            style={{
              backgroundColor: 'rgba(46,38,28,0.97)',
              border: '1px solid rgba(200,168,120,0.4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(200,168,120,0.08)',
              animation: 'kwFadeIn 300ms ease-out',
            }}
          >
            <button
              onClick={() => setActiveKeyword(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: '#E9E2D5' }}
            >
              ✕
            </button>

            <div className="mb-1">
              <span
                className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold font-sans tracking-wider"
                style={{ backgroundColor: 'rgba(200,168,120,0.15)', color: '#C8A878' }}
              >
                关键词
              </span>
            </div>

            <h3 className="font-serif text-xl font-bold mt-3 mb-4" style={{ color: '#C8A878' }}>
              {activeKeyword.name}
            </h3>

            <div className="film-strip-h w-full mb-4" />

            <p className="font-sans text-sm leading-relaxed" style={{ color: '#E9E2D5', opacity: 0.88 }}>
              {activeKeyword.definition}
            </p>

            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveKeyword(null)}
                className="btn-gold text-sm px-8 py-2"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showIntro && (
        <VenueIntroModal venue="archive" onClose={() => setShowIntro(false)} />
      )}
    </div>
  )
}
