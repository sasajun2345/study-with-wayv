import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

export default function LottieBadge() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const animationData = {
      v: '5.7.6', fr: 60, ip: 0, op: 240, w: 120, h: 120, nm: 'pulse', ddd: 0, assets: [], layers: [
        { ddd: 0, ind: 1, ty: 4, nm: 'circle', sr: 1, ks: { o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [60,60,0] }, a: { a: 0, k: [0,0,0] }, s: { a: 1, k: [ { i: { x: [0.667,0.667,0.667], y: [1,1,1] }, o: { x: [0.333,0.333,0.333], y: [0,0,0] }, t: 0, s: [80,80,100] }, { t: 120, s: [100,100,100] } ] } }, ao: 0,
          shapes: [
            { ty: 'el', p: { a: 0, k: [0,0] }, s: { a: 0, k: [80,80] }, d: 1 },
            { ty: 'fl', c: { a: 0, k: [0.2039,0.8274,0.6313,0.4] }, o: { a: 0, k: 100 }, r: 1 },
          ], ip: 0, op: 240, st: 0, bm: 0 }
      ]
    }
    const anim = lottie.loadAnimation({ container: ref.current, renderer: 'svg', loop: true, autoplay: true, animationData })
    return () => { anim.destroy() }
  }, [])

  return <div ref={ref} className="w-10 h-10" />
}
