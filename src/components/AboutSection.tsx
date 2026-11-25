import { ABOUT } from '../data'
import { FIREWORKS_PHOTOS } from '../data'
import StockPhoto from './StockPhoto'
export default function AboutSection() {
  return <>
    <section id="about" data-spark-section className="bg-aurora"><div className="section">
      <div data-reveal className="max-w-3xl"><p className="eyebrow">About Us</p><h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl"><span className="gold-text">MORE THAN FIREWORKS.<br />IT'S A CELEBRATION.</span></h2></div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">{ABOUT.map((a, i) => <div key={a.t} data-reveal className="glass rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_0_40px_rgba(212,175,55,.18)]">
        <span className="font-display text-5xl text-gold/25">0{i + 1}</span><h3 className="mt-2 font-display text-2xl text-white">{a.t}</h3><p className="mt-3 text-white/60">{a.d}</p></div>)}</div>
    </div></section>
    <section id="story" data-spark-section className="relative overflow-hidden">
      <div className="story-parallax absolute inset-0">
        <StockPhoto loading="lazy" data-parallax src={FIREWORKS_PHOTOS.fireworks} alt="Fireworks display" className="story-frame story-frame-one" />
        <StockPhoto loading="lazy" data-parallax src={FIREWORKS_PHOTOS.sparkler} alt="Sparks from a handheld sparkler" className="story-frame story-frame-two" />
        <StockPhoto loading="lazy" data-parallax src={FIREWORKS_PHOTOS.fireworksNight} alt="Fireworks at night" className="story-frame story-frame-three" />
        <StockPhoto loading="lazy" data-parallax src={FIREWORKS_PHOTOS.fireworksIndia} alt="Festival fireworks" className="story-frame story-frame-four" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/60 to-midnight" />
      </div>
      <div className="section relative text-center" data-reveal><p className="eyebrow">Our Story</p><h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold sm:text-5xl"><span className="gold-text">Where every celebration begins with a spark</span></h2>
        <p className="mx-auto mt-6 max-w-2xl text-white/70">Placeholder – replace with your brand's real story, founding year and values. Nothing here is a claim about the business.</p></div>
    </section>
  </>
}
