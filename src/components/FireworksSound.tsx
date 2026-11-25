import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

type SoundKind = 'pop' | 'launch' | 'burst' | 'distant' | 'ambience'

const SOUND_URLS: Record<SoundKind, string> = {
  pop: 'https://assets.mixkit.co/active_storage/sfx/3104/3104-preview.mp3',
  launch: 'https://assets.mixkit.co/active_storage/sfx/3103/3103-preview.mp3',
  burst: 'https://assets.mixkit.co/active_storage/sfx/2994/2994-preview.mp3',
  distant: 'https://assets.mixkit.co/active_storage/sfx/1689/1689-preview.mp3',
  ambience: 'https://assets.mixkit.co/active_storage/sfx/524/524-preview.mp3',
}

const STORAGE_KEY = 'maheswari-fireworks-sound'

function readPreference() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== 'off'
  } catch (error) {
    console.warn('Unable to read the fireworks sound preference for this session.', error)
    return true
  }
}

function writePreference(enabled: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch (error) {
    console.warn('Unable to save the fireworks sound preference for this session.', error)
  }
}

export default function FireworksSound() {
  const [enabled, setEnabled] = useState(readPreference)
  const enabledRef = useRef(enabled)
  const interacted = useRef(false)
  const player = useRef<HTMLAudioElement>(null)
  const lastPlayed = useRef(0)
  const lastScrollSound = useRef(0)
  const audioContext = useRef<AudioContext | null>(null)
  const fallbackGain = useRef<GainNode | null>(null)

  const playFallback = useCallback((kind: SoundKind) => {
    const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Context) {
      console.warn('Fireworks sound is unavailable: this browser does not support Web Audio.')
      return
    }

    if (!audioContext.current) {
      audioContext.current = new Context()
      fallbackGain.current = audioContext.current.createGain()
      fallbackGain.current.gain.value = enabledRef.current ? 0.18 : 0
      fallbackGain.current.connect(audioContext.current.destination)
    }

    const context = audioContext.current
    const master = fallbackGain.current
    if (!master) return
    if (context.state === 'suspended') {
      void context.resume().then(() => playFallback(kind)).catch(error => {
        console.warn('Unable to start the fallback fireworks sound.', error)
      })
      return
    }

    const duration = kind === 'launch' ? 0.9 : 0.42
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
    const samples = buffer.getChannelData(0)
    for (let i = 0; i < samples.length; i++) {
      samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length)
    }
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const envelope = context.createGain()
    source.buffer = buffer
    filter.type = kind === 'launch' ? 'highpass' : 'lowpass'
    filter.frequency.setValueAtTime(kind === 'launch' ? 700 : 1800, context.currentTime)
    if (kind === 'launch') filter.frequency.exponentialRampToValueAtTime(5200, context.currentTime + duration)
    envelope.gain.setValueAtTime(0.0001, context.currentTime)
    envelope.gain.exponentialRampToValueAtTime(0.55, context.currentTime + 0.025)
    envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(master)
    source.start()
    source.stop(context.currentTime + duration)
  }, [])

  const playSound = useCallback((kind: SoundKind, fromToggle = false, synchronized = false) => {
    if (!enabledRef.current || (!interacted.current && !fromToggle)) return
    const now = Date.now()
    if (!synchronized && now - lastPlayed.current < 1100) return
    lastPlayed.current = now

    const element = player.current
    if (!element) return
    let fallbackPlayed = false
    const fallbackOnce = () => {
      if (fallbackPlayed) return
      fallbackPlayed = true
      playFallback(kind)
    }
    element.onerror = () => {
      console.warn(`Unable to load fireworks sound: ${SOUND_URLS[kind]}`)
      fallbackOnce()
    }
    element.pause()
    element.src = SOUND_URLS[kind]
    element.volume = kind === 'ambience' || kind === 'distant' ? 0.12 : 0.18
    element.currentTime = 0
    void element.play().catch(error => {
      if (error instanceof DOMException && error.name === 'NotAllowedError') return
      console.error(`Unable to play fireworks sound: ${SOUND_URLS[kind]}`, error)
      fallbackOnce()
    })
  }, [playFallback])

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) {
      player.current?.pause()
      if (fallbackGain.current && audioContext.current) {
        fallbackGain.current.gain.setValueAtTime(0, audioContext.current.currentTime)
      }
    } else if (fallbackGain.current && audioContext.current) {
      fallbackGain.current.gain.setValueAtTime(0.18, audioContext.current.currentTime)
    }
  }, [enabled])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!event.isTrusted) return
      const target = event.target as Element
      if (target.closest('[data-sound-toggle]')) return
      interacted.current = true
      if (!target.closest('button, a, input, select, textarea')) playSound('pop')
    }
    const onKeyboardClick = (event: MouseEvent) => {
      if (!event.isTrusted) return
      if ((event.target as Element).closest('[data-sound-toggle]')) return
      interacted.current = true
      playSound('pop')
    }
    const onUserScrollGesture = (event: WheelEvent | KeyboardEvent) => {
      if (event.isTrusted) interacted.current = true
    }
    const onScroll = () => {
      if (!interacted.current) return
      const now = Date.now()
      if (now - lastScrollSound.current < 5000) return
      lastScrollSound.current = now
      playSound(Math.random() < 0.25 ? 'ambience' : 'distant')
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'End', 'Home'].includes(event.key)) onUserScrollGesture(event)
    }
    const onFireworksSound = (event: Event) => {
      const kind = (event as CustomEvent<{ kind?: SoundKind }>).detail?.kind
      if (kind && kind in SOUND_URLS) playSound(kind, false, true)
    }

    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('click', onKeyboardClick)
    window.addEventListener('wheel', onUserScrollGesture, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('fireworks-sound', onFireworksSound)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('click', onKeyboardClick)
      window.removeEventListener('wheel', onUserScrollGesture)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('fireworks-sound', onFireworksSound)
      player.current?.pause()
      if (audioContext.current) void audioContext.current.close()
    }
  }, [playSound])

  const toggle = () => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    writePreference(next)
    if (next) {
      interacted.current = true
      playSound('pop', true)
    } else {
      player.current?.pause()
    }
  }

  return <>
    <audio ref={player} preload="none" aria-hidden="true" />
    <button
      type="button"
      data-sound-toggle
      onClick={toggle}
      aria-label={enabled ? 'Turn fireworks sound off' : 'Turn fireworks sound on'}
      aria-pressed={enabled}
      title={enabled ? 'Sound on — click to mute' : 'Sound off — click to enable'}
      className="fixed bottom-6 left-5 z-[55] rounded-full border border-gold/40 bg-midnight/80 p-3 text-gold shadow-lg backdrop-blur-md transition hover:border-gold hover:bg-midnight"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  </>
}
