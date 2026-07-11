'use client'

import { useRouter } from 'next/navigation'

export default function TimesheetButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/timesheet')}
      className="fixed top-5 right-5 z-50 flex flex-col items-center cursor-pointer group"
      style={{
        background: 'rgba(26,22,18,0.92)',
        border: '1.5px solid rgba(200,168,120,0.55)',
        borderRadius: '4px',
        padding: '6px 10px',
        boxShadow: '0 0 10px rgba(200,168,120,0.12)',
        transition: 'all 300ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,168,120,0.25)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 0 10px rgba(200,168,120,0.12)'
      }}
    >
      {/* Clapperboard icon */}
      <div className="relative flex-shrink-0" style={{ width: 28, height: 26 }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 2, width: 24, height: 14,
          background: '#1a1612', border: '1px solid rgba(200,168,120,0.4)', borderRadius: '1px',
        }} />
        <div style={{
          position: 'absolute', top: 3, left: 2, width: 24, height: 9,
          background: 'repeating-linear-gradient(90deg, #1a1612 0px, #1a1612 4px, #E9E2D5 4px, #E9E2D5 8px)',
          border: '1px solid rgba(200,168,120,0.4)', borderRadius: '1px 1px 0 0',
          transformOrigin: 'bottom left', transform: 'skewX(-8deg)',
        }} />
      </div>
      {/* Text below */}
      <span
        className="font-serif text-[9px] font-bold tracking-wider mt-1 whitespace-nowrap"
        style={{ color: '#C8A878' }}
      >
        光影场记单
      </span>
    </button>
  )
}
