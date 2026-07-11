'use client'

import { useState } from 'react'
import Image from 'next/image'
import { EraId, Collection } from '@/types'
import { eras } from '@/data/eras'

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  collections: Collection[]
  collectionStatus: Record<EraId, boolean>
}

export default function CollectionModal({
  isOpen,
  onClose,
  collections,
  collectionStatus,
}: CollectionModalProps) {
  const [detailId, setDetailId] = useState<number | null>(null)
  const detailItem = detailId !== null ? collections.find((c) => c.id === detailId) : null

  if (!isOpen) return null

  const unlockedCount = Object.values(collectionStatus).filter(Boolean).length

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(44,36,28,0.5)' }}>
      <div className="modal-content w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: '#F6F2E9' }}>
        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex items-center justify-between" style={{ backgroundColor: '#EBE3D5' }}>
          <div>
            <h2 className="font-serif text-xl font-bold" style={{ color: '#2C241C' }}>
              🏆 藏品馆 · 时代典藏
            </h2>
            <p className="text-xs font-sans opacity-50 mt-1" style={{ color: '#2C241C' }}>
              完成闯关即可解锁对应时代的专属藏品 · 已收集 {unlockedCount}/7
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

        {/* Progress bar */}
        <div className="px-8 py-3" style={{ backgroundColor: '#EBE3D5' }}>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#94908820' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(unlockedCount / 7) * 100}%`,
                backgroundColor: '#C8A878',
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-5">
            {collections.map((item) => {
              const isUnlocked = !!collectionStatus[item.eraId as EraId]
              const era = eras.find((e) => e.id === item.eraId)

              return (
                <button
                  key={item.id}
                  onClick={() => isUnlocked && setDetailId(item.id)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all"
                  style={{
                    backgroundColor: '#EBE3D5',
                    filter: isUnlocked ? 'none' : 'grayscale(1)',
                    opacity: isUnlocked ? 1 : 0.6,
                  }}
                >
                  <Image
                    src={`/images/${item.image}`}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  {!isUnlocked && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(44,36,28,0.4)' }}
                    >
                      <span className="font-serif text-sm font-bold text-white/80">🔒 未解锁</span>
                    </div>
                  )}

                  {isUnlocked && (
                    <div
                      className="absolute bottom-0 inset-x-0 px-2 py-2"
                      style={{
                        background: 'linear-gradient(transparent, rgba(44,36,28,0.7))',
                      }}
                    >
                      <p className="font-serif text-xs font-bold text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-white/60">{era?.name}</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail popup */}
      {detailItem && (
        <div
          className="modal-overlay fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDetailId(null)}
        >
          <div
            className="modal-content w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: '#EBE3D5' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={`/images/${detailItem.image}`}
                alt={detailItem.name}
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(transparent 50%, #EBE3D5)' }}
              />
              <button
                onClick={() => setDetailId(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 pb-6 -mt-6 relative z-10">
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold mb-2"
                style={{ backgroundColor: '#C8A87820', color: '#C8A878' }}
              >
                {eras.find((e) => e.id === detailItem.eraId)?.name}
              </span>
              <h3 className="font-serif text-lg font-bold mb-3" style={{ color: '#2C241C' }}>
                {detailItem.name}
              </h3>

              <div className="space-y-3 text-xs font-sans leading-relaxed" style={{ color: '#2C241C' }}>
                <div className="rounded-xl p-3" style={{ backgroundColor: '#F6F2E9' }}>
                  <p className="font-bold mb-1" style={{ color: '#C8A878' }}>
                    藏品介绍
                  </p>
                  <p className="opacity-80">{detailItem.description}</p>
                </div>
                <div className="rounded-xl p-3" style={{ backgroundColor: '#F6F2E9' }}>
                  <p className="font-bold mb-1" style={{ color: '#C8A878' }}>
                    解锁用途
                  </p>
                  <p className="opacity-80">{detailItem.usage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
