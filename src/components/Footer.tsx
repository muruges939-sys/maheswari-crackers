import { SITE } from '../data'
export default function Footer() {
  return <footer className="relative overflow-hidden border-t border-gold/20 bg-midnight px-5 py-16 text-center">
    <div className="relative mx-auto max-w-4xl">
      <h2 className="font-display text-3xl font-black tracking-[.2em] gold-text sm:text-5xl">{SITE.name}</h2>
      <p className="mt-3 text-xs uppercase tracking-[.4em] text-white/70">Celebrate every moment with sparkling joy</p>
      <p className="mx-auto mt-10 max-w-2xl text-xs leading-relaxed text-white/40">Catalogue and enquiries only – no online payment or checkout. Sale, storage and use of fireworks are subject to applicable Indian laws, licensing requirements and local restrictions. © {new Date().getFullYear()} {SITE.name}.</p>
    </div></footer>
}
