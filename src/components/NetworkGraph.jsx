import { useEffect, useRef } from 'react'

// Drifting network graph — nodes float slowly and link to nearby nodes, like an
// embedding/index graph. A slow vertical beam sweeps across (Heimdall's
// ever-watching gaze); nodes it lights up occasionally emit a signal ping
// (Gjallarhorn's call) — i.e. "watch → detect". Cursor also links the graph.
export default function NetworkGraph({
  mask = 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.06) 52%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0.5) 91%, rgba(0,0,0,0.85) 100%)',
} = {}) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const LINK = 150 // node-to-node connection distance
    const CURSOR = 190 // cursor connection radius
    const BAND = 130 // half-width of the scanning beam
    const SWEEP = 9000 // ms for one left→right sweep
    let w = 0, h = 0
    let nodes = []
    let pings = []
    let beam = 0 // sweep progress 0→1
    let pingCooldown = 0
    let last = 0
    const mouse = { x: -9999, y: -9999, active: false }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(26, Math.min(84, Math.round((w * h) / 18000)))
      // jittered grid → even spread across the whole canvas (incl. bottom),
      // avoiding the random clustering/overlap of pure Math.random placement
      const cols = Math.max(2, Math.round(Math.sqrt(count * (w / h))))
      const rows = Math.max(2, Math.ceil(count / cols))
      const cw = w / cols
      const ch = h / rows
      nodes = []
      for (let r = 0; r < rows && nodes.length < count; r++) {
        for (let c = 0; c < cols && nodes.length < count; c++) {
          nodes.push({
            x: (c + 0.2 + Math.random() * 0.6) * cw,
            y: (r + 0.2 + Math.random() * 0.6) * ch,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            r: 1 + Math.random() * 1.3,
            glow: 0,
          })
        }
      }
      pings = []
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > w || y > h) {
        mouse.active = false
        return
      }
      mouse.x = x
      mouse.y = y
      mouse.active = true
    }

    let raf
    const tick = (now) => {
      const dt = last ? Math.min(now - last, 50) : 16
      last = now
      ctx.clearRect(0, 0, w, h)

      // Advance the scanning beam
      beam += dt / SWEEP
      if (beam > 1) beam -= 1
      const beamX = beam * w
      pingCooldown -= dt

      // Drift + edge bounce + glow decay + beam boost (→ occasional ping)
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1
        n.glow *= 0.95
        const db = Math.abs(n.x - beamX)
        if (db < BAND) {
          const lit = 1 - db / BAND
          if (lit > n.glow) {
            n.glow = lit
            if (lit > 0.86 && pingCooldown <= 0 && Math.random() < 0.05) {
              pings.push({ x: n.x, y: n.y, r: 0 })
              pingCooldown = 650
            }
          }
        }
      }

      // (Invisible scanning sweep — only its lighting of nodes/links shows)

      // Node-to-node links (brighter when an endpoint is lit)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK) {
            const base = (1 - d / LINK) * 0.22
            const boost = Math.max(a.glow, b.glow) * 0.35
            ctx.strokeStyle = `rgba(160,190,235,${base + boost})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Cursor links — brighter, ties the graph to the pointer
      if (mouse.active) {
        for (const n of nodes) {
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CURSOR) {
            ctx.strokeStyle = `rgba(185,212,255,${(1 - d / CURSOR) * 0.55})`
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      // Signal pings — expanding rings that fade out
      pings = pings.filter((p) => p.r < 64)
      for (const p of pings) {
        p.r += dt * 0.055
        ctx.strokeStyle = `rgba(175,205,255,${(1 - p.r / 64) * 0.4})`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, 6.2832)
        ctx.stroke()
      }

      // Nodes — size/brightness lift with their glow
      for (const n of nodes) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(188,212,255,${0.55 + n.glow * 0.45})`
        ctx.arc(n.x, n.y, n.r + n.glow * 1.6, 0, 6.2832)
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
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  )
}
