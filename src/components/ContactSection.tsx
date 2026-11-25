import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube, Send } from 'lucide-react'
import { SITE } from '../data'
import { goTo } from './Navbar'
type Key = 'name' | 'phone' | 'email' | 'message'
type Errs = Partial<Record<Key, string>>
const SOCIALS = [{ I: Instagram, h: SITE.socials.instagram, l: 'Instagram' }, { I: Facebook, h: SITE.socials.facebook, l: 'Facebook' }, { I: Youtube, h: SITE.socials.youtube, l: 'YouTube' }]
export default function ContactSection() {
  const [f, setF] = useState<Record<Key, string>>({ name: '', phone: '', email: '', message: '' }), [err, setErr] = useState<Errs>({}), [sent, setSent] = useState(false)
  useEffect(() => { const h = (e: Event) => { setF(s => ({ ...s, message: `Hello, I'd like to enquire about: ${(e as CustomEvent).detail}.` })); setSent(false); goTo('contact') }
    addEventListener('enquire', h); return () => removeEventListener('enquire', h) }, [])
  const validate = () => { const e: Errs = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[+]?[\d\s-]{10,15}$/.test(f.phone.trim())) e.phone = 'Enter a valid phone number (10–15 digits).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
    if (f.message.trim().length < 10) e.message = 'Message should be at least 10 characters.'
    setErr(e); return !Object.keys(e).length }
  const wa = (t: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`
  const submit = (ev: React.FormEvent) => { ev.preventDefault(); if (!validate()) return
    // No backend yet: sends the enquiry via WhatsApp. Swap for an API call when you have one.
    window.open(wa(`Enquiry from ${f.name} (${f.phone}, ${f.email}): ${f.message}`), '_blank', 'noopener'); setSent(true) }
  const inp = (k: Key, label: string, type = 'text') => <label className="block"><span className="mb-1.5 block text-xs uppercase tracking-widest text-white/60">{label}</span>
    {k === 'message' ? <textarea rows={4} className="field" value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /> : <input type={type} className="field" value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} />}
    {err[k] && <span className="mt-1 block text-xs text-red-400">{err[k]}</span>}</label>
  return <section id="contact" data-spark-section className="relative bg-aurora"><div className="section grid gap-12 lg:grid-cols-2">
    <div data-reveal><p className="eyebrow">Contact & Enquiry</p><h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl"><span className="gold-text">Let's plan your celebration</span></h2>
      <ul className="mt-10 space-y-5 text-white/80">
        <li className="flex gap-4"><Phone className="text-gold" size={20} /><a href={`tel:${SITE.phone.replace(/\s/g, '')}`}>{SITE.phone}</a></li>
        <li className="flex gap-4"><Mail className="text-gold" size={20} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        <li className="flex gap-4"><MapPin className="text-gold" size={20} /><span>{SITE.address}</span></li></ul>
      <a className="btn-gold btn-solid mt-8" href={wa('Hello Maheswari Crackers, I would like to make an enquiry.')} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />WhatsApp Enquiry</a>
      <div className="mt-8 flex gap-3">{SOCIALS.map(({ I, h, l }) => <a key={l} aria-label={l} href={h} target="_blank" rel="noopener noreferrer" className="glass rounded-full p-3 text-gold transition hover:bg-gold hover:text-midnight"><I size={18} /></a>)}</div>
    </div>
    <form data-reveal onSubmit={submit} noValidate className="glass space-y-5 rounded-3xl p-8">
      {inp('name', 'Name')}{inp('phone', 'Phone', 'tel')}{inp('email', 'Email', 'email')}{inp('message', 'Message')}
      <button className="btn-gold btn-solid w-full justify-center" type="submit"><Send size={14} />Send Enquiry</button>
      {sent && <p className="text-center text-sm text-gold">Opening WhatsApp with your enquiry…</p>}
    </form></div></section>
}
