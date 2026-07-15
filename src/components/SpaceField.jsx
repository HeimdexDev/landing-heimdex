import { useEffect, useRef } from 'react'

// Perspective starfield — stars drift out of deep space toward the viewer,
// growing and spreading from a vanishing point for a floating-through-space
// depth. Subtle mouse parallax adds a 3D sense. Sits behind the constellation.
export default function SpaceField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, cx = 0, cy = 0
    let stars = []
    let raf
    let last = 0
    const MAXZ = 900
    const FOCAL = 180
    const SPEED = 42 // depth units / sec — slow float, not warp
    const px = { x: 0, y: 0 } // smoothed parallax offset
    const target = { x: 0, y: 0 }

    const spawn = (z) => ({
      x: (Math.random() - 0.5) * w * 1.7,
      y: (Math.random() - 0.5) * h * 1.7,
      z: z,
      t: Math.random(), // colour tint (blue→white)
      tw: Math.random() * Math.PI * 2, // twinkle phase
    })

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      cx = w / 2
      cy = h * 0.42 // vanishing point a touch above centre
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(90, Math.min(340, Math.round((w * h) / 3800)))
      stars = Array.from({ length: count }, () => spawn(1 + Math.random() * MAXZ))
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      target.x = ((e.clientX - rect.left) / w - 0.5) * 2 // -1..1
      target.y = ((e.clientY - rect.top) / h - 0.5) * 2
    }

    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016
      last = now
      px.x += (target.x * 46 - px.x) * 0.045
      px.y += (target.y * 46 - px.y) * 0.045
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        s.z -= SPEED * dt
        if (s.z <= 1) Object.assign(s, spawn(MAXZ))
        const k = FOCAL / s.z
        const depth = 1 - s.z / MAXZ // 0 far … 1 near
        const sx = cx + s.x * k + px.x * depth
        const sy = cy + s.y * k + px.y * depth
        if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) continue
        const r = 0.3 + depth * depth * 2.3
        const tw = 0.72 + 0.28 * Math.sin(s.tw + now * 0.002)
        const a = Math.min(1, depth * 1.25) * tw
        // trailing streak for the nearest, fastest stars → motion/depth cue
        if (depth > 0.72) {
          const pk = FOCAL / (s.z + SPEED * 0.05)
          ctx.strokeStyle = `rgba(180,205,255,${a * 0.35})`
          ctx.lineWidth = r * 0.9
          ctx.beginPath()
          ctx.moveTo(cx + s.x * pk + px.x * depth, cy + s.y * pk + px.y * depth)
          ctx.lineTo(sx, sy)
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.fillStyle = `rgba(${182 + Math.round(s.t * 40)},${208 + Math.round(s.t * 40)},255,${a})`
        ctx.arc(sx, sy, r, 0, 6.2832)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
