import { useEffect, useRef } from 'react'

export default function FuseProgress() {
  const fill = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const range = document.documentElement.scrollHeight - window.innerHeight
        const progress = range > 0 ? window.scrollY / range : 0
        if (fill.current) fill.current.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="fuse-progress" aria-hidden="true"><div ref={fill} className="fuse-progress-line" /></div>
}
