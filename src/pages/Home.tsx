import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductShowcase from '../components/ProductShowcase'
import AboutSection from '../components/AboutSection'
import Gallery from '../components/Gallery'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import ParticleBackground from '../components/ParticleBackground'
import ExperienceCanvas from '../components/ExperienceCanvas'
import FuseProgress from '../components/FuseProgress'
import CelebrationCountdown from '../components/CelebrationCountdown'
import FireworksSound from '../components/FireworksSound'
import StockPhoto from '../components/StockPhoto'
import { EXPERIENCE, FIREWORKS_PHOTOS } from '../data'
gsap.registerPlugin(ScrollTrigger)
export default function Home() {
  const root = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const [framesReady, setFramesReady] = useState(false)
  const [loaderElapsed, setLoaderElapsed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [launchId, setLaunchId] = useState(0)
  const [exploded, setExploded] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!reducedMotion) {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.from(el, { opacity: 0, y: 50, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => gsap.to(el, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: el.closest('section') || el, scrub: true } }))
        gsap.utils.toArray<HTMLElement>('[data-spark-section]').forEach(el => ScrollTrigger.create({
          trigger: el,
          start: 'top 78%',
          onEnter: () => { el.classList.remove('spark-wipe-active'); void el.offsetWidth; el.classList.add('spark-wipe-active') },
        }))
      }
    }, root)
    const minLoader = window.setTimeout(() => setLoaderElapsed(true), 850)
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 800)
    return () => { clearTimeout(minLoader); clearTimeout(refresh); ctx.revert() }
  }, [reducedMotion])

  useEffect(() => {
    if (!framesReady || !loaderElapsed || started.current) return
    started.current = true
    setLoading(false)
    if (reducedMotion) setExploded(true)
    else setLaunchId(1)
  }, [framesReady, loaderElapsed, reducedMotion])

  const onExplosion = useCallback(() => {
    setExploded(true)
    window.dispatchEvent(new CustomEvent('fireworks-sound', { detail: { kind: 'burst' } }))
  }, [])
  const replay = useCallback(() => {
    if (reducedMotion) return
    setExploded(false)
    setLaunchId(current => current + 1)
  }, [reducedMotion])

  return <div ref={root}>
    <Navbar />
    <FireworksSound />
    <FuseProgress />
    <ExperienceCanvas launchId={launchId} onExplosion={onExplosion} reducedMotion={reducedMotion} />
    <main>
      <Hero launchId={launchId} exploded={exploded} onFramesReady={() => setFramesReady(true)} onReplay={replay} />
      <section data-spark-section className="relative overflow-hidden bg-aurora"><div className="section text-center" data-reveal>
        <p className="eyebrow">Welcome</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl"><span className="gold-text">A showroom where the night sky comes indoors</span></h2></div></section>
      <ProductShowcase /><AboutSection /><Gallery />
      <CelebrationCountdown />
      <section id="finale" data-spark-section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden"><div data-parallax className="absolute inset-0 scale-110"><StockPhoto loading="lazy" src={FIREWORKS_PHOTOS.fireworksIndia} alt="Festival fireworks in the night sky" className="h-full w-full object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" /><ParticleBackground density={1.2} /></section>
      <ContactSection />
    </main>
    <aside className="safety-strip border-y border-gold/15 bg-navy/60 px-5 py-5 text-center text-xs leading-relaxed text-white/65">{EXPERIENCE.safetyText}</aside>
    <Footer />
    {loading && <div className="intro-loader" role="status" aria-label="Preparing celebration visuals">
      <div className="loader-fuse"><span /></div>
      <p className="mt-5 text-[10px] uppercase tracking-[.35em] text-gold">Lighting the first spark</p>
    </div>}
  </div>
}
