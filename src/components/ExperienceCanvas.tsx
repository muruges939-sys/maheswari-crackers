import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Point = { x: number; y: number }
type Spark = { angle: number; speed: number; color: string; size: number }
type Burst = { x: number; y: number; started: number; particles: Spark[] }

const COLORS = ['#D4AF37', '#fff3b0', '#32105F', '#2764FF', '#ffffff']
const ease = (n: number) => n * n * (3 - 2 * n)

function rocket(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, exhaust: boolean) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.scale(scale, scale)
  if (exhaust) {
    const flame = ctx.createLinearGradient(0, 15, 0, 55)
    flame.addColorStop(0, 'rgba(255,243,176,.85)')
    flame.addColorStop(1, 'rgba(212,175,55,0)')
    ctx.fillStyle = flame
    ctx.beginPath()
    ctx.moveTo(-7, 17)
    ctx.quadraticCurveTo(0, 52, 7, 17)
    ctx.fill()
  }
  const body = ctx.createLinearGradient(-9, 0, 9, 0)
  body.addColorStop(0, '#32105F')
  body.addColorStop(.5, '#a98b3a')
  body.addColorStop(1, '#32105F')
  ctx.fillStyle = body
  ctx.strokeStyle = '#fff3b0'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, -27)
  ctx.quadraticCurveTo(12, -14, 9, 13)
  ctx.lineTo(-9, 13)
  ctx.quadraticCurveTo(-12, -14, 0, -27)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#2764FF'
  ctx.beginPath()
  ctx.moveTo(-8, 8)
  ctx.lineTo(-18, 19)
  ctx.lineTo(-8, 17)
  ctx.moveTo(8, 8)
  ctx.lineTo(18, 19)
  ctx.lineTo(8, 17)
  ctx.fill()
  ctx.fillStyle = '#fff3b0'
  ctx.beginPath()
  ctx.arc(0, -4, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function makeBurst(x: number, y: number, started: number, count: number, pool: Spark[]): Burst {
  return {
    x, y, started,
    particles: Array.from({ length: count }, (_, i) => {
      const particle = pool.pop() || { angle: 0, speed: 0, color: '', size: 0 }
      particle.angle = (i / count) * Math.PI * 2 + Math.random() * .08
      particle.speed = 55 + Math.random() * 175
      particle.color = COLORS[i % COLORS.length]
      particle.size = 1 + Math.random() * 2.8
      return particle
    }),
  }
}

export default function ExperienceCanvas({ launchId, onExplosion, reducedMotion = false }: { launchId: number; onExplosion: () => void; reducedMotion?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const launchRef = useRef(launchId)
  const progressRef = useRef(0)
  const burstRef = useRef<Burst[]>([])
  const particlePoolRef = useRef<Spark[]>([])
  const heroT = useRef({ value: 0 })
  const heroActive = useRef(false)
  const travelActive = useRef(false)
  const frameRef = useRef(0)
  const drawRef = useRef<() => void>(() => undefined)
  const requestLoopRef = useRef<() => void>(() => undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let width = 0
    let height = 0
    let dpr = 1
    let travel: ScrollTrigger | undefined
    let lastCursorAt = 0
    if (!particlePoolRef.current.length) {
      particlePoolRef.current = Array.from({ length: 900 }, () => ({ angle: 0, speed: 0, color: '', size: 0 }))
    }
    const addBurst = (x: number, y: number, count: number) => {
      if (burstRef.current.length >= 10) {
        const oldest = burstRef.current.shift()
        if (oldest) particlePoolRef.current.push(...oldest.particles)
      }
      burstRef.current.push(makeBurst(x, y, performance.now(), count, particlePoolRef.current))
    }
    const cursor: { x: number; y: number; at: number }[] = []
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawRef.current()
      ScrollTrigger.refresh()
    }

    const draw = (now = performance.now()) => {
      context.clearRect(0, 0, width, height)
      const heroProgress = heroT.current.value
      if (reducedMotion) {
        const home = document.querySelector<HTMLElement>('#home')
        const bounds = home?.getBoundingClientRect()
        if (bounds && bounds.bottom > 0 && bounds.top < height) {
          const x = width * .5
          const y = height * .32
          context.strokeStyle = 'rgba(212,175,55,.8)'
          context.lineWidth = 2
          for (let i = 0; i < 16; i++) {
            const angle = i * Math.PI / 8
            context.beginPath()
            context.moveTo(x + Math.cos(angle) * 24, y + Math.sin(angle) * 24)
            context.lineTo(x + Math.cos(angle) * (i % 2 ? 42 : 62), y + Math.sin(angle) * (i % 2 ? 42 : 62))
            context.stroke()
          }
          context.beginPath()
          context.arc(x, y, 15, 0, Math.PI * 2)
          context.fillStyle = 'rgba(255,243,176,.9)'
          context.fill()
        }
        return
      }
      if (heroActive.current) {
        const x = width * .5 + Math.sin(heroProgress * Math.PI) * width * .035
        const y = height * (.82 - ease(heroProgress) * .52)
        context.save()
        context.globalAlpha = Math.max(.15, 1 - heroProgress * .15)
        context.strokeStyle = 'rgba(212,175,55,.52)'
        context.lineWidth = 2
        context.beginPath()
        context.moveTo(x, y + 34)
        context.quadraticCurveTo(x + 16, y + 90, x - 5, y + 170)
        context.stroke()
        rocket(context, x, y, -.12, 1.2, true)
        context.restore()
      } else if (!travelActive.current && launchRef.current > 0) {
        rocket(context, width * .5, height * .77, 0, .86, false)
      }

      if (travelActive.current) {
        const slot = document.querySelector<HTMLElement>('[data-landing-slot]')
        const target = slot?.getBoundingClientRect()
        if (slot && target) {
          const end = { x: target.left + target.width / 2, y: target.top + target.height / 2 }
          const start = { x: width * .5, y: -height * .24 }
          const p = progressRef.current
          const c1 = { x: width * (.27 + .05 * Math.sin(p * Math.PI)), y: height * .22 }
          const c2 = { x: end.x + width * .22, y: end.y - height * .3 }
          const q = 1 - p
          const x = q ** 3 * start.x + 3 * q ** 2 * p * c1.x + 3 * q * p ** 2 * c2.x + p ** 3 * end.x
          const y = q ** 3 * start.y + 3 * q ** 2 * p * c1.y + 3 * q * p ** 2 * c2.y + p ** 3 * end.y
          const dx = 3 * q ** 2 * (c1.x - start.x) + 6 * q * p * (c2.x - c1.x) + 3 * p ** 2 * (end.x - c2.x)
          const dy = 3 * q ** 2 * (c1.y - start.y) + 6 * q * p * (c2.y - c1.y) + 3 * p ** 2 * (end.y - c2.y)
          const rotation = p > .94 ? 0 : Math.atan2(dx, -dy)
          context.save()
          context.globalAlpha = Math.min(1, .2 + p * 3)
          context.strokeStyle = 'rgba(212,175,55,.3)'
          context.lineWidth = 2
          context.beginPath()
          context.moveTo(x - dx * .035, y - dy * .035)
          context.quadraticCurveTo(x - dx * .12 - 8, y - dy * .12 - 10, x - dx * .22, y - dy * .22)
          context.stroke()
          rocket(context, x, y, rotation, p > .97 ? .72 : .85, p < .995)
          context.restore()
          if (p > .995) {
            const card = slot.closest<HTMLElement>('[data-product-card]')
            if (card && !card.classList.contains('is-landed')) {
              card.classList.add('is-landed')
              addBurst(end.x, end.y, window.innerWidth < 768 ? 12 : 24)
              window.dispatchEvent(new CustomEvent('fireworks-sound', { detail: { kind: 'pop' } }))
              requestLoopRef.current()
            }
          } else {
            document.querySelector('[data-product-card].is-landed')?.classList.remove('is-landed')
          }
        }
      } else {
        document.querySelector('[data-product-card].is-landed')?.classList.remove('is-landed')
      }

      const liveBursts: Burst[] = []
      burstRef.current.forEach(burst => {
        if (now - burst.started >= 1350) {
          particlePoolRef.current.push(...burst.particles)
          return
        }
        liveBursts.push(burst)
        const age = (now - burst.started) / 1000
        burst.particles.forEach(particle => {
          const x = burst.x + Math.cos(particle.angle) * particle.speed * age
          const y = burst.y + Math.sin(particle.angle) * particle.speed * age + 105 * age * age
          context.globalAlpha = Math.max(0, 1 - age / 1.35)
          context.fillStyle = particle.color
          context.shadowColor = particle.color
          context.shadowBlur = 10
          context.beginPath()
          context.arc(x, y, particle.size, 0, Math.PI * 2)
          context.fill()
        })
        burstRef.current = liveBursts
      })
      context.globalAlpha = 1
      context.shadowBlur = 0
      for (let i = cursor.length - 1; i >= 0; i--) {
        const spark = cursor[i]
        const age = now - spark.at
        if (age > 600) { cursor.splice(i, 1); continue }
        context.globalAlpha = 1 - age / 600
        context.fillStyle = '#D4AF37'
        context.beginPath()
        context.arc(spark.x, spark.y, Math.max(0.5, 2.5 * (1 - age / 600)), 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }
    drawRef.current = draw

    const animate = () => {
      frameRef.current = 0
      if (document.hidden) return
      const now = performance.now()
      draw(now)
      const hasBurst = burstRef.current.some(burst => now - burst.started < 1350)
      if (heroActive.current || hasBurst || cursor.length) frameRef.current = requestAnimationFrame(animate)
    }
    const requestDraw = () => {
      if (!frameRef.current && !document.hidden) frameRef.current = requestAnimationFrame(animate)
    }
    requestLoopRef.current = requestDraw
    drawRef.current = draw

    const onMini = (event: Event) => {
      const { x, y } = (event as CustomEvent<Point>).detail
      addBurst(x, y, window.innerWidth < 768 ? 28 : 48)
      requestDraw()
    }
    const onPointer = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      if (performance.now() - lastCursorAt < 50) return
      lastCursorAt = performance.now()
      if (cursor.length > 10) cursor.shift()
      cursor.push({ x: event.clientX, y: event.clientY, at: performance.now() })
      requestDraw()
    }
    const onVisibility = () => { if (!document.hidden) { drawRef.current(); requestDraw() } else cancelAnimationFrame(frameRef.current) }
    const onScroll = () => { if (reducedMotion) drawRef.current() }

    window.addEventListener('mini-firework', onMini)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)
    resize()

    const refreshTravel = () => {
      if (reducedMotion) return
      const slot = document.querySelector<HTMLElement>('[data-landing-slot]')
      if (!slot) return
      travel?.kill()
      travel = ScrollTrigger.create({
        trigger: '#home',
        start: 'bottom top',
        endTrigger: slot,
        end: 'center center',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          travelActive.current = window.scrollY >= self.start
          progressRef.current = self.progress
          drawRef.current()
        },
        onRefresh: self => {
          travelActive.current = window.scrollY >= self.start
          progressRef.current = self.progress
          drawRef.current()
        },
      })
    }
    refreshTravel()
    const delayedRefresh = window.setTimeout(() => { refreshTravel(); ScrollTrigger.refresh() }, 500)

    return () => {
      window.clearTimeout(delayedRefresh)
      travel?.kill()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mini-firework', onMini)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(frameRef.current)
      gsap.killTweensOf(heroT.current)
      document.querySelector('[data-product-card].is-landed')?.classList.remove('is-landed')
    }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !launchId || launchRef.current === launchId) return
    launchRef.current = launchId
    const canvas = canvasRef.current
    if (!canvas) return
    heroActive.current = true
    heroT.current.value = 0
    gsap.to(heroT.current, {
      value: 1,
      duration: 1.65,
      ease: 'power2.in',
      onUpdate: () => { drawRef.current(); requestLoopRef.current() },
      onComplete: () => {
        heroActive.current = false
        burstRef.current.push(makeBurst(window.innerWidth * .5, window.innerHeight * .3, performance.now(), 70, particlePoolRef.current))
        requestLoopRef.current()
        onExplosion()
      },
    })
  }, [launchId, onExplosion, reducedMotion])

  return <canvas ref={canvasRef} aria-hidden="true" className="experience-canvas" />
}
