import { useEffect, useRef, RefObject } from 'react'
import { FIREWORKS_FRAMES, FIREWORKS_PHOTOS } from '../data'
interface Opts { count: number; fps?: number; holdFrames?: number; onReady?: () => void }
const ease = (x: number) => x * x * (3 - 2 * x)
/** Preloads stock photo frames and plays them on a canvas via rAF with cross-fades. No React re-renders. */
export function useFrameAnimation(canvasRef: RefObject<HTMLCanvasElement>, { count, fps = 10, holdFrames = 15, onReady }: Opts) {
  const ready = useRef(onReady); ready.current = onReady
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false }); if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const imgs: HTMLImageElement[] = []; let raf = 0, alive = true, start = 0, w = 0, h = 0, loaded = 0, visible = true, framesLoaded = false
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5)
      w = canvas.clientWidth * dpr; h = canvas.clientHeight * dpr; canvas.width = w; canvas.height = h
    }
    const cover = (img: HTMLImageElement, a: number) => { // preserves aspect ratio (crops, never stretches)
      if (!img.complete || !img.naturalWidth) return
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight), dw = img.naturalWidth * s, dh = img.naturalHeight * s
      ctx.globalAlpha = a; ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    }
    const cycle = count + holdFrames
    const frameAt = (i: number) => imgs[Math.min(i % cycle, count - 1)]
    const draw = (t: number) => {
      const p = t * fps, i = Math.floor(p), f = p - i
      ctx.globalAlpha = 1; ctx.fillStyle = '#050509'; ctx.fillRect(0, 0, w, h)
      cover(frameAt(i), 1)
      const a = f > 0.4 ? ease((f - 0.4) / 0.6) : 0
      if (a > 0) cover(frameAt(i + 1), a)
      ctx.globalAlpha = 1
    }
    const still = () => { ctx.globalAlpha = 1; ctx.fillStyle = '#050509'; ctx.fillRect(0, 0, w, h); cover(imgs[0], 1) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const tick = (now: number) => {
      raf = 0
      if (!alive || document.hidden || !visible) return
      if (!start) start = now
      draw(((now - start) / 1000) % (cycle / fps))
      raf = requestAnimationFrame(tick)
    }
    const resume = () => { if (alive && framesLoaded && !reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(tick) }
    const onVisibility = () => { if (document.hidden) stop(); else resume() }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true
      if (visible) resume(); else stop()
    })
    observer.observe(canvas)
    for (let n = 0; n < count; n++) {
      const im = new Image(); im.decoding = 'async'
      let settled = false
      let fallbackUsed = false
      const finish = () => {
        if (settled) return
        settled = true
        if (++loaded === count && alive) {
          framesLoaded = true
          resize(); ready.current?.()
          if (reduce) still(); else resume()
        }
      }
      im.onload = finish
      im.onerror = () => {
        if (!fallbackUsed) {
          fallbackUsed = true
          im.src = FIREWORKS_PHOTOS.fallback
        } else finish()
      }
      im.src = FIREWORKS_FRAMES[n % FIREWORKS_FRAMES.length]
      imgs.push(im)
    }
    const onResize = () => { resize(); if (reduce && loaded === count) still() }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { alive = false; stop(); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('resize', onResize); imgs.forEach(i => { i.onload = i.onerror = null; i.src = '' }) }
  }, [canvasRef, count, fps, holdFrames])
}
