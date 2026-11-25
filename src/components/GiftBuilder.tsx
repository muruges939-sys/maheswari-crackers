import { useMemo, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { CATEGORIES, EXPERIENCE, SITE, type Category } from '../data'

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
    <div className="gift-preview-wrap" aria-label={`${total} selected items in the gift box`} role="img">
      <svg viewBox="0 0 360 270" className="gift-preview">
        <defs>
          <linearGradient id="builder-gold" x2="0" y2="1"><stop stopColor="#fff3b0" /><stop offset="1" stopColor="#D4AF37" /></linearGradient>
          <linearGradient id="builder-side" x2="1"><stop stopColor="#32105F" /><stop offset="1" stopColor="#10152D" /></linearGradient>
        </defs>
        <ellipse cx="180" cy="224" rx="110" ry="15" fill="#000" opacity=".45" />
        <g className="gift-preview-box">
          <path d="M75 100h210v120H75z" fill="#32105F" stroke="#D4AF37" strokeWidth="3" />
          <path d="M75 100h35v120H75z" fill="url(#builder-side)" opacity=".8" />
          <path d="M162 101h36v118h-36z" fill="url(#builder-gold)" />
          <path d="M65 82h230v28H65z" fill="url(#builder-gold)" stroke="#fff3b0" strokeWidth="2" className="gift-preview-lid" />
          <path d="M180 83c-45-3-47-45-22-45 21 0 24 26 22 45 4-19 7-45 27-45 25 0 22 42-27 45" fill="none" stroke="#D4AF37" strokeWidth="9" />
          {selected.map((category, index) => {
            const x = 119 + (index % 4) * 34
            const y = 176 - Math.floor(index / 4) * 28
            return <g key={category} className="gift-item" style={{ animationDelay: `${index * 70}ms` }}>
              <circle cx={x} cy={y} r={8 + Math.min(quantities[category], 4)} fill={index % 2 ? '#2764FF' : '#fff3b0'} opacity=".9" />
              <path d={`M${x} ${y - 9}v-9`} stroke="#D4AF37" strokeWidth="2" />
            </g>
          })}
        </g>
      </svg>
      <p className="mt-1 text-center text-xs uppercase tracking-[.25em] text-gold">{total ? `${total} selected item${total === 1 ? '' : 's'}` : 'Your box is ready to fill'}</p>
    </div>
  </section>
}
