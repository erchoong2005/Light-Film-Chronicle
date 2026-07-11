'use client'

import { useState } from 'react'
import { Era, Film } from '@/types'

interface ArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  eras: Era[]
  films: Film[]
  filmReadStatus: Record<number, boolean>
  onMarkFilmRead: (filmId: number) => void
  onStartQuiz: (film: Film) => void
}

export default function ArchiveModal({
  isOpen,
  onClose,
  eras,
  films,
  filmReadStatus,
  onMarkFilmRead,
  onStartQuiz,
}: ArchiveModalProps) {
  const [selectedEraId, setSelectedEraId] = useState<number>(1)

  if (!isOpen) return null

  const selectedEra = eras.find((e) => e.id === selectedEraId)!
  const eraFilms = films.filter((f) => f.era === selectedEraId)

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(44,36,28,0.5)' }}>
      <div className="modal-content flex w-full h-full" style={{ backgroundColor: '#F6F2E9' }}>
        {/* Left: Timeline */}
        <div className="w-64 flex-shrink-0 flex flex-col border-r overflow-y-auto py-6 px-4" style={{ borderColor: '#C8A87840' }}>
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-serif font-bold text-base" style={{ color: '#2C241C' }}>
              百年影史
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: '#2C241C' }}
            >
              ✕
            </button>
          </div>

          <div className="relative flex-1">
            <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#C8A87840' }} />

            <div className="space-y-1">
              {eras.map((era) => {
                const isSelected = era.id === selectedEraId
                return (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEraId(era.id)}
                    className="relative w-full text-left pl-10 pr-3 py-3 rounded-xl transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? '#EBE3D5' : 'transparent',
                      color: '#2C241C',
                    }}
                  >
                    <div
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all"
                      style={{
                        borderColor: '#C8A878',
                        backgroundColor: isSelected ? '#C8A878' : '#F6F2E9',
                        color: isSelected ? '#fff' : '#C8A878',
                      }}
                    >
                      {era.id}
                    </div>
                    <div className="font-serif text-sm leading-tight font-bold">{era.name}</div>
                    <div className="text-[11px] opacity-50 mt-0.5">{era.period}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Era content & Film cards */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 pt-6 pb-4" style={{ backgroundColor: '#EBE3D5' }}>
            <div className="flex items-center gap-3 mb-2">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: '#C8A878' }}
              >
                {selectedEra.id}
              </span>
              <h2 className="font-serif text-xl font-bold" style={{ color: '#2C241C' }}>
                {selectedEra.name}
              </h2>
              <span className="text-sm opacity-50 font-sans">{selectedEra.period}</span>
            </div>
            <p className="text-xs leading-relaxed font-sans opacity-70 line-clamp-2" style={{ color: '#2C241C' }}>
              {selectedEra.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-5">
              {eraFilms.map((film) => {
                const isRead = !!filmReadStatus[film.id]
                return (
                  <div
                    key={film.id}
                    className="card-hover rounded-2xl overflow-hidden"
                    style={{ backgroundColor: '#EBE3D5' }}
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-serif text-lg font-bold" style={{ color: '#2C241C' }}>
                            《{film.name}》
                            <span className="text-sm font-normal ml-2 opacity-50">({film.year})</span>
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            <span
                              className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                              style={{ backgroundColor: '#2C241C10', color: '#2C241C' }}
                            >
                              {film.type}
                            </span>
                            {film.isMain && (
                              <span
                                className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                                style={{ backgroundColor: '#C8A87820', color: '#C8A878' }}
                              >
                                时代代表作
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => onStartQuiz(film)}
                            className="rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer"
                            style={{ backgroundColor: '#2C241C15', color: '#2C241C' }}
                          >
                            📝 答题
                          </button>
                          <button
                            onClick={() => !isRead && onMarkFilmRead(film.id)}
                            className="rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer"
                            style={{
                              backgroundColor: isRead ? '#6D8B68' : '#C8A878',
                              color: '#fff',
                            }}
                          >
                            {isRead ? '✓ 已看' : '想看'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs font-sans mb-3" style={{ color: '#2C241C' }}>
                        <div>
                          <span className="opacity-50">导演</span>
                          <p className="font-medium mt-0.5">{film.director}</p>
                        </div>
                        <div>
                          <span className="opacity-50">主演</span>
                          <p className="font-medium mt-0.5 truncate">{film.主演}</p>
                        </div>
                        <div>
                          <span className="opacity-50">类型</span>
                          <p className="font-medium mt-0.5">{film.type.split('、')[0]}</p>
                        </div>
                      </div>

                      <div className="text-xs font-sans leading-relaxed space-y-2" style={{ color: '#2C241C' }}>
                        <div>
                          <span className="font-bold opacity-70">剧情简介：</span>
                          <span className="opacity-80">{film.剧情简介}</span>
                        </div>
                        <div>
                          <span className="font-bold opacity-70">获奖记录：</span>
                          <span className="opacity-80">{film.获奖记录}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
