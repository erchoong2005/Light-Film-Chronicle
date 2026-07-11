'use client'

import Image from 'next/image'

interface NoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="modal-content relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#EBE3D5' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image
            src="/images/2【总页面背景图】可以往前推进去进入板块页面.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative p-8">
          <h2 className="font-serif text-2xl font-bold text-center mb-2" style={{ color: '#2C241C' }}>
            📜 平台阅览须知
          </h2>

          <div className="film-strip my-4" />

          <div className="space-y-4 text-sm leading-relaxed font-sans" style={{ color: '#2C241C' }}>
            <p className="font-medium text-center">
              欢迎来到「光影纪年·中国电影发展史研学平台」！
            </p>
            <p>
              本平台以中国电影百年发展史为脉络，精心遴选<strong>7大发展时代</strong>、
              <strong>34部</strong>极具时代代表性的经典影片，搭建沉浸式电影文化互动研学体系，
              带您亲历中国电影从无声黑白到全媒体时代的百年征程。
            </p>

            <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#F6F2E9' }}>
              <p className="font-medium" style={{ color: '#C8A878' }}>
                ▸ 平台三大核心板块：
              </p>
              <ul className="space-y-1.5 text-sm pl-1">
                <li>🎬 <strong>资料馆</strong> — 阅览百年影史经典影片资料、时代背景与获奖记录</li>
                <li>🎥 <strong>体验馆</strong> — 沉浸式闯关互动，亲历不同电影时代的片场拍摄任务</li>
                <li>🏆 <strong>藏品馆</strong> — 收集七大时代专属藏品，点亮终极荣誉图鉴</li>
              </ul>
            </div>

            <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#F6F2E9' }}>
              <p className="font-medium" style={{ color: '#C8A878' }}>
                ▸ 学习成长路径：
              </p>
              <p className="text-sm pl-1">
                通过<strong>阅览影片资料</strong>、<strong>完成知识答题</strong>、
                <strong>挑战时代闯关</strong>，您将逐步解锁七大时代藏品，
                提升专属身份铭牌等级——从「影迷见习」一路晋升为「百年光影大师」。
              </p>
            </div>

            <p className="text-xs opacity-60 text-center pt-1">
              本平台为电影文化教育研学资源，所有影片资料仅供学习交流使用。
            </p>
          </div>

          <div className="film-strip my-5" />

          <button
            onClick={onClose}
            className="btn-retro w-full font-serif text-base tracking-wide"
          >
            我已阅读，进入平台
          </button>
        </div>
      </div>
    </div>
  )
}
