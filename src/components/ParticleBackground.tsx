export default function ParticleBackground({ density = 1, className = '' }: { density?: number; className?: string }) {
  const opacity = Math.min(1, .7 * density)
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} style={{ opacity }}>
    <div className="ambient-glow ambient-glow-gold" />
    <div className="ambient-glow ambient-glow-blue" />
    <div className="ambient-glow ambient-glow-purple" />
  </div>
}
