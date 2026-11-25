import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
function sprite() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, 'rgba(255,240,170,1)'); r.addColorStop(.35, 'rgba(212,175,55,.6)'); r.addColorStop(1, 'rgba(212,175,55,0)')
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c)
}
export default function GoldParticles({ count = 600, spread = 12 }: { count?: number; spread?: number }) {
  const ref = useRef<THREE.Points>(null)
  const tex = useMemo(sprite, [])
  const { pos, spd } = useMemo(() => {
    const pos = new Float32Array(count * 3), spd = new Float32Array(count)
    for (let i = 0; i < count; i++) { pos[i*3] = (Math.random()-.5)*spread*1.6; pos[i*3+1] = (Math.random()-.5)*spread; pos[i*3+2] = (Math.random()-.5)*spread*.8; spd[i] = .1 + Math.random()*.35 }
    return { pos, spd }
  }, [count, spread])
  useEffect(() => () => tex.dispose(), [tex])
  useFrame((s, dt) => {
    const p = ref.current; if (!p) return
    const a = p.geometry.attributes.position as THREE.BufferAttribute, t = s.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + spd[i]*dt; if (y > spread/2) y = -spread/2
      a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t*.4 + i)*.0018)
    }
    a.needsUpdate = true
    p.rotation.y += (s.pointer.x*.15 - p.rotation.y)*.03; p.rotation.x += (-s.pointer.y*.08 - p.rotation.x)*.03
  })
  return <points ref={ref} frustumCulled={false}>
    <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
    <pointsMaterial map={tex} size={.16} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#ffe28a" />
  </points>
}
