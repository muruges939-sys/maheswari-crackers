import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NAV } from '../data'
export const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
export default function Navbar() {
  const [open, setOpen] = useState(false), [active, setActive] = useState('home'), [solid, setSolid] = useState(false)
  useEffect(() => {
    const onS = () => setSolid(scrollY > 40); onS(); addEventListener('scroll', onS, { passive: true })
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach(([, id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => { removeEventListener('scroll', onS); io.disconnect() }
  }, [])
  const nav = (id: string) => { setOpen(false); setTimeout(() => goTo(id), open ? 250 : 0) }
  return <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${solid ? 'py-2' : 'py-4'}`}>
    <div className={`mx-3 flex max-w-7xl items-center justify-between rounded-full px-6 py-3 md:mx-auto ${solid ? 'glass' : ''}`}>
      <button onClick={() => nav('home')} className="font-display text-sm font-bold tracking-[.3em] gold-text md:text-base">MAHESWARI CRACKERS</button>
      <nav className="hidden gap-8 lg:flex">{NAV.map(([l, id]) => <button key={id} onClick={() => nav(id)} className={`group relative py-1 text-xs uppercase tracking-[.25em] transition-colors ${active === id ? 'text-gold' : 'text-white/75 hover:text-white'}`}>
        {l}<span className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ${active === id ? 'w-full' : 'w-0 group-hover:w-full'}`} /></button>)}</nav>
      <button aria-label="Menu" className="text-gold lg:hidden" onClick={() => setOpen(o => !o)}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="glass mx-3 mt-2 rounded-3xl p-6 lg:hidden">
      {NAV.map(([l, id]) => <button key={id} onClick={() => nav(id)} className="block w-full py-3 text-left font-display text-lg tracking-widest text-white/90 hover:text-gold">{l}</button>)}</motion.div>}</AnimatePresence>
  </header>
}
