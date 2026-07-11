'use client'

import { useState, useEffect } from 'react'

const venueInfo: Record<string, { title: string; lines: string[] }> = {
  archive: {
    title: '资料馆',
    lines: [
      '馆藏中国电影百年七大时代34部标杆影片，沿35mm胶片中轴线铺展。点击胶片时代区块可阅览时代背景简介，点击影片标签可查看影片详细信息，包含导演、主演、剧情简介、获奖记录等完整档案资料。',
      '每部影片均可标记"已看"，阅片进度自动同步至光影场记单。资料馆为开放式自由阅览空间，无时限约束，可按时代顺序或随机翻阅，自行漫步百年光影长廊。',
    ],
  },
  experience: {
    title: '体验馆',
    lines: [
      '七大时代各设一道沉浸式片场闯关试炼。每道关卡还原对应时代的真实片场场景，你将代入不同历史阶段的影视工作者角色，面对贴合时代背景的拍摄制作决策。',
      '选择正确的拍摄方案即可通关，解锁该时代专属成就徽章与典藏藏品。闯关过程无时间限制，可反复试错，循序渐进体验中国电影百年创作变迁。',
    ],
  },
  collection: {
    title: '藏品馆',
    lines: [
      '七大时代各设一件专属限定典藏藏品，涵盖手摇胶片摄影机模型、红色胶片纪念帧、样板戏舞台徽章、复古电影胶卷盒、贺岁电影海报拓印卡、行星发动机特效碎片、全网光影传播勋章等。',
      '藏品需要通过体验馆闯关成功解锁。每解锁一件藏品，均可查看详细介绍与解锁用途。集齐全部七件藏品，即可点亮百年电影终极荣誉图鉴。',
    ],
  },
}

export default function VenueIntroModal({
  venue,
  onClose,
}: {
  venue: 'archive' | 'experience' | 'collection'
  onClose: () => void
}) {
  const [visible, setVisible] = useState(false)
  const info = venueInfo[venue]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className={`relative mx-4 max-w-lg rounded-sm p-8 md:p-10 transition-all duration-500 ${
          visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
        style={{
          backgroundColor: 'rgba(66,55,41,0.92)',
          border: '1px solid rgba(200,168,120,0.35)',
          boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(200,168,120,0.08)',
        }}
      >
        <div
          className="absolute left-0 top-0 h-8 w-8"
          style={{
            borderLeft: '2px solid rgba(200,168,120,0.4)',
            borderTop: '2px solid rgba(200,168,120,0.4)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-8 w-8"
          style={{
            borderRight: '2px solid rgba(200,168,120,0.4)',
            borderBottom: '2px solid rgba(200,168,120,0.4)',
          }}
        />

        <h2
          className="mb-6 text-center text-xl tracking-[0.15em]"
          style={{ color: '#C8A878', fontFamily: 'var(--font-noto-serif)' }}
        >
          {info.title}
        </h2>

        <div
          className="mb-8 space-y-4 text-sm leading-relaxed"
          style={{ color: '#E9E2D5', fontFamily: 'var(--font-noto-sans)', fontWeight: 300 }}
        >
          {info.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="btn-gold group relative cursor-pointer overflow-hidden rounded-sm px-10 py-3 text-sm tracking-[0.2em] transition-all duration-300"
          >
            <span className="relative z-10">了 解</span>
          </button>
        </div>
      </div>
    </div>
  )
}
