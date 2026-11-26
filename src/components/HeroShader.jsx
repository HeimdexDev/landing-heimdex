import { useEffect, useRef } from 'react'

// Hero background: "Scroll Wave Field" — a 3D plane of points riding a layered
// sine surface, streaming toward a camera that sits inside the field. Near rows
// pass the bottom edge as large discs; far rows compress into a band at the
// horizon. The pointer is ray-cast onto the ground and lifts the surface.
//
// Adapted for the light hero: the original adds bright points over a black
// field, which would vanish on white. Here points are Heimdex navy/blue drawn
// with normal (premultiplied "over") blending, so they read as ink on paper.
// Runs only while on screen and the tab is visible; reduced motion draws one
// still frame. Without WebGL it renders nothing (the white backdrop shows).

const FIELD_W = 3600
const FIELD_D = 7000
const CAM_Z0 = 700
const FOV = 60
const DPR_CAP = 1.5
const TAU = Math.PI * 2
const CAM_Y_FULL = 550
const CAM_REF_AREA = 1200 * 800
const CURSOR_FOLLOW = 7

// Spread across the brand range, navy to pale mist, so patches of each drift
// through the field. The darkest brand navy (#0A2240) is left out: solid dark
// dots on white read as a dense speckle.
const COLORS = ['#234C77', '#4F7BAE', '#8CA5C3', '#BCCDE3']

const C = {
  density: 145, // lattice columns (rows = 2x)
  densityPhone: 100,
  dotSize: 2,
  scatter: 108,
  cameraHeight: 50, // percent of the component's area (see CAM_Y_FULL)
  waveHeight: 260, // base; each crest is scaled by a slow swell (see VERT)
  waveLength: 2070,
  waveSpeed: 250,
  flowSpeed: 250 * (260 / 160),
  tilt: 12, // degrees, looking down
  cursorRadius: 25,
  cursorLift: 45,
  hoverGlow: 100,
  opacity: 0.82, // overall ink strength on white
}

