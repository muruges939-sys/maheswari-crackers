import { useId } from 'react'
import type { Category } from '../data'

const stars = [[22, 24], [76, 19], [30, 52], [82, 49], [18, 78], [70, 81]]

export default function CategoryArt({ category }: { category: Category }) {
  const id = useId().replace(/:/g, '')
  const isBox = category === 'Gift Boxes' || category === 'Celebration Collections'

  return <svg viewBox="0 0 400 300" role="img" aria-label={`${category} illustration`} className={`category-art category-art-${category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
    <defs>
      <linearGradient id={`metal-${id}`} x1="0" x2="1" y1="0" y2="1">
        <stop stopColor="#fff3b0" />
        <stop offset=".45" stopColor="#D4AF37" />
        <stop offset="1" stopColor="#8a6a12" />
      </linearGradient>
      <radialGradient id={`glow-${id}`}>
        <stop stopColor="#D4AF37" stopOpacity=".35" />
        <stop offset="1" stopColor="#32105F" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="200" cy="170" rx="145" ry="115" fill={`url(#glow-${id})`} />
    {stars.map(([x, y], i) => <circle key={i} cx={x * 4} cy={y * 3} r={i % 2 ? 2 : 1.4} fill="#fff3b0" className={`art-twinkle twinkle-${i % 3}`} />)}
    {category === 'Sparklers' && <>
      <g className="art-sparkler-left" transform="rotate(-24 157 174)">
        <path d="M157 111v112" stroke={`url(#metal-${id})`} strokeWidth="5" strokeLinecap="round" />
        <path d="M157 111l-14-19m14 19 2-27m-2 27 17-17m-17 17-22-4m22 4 19 7" className="art-rays" />
        <circle cx="157" cy="111" r="13" fill="#fff3b0" opacity=".8" className="art-glint" />
      </g>
      <g className="art-sparkler-right" transform="rotate(18 237 162)">
        <path d="M237 100v124" stroke={`url(#metal-${id})`} strokeWidth="5" strokeLinecap="round" />
        <path d="M237 100l-13-16m13 16 6-24m-6 24 20-12m-20 12-19 2m19-2 18 10" className="art-rays" />
        <circle cx="237" cy="100" r="12" fill="#fff3b0" opacity=".8" className="art-glint" />
      </g>
    </>}
    {(category === 'Flower Pots' || category === 'Fountains') && <>
      <path d="M164 213h72l-10 34h-52z" fill="#32105F" stroke={`url(#metal-${id})`} strokeWidth="3" />
      <ellipse cx="200" cy="214" rx="36" ry="8" fill="#D4AF37" />
      <g className="art-fountain">
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M200 205 Q${154 + i * 9} ${156 - (i % 4) * 9} ${148 + i * 10} ${85 + (i % 3) * 8}`} stroke={i % 3 ? '#D4AF37' : '#2764FF'} strokeWidth={i % 3 ? 2.5 : 3.5} strokeLinecap="round" opacity=".85" />)}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={155 + ((i * 37) % 93)} cy={83 + ((i * 23) % 105)} r={i % 3 ? 2.5 : 4} fill={i % 2 ? '#fff3b0' : '#D4AF37'} className={`art-particle particle-${i % 4}`} />)}
      </g>
    </>}
    {category === 'Ground Chakkars' && <>
      <g className="art-chakkar" transform="translate(200 155)">
        <circle r="58" fill="#32105F" fillOpacity=".42" stroke={`url(#metal-${id})`} strokeWidth="4" />
        <circle r="39" fill="none" stroke="#2764FF" strokeWidth="3" strokeDasharray="9 6" />
        <circle r="17" fill="#D4AF37" fillOpacity=".22" stroke="#fff3b0" strokeWidth="2" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d="M0-57v-20m0 118v20" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />)}
        <circle r="5" fill="#fff3b0" />
      </g>
      <path d="M200 237v22" stroke="#D4AF37" strokeWidth="3" />
    </>}
    {category === 'Rockets' && <>
      <g className="art-rocket">
        <path d="M200 68c-25 23-33 57-31 99l31 20 31-20c2-42-6-76-31-99z" fill="#32105F" stroke={`url(#metal-${id})`} strokeWidth="3" />
        <path d="M169 156l-23 27 24-5m61-22 23 27-24-5" fill="#2764FF" stroke="#D4AF37" strokeWidth="2" />
        <path d="M200 187v51" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
        <circle cx="200" cy="123" r="10" fill="#fff3b0" />
        <path d="M188 201q12 18 0 38m12-38q12 18 0 38m12-38q12 18 0 38" className="art-rays" />
      </g>
    </>}
    {isBox && <>
      <g className="art-giftbox">
        <path d="M123 139h154v105H123z" fill="#32105F" stroke={`url(#metal-${id})`} strokeWidth="3" />
        <path d="M190 140h20v104h-20z" fill="#D4AF37" />
        <path d="M124 170h152v14H124z" fill="#2764FF" opacity=".8" />
        <g className="art-box-lid"><path d="M111 119h178v28H111z" fill={`url(#metal-${id})`} stroke="#fff3b0" strokeWidth="2" />
          <path d="M188 119c-37-4-38-37-17-37 17 0 22 20 29 37 7-17 13-37 29-37 22 0 19 33-18 37" fill="none" stroke="#D4AF37" strokeWidth="7" /></g>
        <path d="M196 184h9v17h-9z" fill="#fff3b0" />
      </g>
    </>}
    <circle cx="200" cy="264" r="3" fill="#D4AF37" opacity=".65" />
  </svg>
}
