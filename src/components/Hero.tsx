import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import FrameAnimation from './FrameAnimation'
import ParticleBackground from './ParticleBackground'
import { goTo } from './Navbar'
type Props = { launchId: number; exploded: boolean; onFramesReady: () => void; onReplay: () => void }
export default function Hero({ launchId, exploded, onFramesReady, onReplay }: Props) {
  const root = useRef<HTMLDivElement>(null), layer = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mv = (e: PointerEvent) => { if (layer.current) layer.current.style.transform = `translate3d(${(e.clientX / innerWidth - .5) * -14}px,${(e.clientY / innerHeight - .5) * -10}px,0)` }
    const mini = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return
      dispatchEvent(new CustomEvent('mini-firework', { detail: { x: e.clientX, y: e.clientY } }))
    }
    addEventListener('pointermove', mv); root.current?.addEventListener('pointerdown', mini)
    return () => { removeEventListener('pointermove', mv); root.current?.removeEventListener('pointerdown', mini) }
  }, [])
  const replay = () => {
    window.dispatchEvent(new CustomEvent('fireworks-sound', { detail: { kind: 'launch' } }))
    onReplay()
  }
  return <section id="home" ref={root} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-midnight">
    <FrameAnimation className="scale-105" onReady={onFramesReady} />
    <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/35 to-midnight" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050509_95%)]" />
    <ParticleBackground />
    <div ref={layer} className="relative z-10 px-5 pt-20 text-center transition-transform duration-300 ease-out">
      <h1 data-h className={`font-display text-5xl font-black leading-[1.02] tracking-[.12em] transition-all duration-700 sm:text-7xl lg:text-8xl ${exploded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}><span className="gold-text block">MAHESWARI</span><span className="gold-text block">CRACKERS</span></h1>
      <p data-h className={`mx-auto mt-8 max-w-2xl text-xs uppercase tracking-[.4em] text-white/90 transition-opacity duration-700 sm:text-sm ${exploded ? 'opacity-100' : 'opacity-0'}`}>Celebrate every moment with sparkling joy</p>
      <p data-h className={`mt-3 font-display text-lg italic text-gold/90 transition-opacity duration-700 sm:text-xl ${exploded ? 'opacity-100' : 'opacity-0'}`}>Where Every Celebration Begins With a Spark.</p>
      <div data-h className={`mt-10 flex flex-col items-center justify-center gap-4 transition-opacity duration-700 sm:flex-row ${exploded ? 'opacity-100' : 'opacity-0'}`}>
        <button className="btn-gold btn-solid" onClick={() => goTo('collections')}>Explore Collection <ArrowRight size={14} /></button>
        <button className="btn-gold" onClick={() => goTo('story')}>Discover Our Story</button>
      </div>
    </div>
    <div className="absolute bottom-7 right-5 z-20 flex items-center gap-2 sm:right-8">
      <button onClick={replay} className="rounded-full border border-gold/40 bg-midnight/60 px-4 py-2 text-[10px] uppercase tracking-[.2em] text-gold transition hover:bg-gold hover:text-midnight">Replay</button>
    </div>
    <div className="absolute bottom-6 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-gold to-transparent" />
  </section>
}
