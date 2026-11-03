'use client'

import { REPLAY_EVENT } from '@/components/RecordIntro'

// Spielt das Platten-Intro erneut ab
export default function IntroButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0 })
        window.dispatchEvent(new Event(REPLAY_EVENT))
      }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9.5" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      </svg>
      <span className="link">Intro ansehen</span>
    </button>
  )
}
