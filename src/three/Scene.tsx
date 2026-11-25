import { Canvas } from '@react-three/fiber'
import GoldParticles from './GoldParticles'
export function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false } }
/** Transparent particle scene. Mobile gets fewer particles. */
export default function Scene({ density = 1 }: { density?: number }) {
  const mobile = window.innerWidth < 768
  const n = Math.round((mobile ? 220 : 650) * density)
  return <Canvas dpr={[1, mobile ? 1.25 : 1.5]} camera={{ position: [0, 0, 8], fov: 55 }} gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}>
    <GoldParticles count={n} />
  </Canvas>
}
