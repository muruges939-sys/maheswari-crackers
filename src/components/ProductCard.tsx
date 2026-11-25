import { useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { FIREWORKS_PHOTOS, type Category, type Product } from '../data'
import StockPhoto from './StockPhoto'

const categoryPhotos: Record<Category, string> = {
  Sparklers: FIREWORKS_PHOTOS.sparkler,
  'Flower Pots': FIREWORKS_PHOTOS.fireworks,
  'Ground Chakkars': FIREWORKS_PHOTOS.fireworksNight,
  Rockets: FIREWORKS_PHOTOS.fireworksIndia,
  Fountains: FIREWORKS_PHOTOS.fireworksNight,
  'Gift Boxes': FIREWORKS_PHOTOS.giftBox,
  'Celebration Collections': FIREWORKS_PHOTOS.festival,
}

export default function ProductCard({ p }: { p: Product }) {
  const el = useRef<HTMLDivElement>(null)
  const move = (e: React.MouseEvent) => { const r = el.current!.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
    el.current!.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)` }
  const leave = () => { el.current!.style.transform = '' }
  return <div ref={el} data-product-card data-category={p.category} onMouseMove={move} onMouseLeave={leave} className="group glass overflow-hidden rounded-3xl transition-[transform,box-shadow,border-color] duration-300 hover:border-gold/60 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,.9),0_0_45px_rgba(212,175,55,.25)]">
    <div className={`category-window relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-royal via-navy to-midnight ${p.category === 'Rockets' ? 'rocket-landing-window' : ''}`} data-landing-slot={p.category === 'Rockets' ? '' : undefined}>
      <StockPhoto
        loading="lazy"
        src={p.image || categoryPhotos[p.category]}
        alt={`Stock photo illustrating ${p.category}; not an actual Maheswari product photograph`}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <span className="absolute left-3 top-3 rounded-full bg-midnight/70 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">{p.category}</span>
    </div>
    <div className="p-6">
      <h3 className="landing-label font-display text-xl text-white">{p.name}</h3>
      <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-white/60">{p.description}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gold">{p.price || 'Price on enquiry'}</span>
        <button className="btn-gold !px-4 !py-2.5 !text-[10px]" onClick={() => dispatchEvent(new CustomEvent('enquire', { detail: p.name }))}><MessageCircle size={13} />Enquire</button>
      </div>
    </div>
  </div>
}
