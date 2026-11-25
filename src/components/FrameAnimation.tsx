import { useRef, useState } from 'react'
import { useFrameAnimation } from '../hooks/useFrameAnimation'
import { FRAME_COUNT } from '../data'
export default function FrameAnimation({ className = '', onReady }: { className?: string; onReady?: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null); const [ok, setOk] = useState(false)
  useFrameAnimation(ref, { count: FRAME_COUNT, fps: 10, holdFrames: 15, onReady: () => { setOk(true); onReady?.() } })
  return <canvas ref={ref} aria-hidden className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ok ? 'opacity-100' : 'opacity-0'} ${className}`} />
}