const VERT = `
precision highp float;
attribute vec2 aGrid;
attribute vec2 aSeed;
uniform vec2  uRes;
uniform float uFocal;
uniform float uTime;
uniform float uAmp;
uniform float uScatter;
uniform float uFreq;
uniform vec2  uDir;
uniform float uFlow;
uniform float uDepth;
uniform float uCamY;
uniform float uCamZ;
uniform float uPitch;
uniform float uDot;
uniform vec2  uJit;
uniform vec3  uColors[4];
uniform vec3  uCursor;
uniform float uCurR;
uniform float uCurS;
uniform float uHover;
uniform float uOpacity;
uniform float uClip;    // NDC y above which nothing is drawn (headline bottom)
varying vec3  vCol;
varying float vA;

vec3 pickColor(float sel) {
  float idx = floor(sel * 4.0);
  vec3 c = uColors[0];
  for (int i = 1; i < 4; i++) { if (float(i) == idx) c = uColors[i]; }
  return c;
}

// the static pattern is translated rigidly along uDir, so every crest travels
// the same way at the same speed
float surf(vec2 q) {
  return sin(q.x) * 0.55 + sin(q.x * 0.55 + q.y * 1.15) * 0.30 + sin(q.y * 0.75) * 0.22;
}

void main() {
  vec2 w = aGrid + (aSeed - 0.5) * uJit;
  // endless approach: depth relative to the camera, wrapped where fog is 0
  w.y = uCamZ + mod(w.y - uFlow - uCamZ, uDepth);
  float h3 = fract(sin(dot(aSeed, vec2(91.37, 47.13))) * 12345.678);
  // A slow swell scales the waves so crests differ: most stay low, some surge
  // up toward the headline. It drifts with the flow, so a tall set rolls in,
  // passes, and the next one rises somewhere else.
  float sw = 0.5 + 0.5 * sin(w.x * 0.0013 + w.y * 0.0006 - uTime * 0.21);
  sw *= 0.5 + 0.5 * sin(w.x * -0.0007 + w.y * 0.0011 + uTime * 0.13 + 1.7);
  float swell = 0.45 + 3.6 * sw * sw;
  float h = surf(w * uFreq - uDir * uTime) * uAmp * swell + (h3 - 0.5) * uScatter;

  float cd = length(w - uCursor.xy);
  float g = exp(-(cd * cd) / (uCurR * uCurR)) * uCursor.z;
  h += g * uCurS;
  float g2 = g * g; g2 = g2 * g2; g2 = g2 * g2;

  vec3 p = vec3(w.x, h - uCamY, w.y - uCamZ);
  float c = cos(uPitch), s = sin(uPitch);
  float ry = p.y * c + p.z * s;
  float rz = -p.y * s + p.z * c;
  if (rz < 40.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    vCol = uColors[0];
    vA = 0.0;
    return;
  }
  float ndcY = (ry * uFocal / rz) / (uRes.y * 0.5);
  gl_Position = vec4((p.x * uFocal / rz) / (uRes.x * 0.5), ndcY, 0.0, 1.0);
  float rad = max(uDot * uFocal / rz, 0.55);
  gl_PointSize = clamp(rad * 2.0 * (1.0 + g2 * uHover * 0.20), 1.0, 220.0);

  float bri = 0.28 + h3 * 0.72;
  // colour arrives in drifting patches that ride the flow
  vec2 bq = w * vec2(0.0040, 0.0032) - uDir * uTime * 0.30;
  float band = sin(bq.x) + sin(bq.y);
  float sel = fract((band + 2.0) * 0.25 + (aSeed.y - 0.5) * 0.55);
  vCol = pickColor(sel);

  // Far rows stay visible almost to the wrap depth so the field reads as a full
  // band right up to the horizon; still 0 before the wrap, so recycling is unseen.
  float fog = (1.0 - smoothstep(4200.0, 6900.0, rz)) * smoothstep(70.0, 240.0, rz);
  // crests fade out as they reach the headline, never over it
  float clip = 1.0 - smoothstep(uClip - 0.12, uClip, ndcY);
  vA = clamp(bri * fog * clip * (1.0 + g2 * uHover * 0.55) * uOpacity, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
varying vec3  vCol;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float a = (1.0 - smoothstep(0.90, 1.0, d)) * vA;
  gl_FragColor = vec4(vCol * a, a); // premultiplied, composited "over"
}
`

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function HeroShader({ className = '', horizonRef, crestRef }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, depth: false })
    if (!gl) return

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const aGrid = gl.getAttribLocation(prog, 'aGrid')
    const aSeed = gl.getAttribLocation(prog, 'aSeed')
    const U = (n) => gl.getUniformLocation(prog, n)
    const u = {
      res: U('uRes'), focal: U('uFocal'), time: U('uTime'), flow: U('uFlow'),
      camY: U('uCamY'), jit: U('uJit'), cursor: U('uCursor'),
    }
    // constants, set once
    gl.uniform1f(U('uAmp'), C.waveHeight)
    gl.uniform1f(U('uScatter'), C.scatter)
    gl.uniform1f(U('uFreq'), TAU / C.waveLength)
    gl.uniform2f(U('uDir'), 0, -1) // the pattern travels toward the viewer
    gl.uniform1f(U('uDepth'), FIELD_D)
    gl.uniform1f(U('uCamZ'), CAM_Z0)
    gl.uniform1f(U('uDot'), C.dotSize)
    gl.uniform3fv(U('uColors[0]'), new Float32Array(COLORS.flatMap(hex)))
    gl.uniform1f(U('uCurR'), (C.cursorRadius / 100) * (FIELD_W / 2))
    gl.uniform1f(U('uCurS'), C.cursorLift)
    gl.uniform1f(U('uHover'), C.hoverGlow / 100)
    gl.uniform1f(U('uOpacity'), C.opacity)

    // Lattice. Fewer points on phones: a smaller canvas doesn't need 42k.
    const gridBuf = gl.createBuffer()
    const seedBuf = gl.createBuffer()
    const d = window.matchMedia('(max-width: 639px)').matches ? C.densityPhone : C.density
    const cols = d
    const rows = d * 2
    const count = cols * rows
    const spacingX = FIELD_W / (cols - 1)
    const spacingZ = FIELD_D / (rows - 1)
    const grid = new Float32Array(count * 2)
    const seed = new Float32Array(count * 2)
    const rnd = mulberry32(0x5eed)
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        // +0.5 so no column sits at x = 0 (it would pile into one vertical line)
        grid[i * 2] = -FIELD_W / 2 + (c + 0.5) * spacingX
        grid[i * 2 + 1] = r * spacingZ
        seed[i * 2] = rnd()
        seed[i * 2 + 1] = rnd()
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf)
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aGrid)
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf)
    gl.bufferData(gl.ARRAY_BUFFER, seed, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(aSeed)
    gl.vertexAttribPointer(aSeed, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(u.jit, spacingX * 0.25, spacingZ * 0.7)

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    let dpr = 1
    let camY = CAM_Y_FULL * 0.5
    // The horizon is pinned to the bottom of horizonRef (the CTA row) plus a small
    // gap: the camera pitch is solved so the far band lands exactly there, and the
    // field fills everything below it at any screen size.
    let pitch = (C.tilt * Math.PI) / 180
    const uPitch = U('uPitch')
    const uClip = U('uClip')
    // The farthest visible rows land some way below the true horizon, so the
    // horizon is aimed above the anchor and the field is trimmed at CLIP_GAP
    // under it: points then start right beneath the buttons. Tall crests may
    // rise above that, up into the headline's second line (crestRef's top - CREST_LIFT).
    const HORIZON_LIFT = 70 // css px above the anchor's bottom
    const CLIP_GAP = 14 // css px below it, used without a crestRef
    const CREST_LIFT = 70 // css px the tallest crests may reach above crestRef
    const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      const area = Math.min(2.5, Math.max(0.5, Math.sqrt((cw * ch) / CAM_REF_AREA)))
      camY = (C.cameraHeight / 100) * CAM_Y_FULL * area
      // horizon / clip line as fractions from the top (defaults without an anchor)
      let hf = 0.34
      let cf = 0.4
      const anchor = horizonRef?.current
      if (anchor && ch > 0) {
        const top = canvas.getBoundingClientRect().top
        const y = anchor.getBoundingClientRect().bottom - top
        hf = (y - HORIZON_LIFT) / ch
        cf = (y + CLIP_GAP) / ch
        const crest = crestRef?.current
        // Phones: the copy spans the full width, so crests stop at the lead copy.
        const lift = cw < 640 ? 0 : CREST_LIFT
        if (crest) cf = (crest.getBoundingClientRect().top - lift - top) / ch
      }
      hf = Math.min(0.5, Math.max(0.05, hf))
      pitch = Math.atan((0.5 - hf) * 2 * tanHalf)
      gl.uniform1f(uPitch, pitch)
      gl.uniform1f(uClip, 1 - 2 * cf)
      const w = Math.max(1, Math.round(cw * dpr))
      const h = Math.max(1, Math.round(ch * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
    }

    // Pointer: the canvas sits under the hero copy, so listen on the window and
    // map into the canvas box. Mouse only; touch never lifts the field.
    const ptr = { x: 0, y: 0, sx: 0, sy: 0, on: 0, onTarget: 0 }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      ptr.onTarget = inside && e.pointerType === 'mouse' ? 1 : 0
      ptr.x = e.clientX - r.left
      ptr.y = e.clientY - r.top
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // Ground-plane ray cast: the inverse of the vertex projection.
    let hitX = 0
    let hitZ = -1e6
    const groundHit = (mx, my, wDev, hDev, focal) => {
      const dx = (mx * dpr - wDev / 2) / focal
      const dy = -(my * dpr - hDev / 2) / focal
      const c = Math.cos(pitch)
      const s = Math.sin(pitch)
      const wy = dy * c - s
      const wz = dy * s + c
      if (wy > -1e-4) return null
      const t = -camY / wy
      return { x: dx * t, z: CAM_Z0 + wz * t }
    }

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let phase = 0
    let flow = 0
    let visible = true

    const draw = (now = performance.now()) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      resize()

      ptr.on += (ptr.onTarget - ptr.on) * (1 - Math.exp(-dt * 5))
      if (ptr.on < 0.002) {
        ptr.sx = ptr.x
        ptr.sy = ptr.y
      } else {
        const k = 1 - Math.exp(-dt * CURSOR_FOLLOW)
        ptr.sx += (ptr.x - ptr.sx) * k
        ptr.sy += (ptr.y - ptr.sy) * k
      }
      phase += dt * (C.waveSpeed / 100)
      flow = (flow + dt * C.flowSpeed) % FIELD_D

      const wDev = canvas.width
      const hDev = canvas.height
      const focal = hDev / (2 * Math.tan(((FOV / 2) * Math.PI) / 180))
      if (ptr.on <= 0.001) {
        hitX = 0
        hitZ = -1e6
      } else {
        const hit = groundHit(ptr.sx, ptr.sy, wDev, hDev, focal)
        if (hit) {
          hitX = hit.x
          hitZ = hit.z
        }
      }

      gl.uniform2f(u.res, wDev, hDev)
      gl.uniform1f(u.focal, focal)
      gl.uniform1f(u.time, phase)
      gl.uniform1f(u.flow, flow)
      gl.uniform1f(u.camY, camY)
      gl.uniform3f(u.cursor, hitX, hitZ, ptr.on)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, count)
    }
    const loop = (now) => {
      draw(now)
      raf = requestAnimationFrame(loop)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      if (still) return draw()
      if (visible && !document.hidden) raf = requestAnimationFrame(loop)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      run()
    })
    io.observe(canvas)
    const onVis = () => run()
    document.addEventListener('visibilitychange', onVis)
    const ro = new ResizeObserver(() => still && draw())
    ro.observe(canvas)
    run()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      // No loseContext(): React may remount on the same canvas (StrictMode), and a
      // lost context would stay dead for the second mount.
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />
}
