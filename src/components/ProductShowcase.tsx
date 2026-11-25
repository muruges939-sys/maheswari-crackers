import { lazy, Suspense, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { CATEGORIES, FIREWORKS_PHOTOS, PRODUCTS } from '../data'
import ProductCard from './ProductCard'
import GiftBuilder from './GiftBuilder'
import StockPhoto from './StockPhoto'
const ProductModel = lazy(() => import('../three/ProductModel'))
export default function ProductShowcase() {
  const [cat, setCat] = useState<string>('All'), [q, setQ] = useState('')
  const list = useMemo(() => PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && (p.name + p.description + p.category).toLowerCase().includes(q.toLowerCase().trim())), [cat, q])
  return <section id="collections" data-spark-section className="relative bg-gradient-to-b from-midnight via-navy/40 to-midnight">
    <div className="section">
      <div className="grid items-center gap-8 lg:grid-cols-2" data-reveal>
        <div><p className="eyebrow">The Showroom</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl"><span className="gold-text">Crafted to be unwrapped</span></h2>
          <p className="mt-5 max-w-md text-white/65">Browse the collection and send an enquiry for anything that catches your eye. Move your cursor over the box to tilt it.</p></div>
        <div className="h-[320px] sm:h-[420px]"><Suspense fallback={<StockPhoto src={FIREWORKS_PHOTOS.giftBox} alt="Gift packaging inspiration" className="h-full w-full object-contain" />}><ProductModel /></Suspense></div>
      </div>
      <div className="mt-16 flex flex-col gap-5" data-reveal>
        <div className="relative max-w-md"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" /><input aria-label="Search products" value={q} onChange={e => setQ(e.target.value)} placeholder="Search products…" className="field !pl-11" /></div>
        <div className="flex flex-wrap gap-2">{['All', ...CATEGORIES].map(c => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-all ${cat === c ? 'border-gold bg-gold text-midnight' : 'border-white/15 text-white/70 hover:border-gold hover:text-gold'}`}>{c}</button>)}</div>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map(p => <div key={p.id} data-reveal><ProductCard p={p} /></div>)}</div>
      {!list.length && <p className="mt-16 text-center text-white/50">No products match your search.</p>}
      <GiftBuilder />
    </div>
  </section>
}
