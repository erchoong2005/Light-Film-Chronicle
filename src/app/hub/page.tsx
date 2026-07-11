'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useGameState } from '@/lib/gameState'
import TimesheetButton from '@/components/TimesheetButton'

const entranceCards = [
  {
    key: 'archive' as const,
    title: '资料馆',
    subtitle: '百年影史·馆藏于此',
    icon: '🎞️',
    route: '/archive',
  },
  {
    key: 'experience' as const,
    title: '体验馆',
    subtitle: '沉浸闯关·亲历光影',
    icon: '🎬',
    route: '/experience',
  },
  {
    key: 'collection' as const,
    title: '藏品馆',
    subtitle: '时代珍藏·典藏记忆',
    icon: '🏆',
    route: '/collection',
  },
]

export default function HubPage() {
  const router = useRouter()
  const { state } = useGameState()

  return (
    <div className="page-enter relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/2【总页面背景图】可以往前推进去进入板块页面.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(46,38,28,0.7)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl">
        <h1
          className="font-serif text-5xl md:text-6xl font-black mb-3 tracking-[0.2em]"
          style={{
            color: '#C8A878',
            textShadow: '0 2px 30px rgba(200,168,120,0.3), 0 0 60px rgba(200,168,120,0.1)',
          }}
        >
          光影纪年
        </h1>
        <p
          className="text-sm mb-12 tracking-[0.4em] opacity-60 font-sans"
          style={{ color: '#C8A878' }}
        >
          中国电影发展史研学平台
        </p>

        {/* Three entrance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {entranceCards.map((card, i) => (
            <button
              key={card.key}
              onClick={() => router.push(card.route)}
              className="entrance-card archive-content-enter flex flex-col items-center text-center p-8 md:p-10 group"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div
                className="text-5xl md:text-6xl mb-5 transition-transform duration-300 group-hover:scale-110"
              >
                {card.icon}
              </div>
              <h2
                className="font-serif text-2xl md:text-3xl font-bold mb-2 tracking-wider"
                style={{ color: '#E9E2D5' }}
              >
                {card.title}
              </h2>
              <p
                className="font-serif text-sm mb-4 tracking-wider"
                style={{ color: '#C8A878' }}
              >
                {card.subtitle}
              </p>
              <div className="film-strip w-16 mb-4 opacity-30" />
              <p
                className="text-xs opacity-50 font-sans"
                style={{ color: '#E9E2D5' }}
              >
                点击进入 →
              </p>
            </button>
          ))}
        </div>

        {/* Badge progress hint */}
        <div
          className="mt-10 px-5 py-2.5 rounded-full font-sans text-xs tracking-wider opacity-50"
          style={{
            backgroundColor: 'rgba(66,55,41,0.5)',
            border: '1px solid rgba(200,168,120,0.15)',
            color: '#C8A878',
          }}
        >
          当前徽章等级：Lv.{state.badgeLevel}
        </div>
      </div>

      {/* ─── 场记单按钮 ─── */}
      <TimesheetButton />
    </div>
  )
}
