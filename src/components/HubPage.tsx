'use client'

import Image from 'next/image'

interface HubPageProps {
  onEnterArchive: () => void
  onEnterExperience: () => void
  onEnterCollection: () => void
  onOpenTimesheet: () => void
}

const entranceCards = [
  {
    key: 'archive' as const,
    title: '资料馆',
    subtitle: '百年影史，馆藏于此',
    icon: '🎬',
    desc: '浏览34部经典影片的时代故事与获奖记录',
  },
  {
    key: 'experience' as const,
    title: '体验馆',
    subtitle: '沉浸闯关，亲历光影',
    icon: '🎥',
    desc: '扮演片场角色完成七大时代拍摄挑战',
  },
  {
    key: 'collection' as const,
    title: '藏品馆',
    subtitle: '时代珍藏，典藏记忆',
    icon: '🏆',
    desc: '收集七大时代专属纪念藏品，解锁终极图鉴',
  },
]

export default function HubPage({
  onEnterArchive,
  onEnterExperience,
  onEnterCollection,
  onOpenTimesheet,
}: HubPageProps) {
  const handlers: Record<string, () => void> = {
    archive: onEnterArchive,
    experience: onEnterExperience,
    collection: onEnterCollection,
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <Image
          src="/images/3 样本模底【总页面背景图】推进去后的板块选择.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <h1
          className="font-serif text-4xl md:text-5xl font-black mb-2 tracking-widest"
          style={{ color: '#2C241C' }}
        >
          光影纪年
        </h1>
        <p className="font-sans text-sm mb-10 tracking-wider opacity-50" style={{ color: '#2C241C' }}>
          选择你想要探索的板块
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {entranceCards.map((card) => (
            <button
              key={card.key}
              onClick={handlers[card.key]}
              className="card-hover group flex flex-col items-center text-center rounded-2xl p-8 cursor-pointer border-2 border-transparent hover:border-[#C8A878]"
              style={{ backgroundColor: '#EBE3D5' }}
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                {card.icon}
              </div>
              <h2 className="font-serif text-2xl font-bold mb-1" style={{ color: '#2C241C' }}>
                {card.title}
              </h2>
              <p className="font-serif text-sm mb-3" style={{ color: '#C8A878' }}>
                {card.subtitle}
              </p>
              <div className="film-strip w-12 mb-3" />
              <p className="font-sans text-xs opacity-60" style={{ color: '#2C241C' }}>
                {card.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onOpenTimesheet}
        className="fixed bottom-6 right-6 z-40 card-hover flex items-center gap-2 rounded-full px-5 py-3 shadow-lg font-serif text-sm font-bold text-white cursor-pointer"
        style={{ backgroundColor: '#C8A878' }}
      >
        <span>📋</span>
        <span>场记单</span>
      </button>
    </div>
  )
}
