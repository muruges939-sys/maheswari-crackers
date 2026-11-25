import { useEffect, useState, type ImgHTMLAttributes } from 'react'
import { FIREWORKS_PHOTOS } from '../data'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  src: string
  alt: string
}

export default function StockPhoto({ src, alt, ...props }: Props) {
  const [fallback, setFallback] = useState(false)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    setFallback(false)
    setUnavailable(false)
  }, [src])

  if (unavailable) {
    return <span className={`${props.className || ''} block bg-midnight`} role="img" aria-label={`${alt} unavailable`} />
  }

  return <img
    {...props}
    src={fallback ? FIREWORKS_PHOTOS.fallback : src}
    alt={alt}
    loading={props.loading || 'lazy'}
    decoding={props.decoding || 'async'}
    onError={() => {
      if (!fallback && src !== FIREWORKS_PHOTOS.fallback) setFallback(true)
      else setUnavailable(true)
    }}
  />
}
