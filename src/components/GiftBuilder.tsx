import { useMemo, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { CATEGORIES, EXPERIENCE, FIREWORKS_PHOTOS, SITE, type Category } from '../data'
import StockPhoto from './StockPhoto'

export default function GiftBuilder() {
  const [quantities, setQuantities] = useState<Record<Category, number>>(() =>
    Object.fromEntries(CATEGORIES.map(category => [category, 0])) as Record<Category, number>,
  )
  const selected = useMemo(() => CATEGORIES.filter(category => quantities[category] > 0), [quantities])
  const total = selected.reduce((sum, category) => sum + quantities[category], 0)
  const message = `${EXPERIENCE.giftBuilderMessage}\n${selected.map(category => `• ${category}: ${quantities[category]}`).join('\n')}`

  const updateQuantity = (category: Category, value: string) => {
    const quantity = Number.parseInt(value, 10)
    setQuantities(current => ({ ...current, [category]: Number.isFinite(quantity) && quantity > 0 ? quantity : 0 }))
  }

  return <section className="gift-builder glass mt-14 grid items-center gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_.8fr]">
    <div>
      <p className="eyebrow">A thoughtful selection</p>
      <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">{EXPERIENCE.giftBuilderTitle}</h3>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60">{EXPERIENCE.giftBuilderDescription}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map(category => <label key={category} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-midnight/40 px-4 py-3 text-sm text-white/80">
          <span>{category}</span>
          <input aria-label={`${category} quantity`} type="number" min="0" inputMode="numeric" value={quantities[category] || ''} placeholder="0" onChange={event => updateQuantity(category, event.target.value)} className="field !w-20 !px-2 !py-2 text-center" />
        </label>)}
      </div>
      <a className={`btn-gold btn-solid mt-6 ${total === 0 ? 'pointer-events-none opacity-50' : ''}`} href={total ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}` : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={total === 0}>
        <MessageCircle size={15} />Send selection on WhatsApp
      </a>
    </div>
    <div className="gift-preview-wrap" aria-label={`${total} selected items in the gift box`}>
      <StockPhoto
        src={FIREWORKS_PHOTOS.giftBox}
        alt="Gift packaging stock photo for inspiration, not a Maheswari product"
        className="gift-preview h-full object-cover"
        sizes="(min-width: 1024px) 32vw, 100vw"
      />
      <p className="mt-1 text-center text-xs uppercase tracking-[.25em] text-gold">{total ? `${total} selected item${total === 1 ? '' : 's'}` : 'Your box is ready to fill'}</p>
    </div>
  </section>
}
