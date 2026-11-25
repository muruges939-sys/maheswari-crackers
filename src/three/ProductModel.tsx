import { useState } from 'react'
import { FIREWORKS_PHOTOS } from '../data'
import StockPhoto from '../components/StockPhoto'

export default function ProductModel() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return <div className="gift-model-stage" onPointerMove={event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setTilt({ x: ((event.clientY - bounds.top) / bounds.height - .5) * -12, y: ((event.clientX - bounds.left) / bounds.width - .5) * 18 })
  }} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
    <StockPhoto
      src={FIREWORKS_PHOTOS.giftBox}
      alt="Real gift packaging photo for inspiration, not a Maheswari product"
      className="gift-model"
      sizes="(min-width: 1024px) 40vw, 100vw"
      style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    />
  </div>
}
