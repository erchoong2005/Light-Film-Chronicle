'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [showNotice, setShowNotice] = useState(false);
  const [titleIn, setTitleIn] = useState(false);
  const [subIn, setSubIn] = useState(false);
  const [textIn, setTextIn] = useState(false);
  const [btnIn, setBtnIn] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem('film-heritage-agreed');
    if (agreed) {
      setTitleIn(true);
      setSubIn(true);
      setTextIn(true);
      setBtnIn(true);
    } else {
      setTimeout(() => setTitleIn(true), 400);
      setTimeout(() => setSubIn(true), 1200);
      setTimeout(() => setTextIn(true), 2000);
      setTimeout(() => setBtnIn(true), 3000);
      const timer = setTimeout(() => setShowNotice(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('film-heritage-agreed', '1');
    setShowNotice(false);
    setTitleIn(true);
    setSubIn(true);
    setTextIn(true);
    setBtnIn(true);
  };

  const handleEnter = () => {
    router.push('/hub');
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#2E261C' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/1【总页面背景图】.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(46,38,28,0.55)' }} />

      {/* Film grain overlay */}
      <div className="pointer-events-none absolute inset-0 film-grain opacity-40" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Title block */}
        <div className="text-center">
          <h1
            className={`text-gold-glow mb-2 font-serif text-6xl font-black tracking-[0.15em] md:text-8xl lg:text-9xl transition-all duration-1500 ease-out ${
              titleIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              color: '#C8A878',
              fontFamily: 'var(--font-noto-serif)',
              textShadow: '0 0 40px rgba(200,168,120,0.35), 0 0 80px rgba(200,168,120,0.15)',
            }}
          >
            光影纪年
          </h1>
          <p
            className={`mb-6 text-lg tracking-[0.3em] md:text-xl transition-all duration-1000 ease-out ${
              subIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ color: '#B8AFA0', fontFamily: 'var(--font-noto-sans)' }}
          >
            中国电影发展史研学平台
          </p>

          {/* Decorative divider */}
          <div
            className={`mx-auto mb-8 flex items-center justify-center gap-3 transition-all duration-1000 ease-out ${
              textIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.4)' }} />
            <span
              className="block h-1.5 w-1.5 rotate-45"
              style={{ backgroundColor: '#C8A878' }}
            />
            <span className="block h-px w-12" style={{ backgroundColor: 'rgba(200,168,120,0.4)' }} />
          </div>

          {/* Preface text */}
          <p
            className={`mx-auto max-w-2xl text-sm leading-relaxed md:text-base transition-all duration-1000 ease-out ${
              textIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{
              color: '#B8AFA0',
              fontFamily: 'var(--font-noto-sans)',
              fontWeight: 300,
            }}
          >
            当胶片转动，光影便开始书写历史。从1905年《定军山》的第一声锣鼓，到新世纪中国电影的百花齐放——
            一条由胶片卷成的时间长河，串联起七个时代的银幕记忆。推开这扇门，你将踏入一段横跨百年的光影旅程，
            亲手触摸那些定格在胶片上的中国故事。
          </p>

          {/* Enter button */}
          <div
            className={`mt-12 transition-all duration-1000 ease-out ${
              btnIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <button
              onClick={handleEnter}
              className="btn-gold group relative cursor-pointer overflow-hidden rounded-sm px-14 py-4 text-lg tracking-[0.2em] transition-all duration-300"
              style={{
                backgroundColor: '#3A3024',
                border: '1px solid #C8A878',
                color: '#C8A878',
                fontFamily: 'var(--font-noto-serif)',
                animation: 'goldPulse 3s ease-in-out infinite',
              }}
            >
              <span className="relative z-10">进 入</span>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,168,120,0.15), rgba(200,168,120,0.05))',
                  boxShadow: '0 0 30px rgba(200,168,120,0.3), inset 0 0 30px rgba(200,168,120,0.1)',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Keyframes for gold pulse */}
      <style jsx>{`
        @keyframes goldPulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(200,168,120,0.15);
          }
          50% {
            box-shadow: 0 0 24px rgba(200,168,120,0.35), 0 0 48px rgba(200,168,120,0.1);
          }
        }
      `}</style>

      {/* Notice modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          showNotice ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        {/* Modal decorative background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: "url('/images/2【总页面背景图】可以往前推进去进入板块页面.png')",
          }}
        />

        <div
          className={`relative mx-4 max-w-lg rounded-sm p-8 md:p-10 transition-all duration-300 ${
            showNotice ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
          }`}
          style={{
            backgroundColor: 'rgba(66,55,41,0.92)',
            border: '1px solid rgba(200,168,120,0.35)',
            boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(200,168,120,0.08)',
          }}
        >
          {/* Close corner decoration */}
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
            须 知
          </h2>

          <div
            className="mb-6 space-y-3 text-xs leading-relaxed"
            style={{ color: '#E9E2D5', fontFamily: 'var(--font-noto-sans)', fontWeight: 300 }}
          >
            <p>
              本站专注百年电影文化溯源与轻量化趣味研学，主打轻松沉浸式光影互动体验，无繁琐规则、无硬性考核。平台依托中国电影百年发展七大时代脉络，精选34部时代标杆影片搭建全套研学体系，包含7部主线闯关影片、27部补充档案影片，以核心影片带时代全貌，轻量化品读百年影视迭代历程，兼顾趣味性与科普性。
            </p>
            <p>
              1. 全站内容依托七大影视时代搭建，覆盖从萌芽初创到全媒体新时代的完整发展脉络，兼具史料性、观赏性与互动性，仅作科普研学使用，不囊括所有影视史料。
            </p>
            <p>
              2. 网站搭载专属光影场记单核心体系，是专属用户的影视研学台账与荣誉存档载体，全程自动记录影片阅览、主线闯关、知识研习、藏品解锁的全部成长轨迹，所有研学进度永久留存、可随时复盘查看。
            </p>
            <p>
              3. 影片阅览、剧情闯关、知识答题均无时限约束，可从容品读、循序渐进研学，无竞速考核、无排名压力。
            </p>
            <p>
              4. 配套习题贴合影片剧情、艺术风格与时代背景，重在温故知新，无晦涩难题，辅助巩固观影认知。
            </p>
            <p>
              5. 所有阅览归档、片场闯关、知识研习记录，均会实时同步至光影场记单，逐步解锁各时代专属成就与限定典藏藏品，完整记录专属个人的光影研学成长轨迹。
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAgree}
              className="btn-gold group relative cursor-pointer overflow-hidden rounded-sm px-10 py-3 text-sm tracking-[0.2em] transition-all duration-300"
              style={{
                backgroundColor: '#3A3024',
                border: '1px solid #C8A878',
                color: '#C8A878',
                fontFamily: 'var(--font-noto-serif)',
              }}
            >
              <span className="relative z-10">我已阅读，进入平台</span>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,168,120,0.15), rgba(200,168,120,0.05))',
                  boxShadow: '0 0 30px rgba(200,168,120,0.3), inset 0 0 30px rgba(200,168,120,0.1)',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
