import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { GALLERY } from '../data'
import StockPhoto from './StockPhoto'
export default function Gallery() {
  const [sel, setSel] = useState<number | null>(null)
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setSel(null) }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  return <section id="gallery" data-spark-section className="section">
    <div data-reveal><p className="eyebrow">Gallery</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl"><span className="gold-text">Moments of light</span></h2></div>
    <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">{GALLERY.map((g, i) => <button key={i} data-reveal onClick={() => setSel(i)} className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 hover:border-gold/60">
      <StockPhoto loading="lazy" src={g.src} alt={g.cap} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="w-full transition-transform duration-700 group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/90 to-transparent p-4 text-left text-xs uppercase tracking-widest text-gold opacity-0 transition-opacity group-hover:opacity-100">{g.cap}</span></button>)}</div>
    {sel !== null && <div role="dialog" aria-modal className="fixed inset-0 z-[60] flex items-center justify-center bg-midnight/95 p-4" onClick={() => setSel(null)}>
      <button aria-label="Close" className="absolute right-5 top-5 text-gold"><X size={28} /></button>
      <StockPhoto src={GALLERY[sel].src} alt={GALLERY[sel].cap} loading="eager" className="max-h-[88vh] max-w-full rounded-xl shadow-[0_0_80px_rgba(212,175,55,.25)]" onClick={e => e.stopPropagation()} /></div>}
  </section>
}
