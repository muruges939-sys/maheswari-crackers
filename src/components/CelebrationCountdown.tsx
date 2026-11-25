import { useEffect, useState } from 'react'
import { EXPERIENCE } from '../data'

function getCountdown(target: Date) {
  const distance = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor(distance / 3_600_000) % 24,
    minutes: Math.floor(distance / 60_000) % 60,
    seconds: Math.floor(distance / 1000) % 60,
  }
}

export default function CelebrationCountdown() {
  const target = EXPERIENCE.celebrationTargetDate ? new Date(EXPERIENCE.celebrationTargetDate) : null
  const [time, setTime] = useState(() => target && Number.isFinite(target.getTime()) ? getCountdown(target) : null)
  useEffect(() => {
    if (!target || !Number.isFinite(target.getTime())) return
    const timer = window.setInterval(() => setTime(getCountdown(target)), 1000)
    return () => window.clearInterval(timer)
  }, [])
  if (!time) return null

  return <section className="section py-12 text-center" aria-label="Celebration countdown">
    <p className="eyebrow">The next celebration</p>
    <div className="mt-5 flex justify-center gap-3 sm:gap-5">{Object.entries(time).map(([label, value]) => <div key={label} className="glass min-w-[4.5rem] rounded-2xl px-3 py-4 sm:min-w-[6rem]">
      <strong className="block font-display text-2xl text-gold sm:text-3xl">{String(value).padStart(2, '0')}</strong>
      <span className="mt-1 block text-[9px] uppercase tracking-[.18em] text-white/55">{label}</span>
    </div>)}</div>
  </section>
}
