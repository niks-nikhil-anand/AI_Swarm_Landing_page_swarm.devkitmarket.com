"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

/**
 * Live particle swarm (Pricing section). Hundreds of particles gather into the word "Swarm"
 * inside a slowly turning sphere of points, twinkle, and scatter away from the pointer.
 * Clicking (or Enter/Space) splits the word into one small swarm per letter; they roam
 * inside the sphere, then regroup into the word on their own.
 *
 * The canvas is decorative (aria-hidden) inside a labelled button. Colours come from the site's CSS tokens, so it follows the
 * theme toggle. It pauses off screen and in hidden tabs, and draws a single still frame
 * for visitors who prefer reduced motion. No dependencies.
 */

type Rgb = [number, number, number];

const TAU = Math.PI * 2;
/** Assembly duration on first view, seconds. */
const ASSEMBLE = 1.4;
/** Seconds per sphere revolution. */
const REVOLUTION = 40;
/** Seconds between centre pulse rings. */
const PULSE_EVERY = 9;
/** The word the swarm forms. */
const WORD = "Swarm";
/** Split timeline, seconds after a click: burst → roam → regroup → formed. */
const BURST_END = 0.4;
const ROAM_END = 3.5;
const REGROUP_END = 4.4;

type SwarmApi = { split: (x: number, y: number) => void };

export function SwarmCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<SwarmApi | null>(null);
  const [hintSeen, setHintSeen] = useState(false);
  const onSplitRef = useRef(() => setHintSeen(true));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;

    /* ---------- Sizing ---------- */
    let size = 0; // CSS px (square)
    let dpr = 1;

    /* ---------- Colours from theme tokens ---------- */
    const probe = document.createElement("canvas").getContext("2d")!;
    const toRgb = (value: string, fallback: Rgb): Rgb => {
      if (!value) return fallback;
      probe.fillStyle = "#000";
      probe.fillStyle = value;
      const hex = String(probe.fillStyle);
      const m = /^#([0-9a-f]{6})$/i.exec(hex);
      return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : fallback;
    };
    let dark = true;
    let letterRgb: Rgb = [168, 158, 249];
    let mintRgb: Rgb = [45, 212, 167];
    let letterSprite: HTMLCanvasElement;
    let mintSprite: HTMLCanvasElement;

    /** A soft glowing dot (dark) or a crisp dot (light), pre-rendered once per colour. */
    function makeSprite([r, g, b]: Rgb) {
      const s = 32;
      const c = document.createElement("canvas");
      c.width = c.height = s;
      const g2 = c.getContext("2d")!;
      const grad = g2.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      if (dark) {
        grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(0.22, `rgba(${r},${g},${b},0.85)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      } else {
        grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      }
      g2.fillStyle = grad;
      g2.fillRect(0, 0, s, s);
      return c;
    }

    function readTheme() {
      const root = document.documentElement;
      dark = !root.classList.contains("light");
      const css = getComputedStyle(root);
      letterRgb = toRgb(css.getPropertyValue(dark ? "--color-brand-soft" : "--color-brand").trim(), letterRgb);
      mintRgb = toRgb(css.getPropertyValue("--color-mint").trim(), mintRgb);
      letterSprite = makeSprite(letterRgb);
      mintSprite = makeSprite(mintRgb);
    }
    readTheme();

    /* ---------- Particles ---------- */
    let nLetters = 0;
    let nSphere = 0;
    let nDust = 0;
    // Letters: unit-space target (ux, uy in -1..1), position/velocity in CSS px, per-particle traits.
    let ux = new Float32Array(0), uy = new Float32Array(0);
    let px = new Float32Array(0), py = new Float32Array(0), vx = new Float32Array(0), vy = new Float32Array(0);
    let phase = new Float32Array(0), freq = new Float32Array(0), dot = new Float32Array(0), isMint = new Uint8Array(0);
    // Sphere: unit vectors.
    let sx = new Float32Array(0), sy = new Float32Array(0), sz = new Float32Array(0);
    // Dust: unit-space position and drift.
    let dx = new Float32Array(0), dy = new Float32Array(0), dvx = new Float32Array(0), dvy = new Float32Array(0);
    // Split: each letter particle's group (its letter) and its orbit inside that small swarm.
    let group = new Uint8Array(0), orbitR = new Float32Array(0), orbitA = new Float32Array(0), orbitW = new Float32Array(0);
    // Per group: the letter's centre (unit space), and the small swarm's live centre, velocity and wander goal (px).
    let nGroups = 0;
    let gux = new Float32Array(0), guy = new Float32Array(0);
    let gx = new Float32Array(0), gy = new Float32Array(0), gvx = new Float32Array(0), gvy = new Float32Array(0);
    let goalX = new Float32Array(0), goalY = new Float32Array(0), goalAt = new Float32Array(0);

    /** Sample the word's shape from off-screen text rendered in the page's body font. */
    function sampleLetters(count: number) {
      const S = 220;
      const off = document.createElement("canvas");
      off.width = off.height = S;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(canvas!).fontFamily || "system-ui, sans-serif";
      let fontSize = S * 0.62;
      o.font = `600 ${fontSize}px ${family}`;
      const w = o.measureText(WORD).width;
      fontSize *= Math.min(1, (S * 0.9) / w);
      o.font = `600 ${fontSize}px ${family}`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(WORD, S / 2, S / 2 + fontSize * 0.04);
      const data = o.getImageData(0, 0, S, S).data;
      // Right edge of each letter, from prefix widths (text is centred at S/2).
      const left = S / 2 - o.measureText(WORD).width / 2;
      const edges = [...WORD].map((_, k) => left + o.measureText(WORD.slice(0, k + 1)).width);
      const letterOf = (x: number) => {
        let k = 0;
        while (k < edges.length - 1 && x > edges[k]) k++;
        return k;
      };
      const pts: number[] = [];
      for (let y = 0; y < S; y += 2) {
        for (let x = 0; x < S; x += 2) {
          if (data[(y * S + x) * 4 + 3] > 140) pts.push(x, y);
        }
      }
      const total = pts.length / 2;
      const outX = new Float32Array(count), outY = new Float32Array(count), outG = new Uint8Array(count);
      for (let i = 0; i < count; i++) {
        const k = Math.floor(Math.random() * total) * 2;
        // Small jitter so points don't sit on a visible grid.
        outX[i] = (pts[k] + Math.random() * 2 - S / 2) / (S / 2);
        outY[i] = (pts[k + 1] + Math.random() * 2 - S / 2) / (S / 2);
        outG[i] = Math.min(6, letterOf(pts[k]));
      }
      return [outX, outY, outG, Math.min(7, WORD.length)] as const;
    }

    function build() {
      const tier = (size < 300 ? 0.42 : size < 420 ? 0.75 : 1) * (lowEnd ? 0.6 : 1);
      nLetters = Math.round(1100 * tier);
      nSphere = Math.round(700 * tier);
      nDust = Math.round(120 * tier);

      [ux, uy, group, nGroups] = sampleLetters(nLetters);
      px = new Float32Array(nLetters);
      py = new Float32Array(nLetters);
      vx = new Float32Array(nLetters);
      vy = new Float32Array(nLetters);
      phase = new Float32Array(nLetters);
      freq = new Float32Array(nLetters);
      dot = new Float32Array(nLetters);
      isMint = new Uint8Array(nLetters);
      orbitR = new Float32Array(nLetters);
      orbitA = new Float32Array(nLetters);
      orbitW = new Float32Array(nLetters);
      const c = size / 2;
      for (let i = 0; i < nLetters; i++) {
        // Start scattered around the canvas; the spring pulls them into the word.
        const a = Math.random() * TAU;
        const r = size * (0.35 + Math.random() * 0.45);
        px[i] = c + Math.cos(a) * r;
        py[i] = c + Math.sin(a) * r;
        phase[i] = Math.random() * TAU;
        freq[i] = 0.4 + Math.random() * 0.9;
        dot[i] = 0.7 + Math.random() * 0.8;
        isMint[i] = Math.random() < 0.08 ? 1 : 0;
        // Denser core: most particles orbit close to their small swarm's centre.
        orbitR[i] = 0.2 + 0.8 * Math.pow(Math.random(), 1.4);
        orbitA[i] = Math.random() * TAU;
        orbitW[i] = (0.8 + Math.random() * 1.4) * (Math.random() < 0.5 ? -1 : 1);
      }

      // Letter centres (unit space) and fresh small-swarm state.
      gux = new Float32Array(nGroups);
      guy = new Float32Array(nGroups);
      const counts = new Float32Array(nGroups);
      for (let i = 0; i < nLetters; i++) {
        gux[group[i]] += ux[i];
        guy[group[i]] += uy[i];
        counts[group[i]]++;
      }
      for (let g = 0; g < nGroups; g++) {
        gux[g] /= counts[g] || 1;
        guy[g] /= counts[g] || 1;
      }
      gx = new Float32Array(nGroups);
      gy = new Float32Array(nGroups);
      gvx = new Float32Array(nGroups);
      gvy = new Float32Array(nGroups);
      goalX = new Float32Array(nGroups);
      goalY = new Float32Array(nGroups);
      goalAt = new Float32Array(nGroups);
      splitAt = -1e9; // a rebuild (resize) always returns to the formed word

      // Fibonacci sphere: even coverage.
      sx = new Float32Array(nSphere);
      sy = new Float32Array(nSphere);
      sz = new Float32Array(nSphere);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < nSphere; i++) {
        const y = 1 - (i / (nSphere - 1)) * 2;
        const rr = Math.sqrt(1 - y * y);
        const th = golden * i + (Math.random() - 0.5) * 0.35;
        // Slight radial noise so the shell looks organic, not wireframe.
        const n = 1 + (Math.random() - 0.5) * 0.1;
        sx[i] = Math.cos(th) * rr * n;
        sy[i] = y * n;
        sz[i] = Math.sin(th) * rr * n;
      }

      dx = new Float32Array(nDust);
      dy = new Float32Array(nDust);
      dvx = new Float32Array(nDust);
      dvy = new Float32Array(nDust);
      for (let i = 0; i < nDust; i++) {
        dx[i] = Math.random() * 2 - 1;
        dy[i] = Math.random() * 2 - 1;
        dvx[i] = (Math.random() - 0.5) * 0.03;
        dvy[i] = (Math.random() - 0.5) * 0.03;
      }
    }

    /* ---------- Pointer ---------- */
    let pointerX = -1e4;
    let pointerY = -1e4;
    const ripples: { x: number; y: number; t0: number; big: boolean }[] = [];

    function localPoint(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    }
    function onMove(e: PointerEvent) {
      if (e.pointerType === "touch") return;
      [pointerX, pointerY] = localPoint(e);
    }
    function onLeave() {
      pointerX = pointerY = -1e4;
    }
    /** Break the word into one small swarm per letter, launched away from (x, y). */
    function split(x: number, y: number) {
      if (!ready) return;
      onSplitRef.current();
      ripples.push({ x, y, t0: time, big: true });
      if (reduceMotion) {
        stillSplit = !stillSplit;
        drawStill();
        return;
      }
      const c = size / 2, L = size * 0.31;
      const alreadySplit = time - splitAt < REGROUP_END;
      for (let g = 0; g < nGroups; g++) {
        if (!alreadySplit) {
          gx[g] = c + gux[g] * L;
          gy[g] = c + guy[g] * L;
          gvx[g] = gvy[g] = 0;
        }
        let ddx = gx[g] - x, ddy = gy[g] - y;
        const d = Math.hypot(ddx, ddy);
        if (d < 1) {
          const a = Math.random() * TAU;
          ddx = Math.cos(a);
          ddy = Math.sin(a);
        } else {
          ddx /= d;
          ddy /= d;
        }
        gvx[g] += ddx * size * 1.1;
        gvy[g] += ddy * size * 1.1;
        goalAt[g] = time; // pick a new wander goal right away
      }
      // Kick particles near the click so the burst reads as an explosion from that point.
      const reach = size * 0.5;
      for (let i = 0; i < nLetters; i++) {
        const ddx = px[i] - x, ddy = py[i] - y;
        const d = Math.hypot(ddx, ddy) || 1;
        if (d < reach) {
          const f = (1 - d / reach) * size * 2.2;
          vx[i] += (ddx / d) * f;
          vy[i] += (ddy / d) * f;
        }
      }
      splitAt = time;
    }
    apiRef.current = { split };

    /* ---------- Simulation + render ---------- */
    let time = 0;
    let started = -1; // time the assembly began
    let rafId = 0;
    let last = 0;
    let ready = false;
    let splitAt = -1e9; // time of the last split click
    let splitMode = 0; // 0 formed · 1 burst · 2 roam · 3 regroup
    let swell = 0; // 0..1 sphere swell while split
    let stillSplit = false; // reduced motion: showing the split still frame

    /** Move the small-swarm centres: wander toward goals, keep apart, stay inside the sphere. */
    function stepGroups(dt: number) {
      const c = size / 2;
      const R = size * 0.44;
      const inside = R * 0.62;
      const gap = size * 0.2;
      const maxV = size * 1.2;
      for (let g = 0; g < nGroups; g++) {
        if (time >= goalAt[g]) {
          const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * R * 0.5;
          goalX[g] = c + Math.cos(a) * r;
          goalY[g] = c + Math.sin(a) * r;
          goalAt[g] = time + 1.1 + Math.random() * 0.9;
        }
        let ax = (goalX[g] - gx[g]) * 1.4 - gvx[g] * 1.3;
        let ay = (goalY[g] - gy[g]) * 1.4 - gvy[g] * 1.3;
        for (let h = 0; h < nGroups; h++) {
          if (h === g) continue;
          const ddx = gx[g] - gx[h], ddy = gy[g] - gy[h];
          const d = Math.hypot(ddx, ddy) || 1;
          if (d < gap) {
            ax += (ddx / d) * (gap - d) * 32;
            ay += (ddy / d) * (gap - d) * 32;
          }
        }
        const ox = gx[g] - c, oy = gy[g] - c;
        const od = Math.hypot(ox, oy) || 1;
        if (od > inside) {
          ax -= (ox / od) * (od - inside) * 18;
          ay -= (oy / od) * (od - inside) * 18;
        }
        gvx[g] += ax * dt;
        gvy[g] += ay * dt;
        const v = Math.hypot(gvx[g], gvy[g]);
        if (v > maxV) {
          gvx[g] *= maxV / v;
          gvy[g] *= maxV / v;
        }
        gx[g] += gvx[g] * dt;
        gy[g] += gvy[g] * dt;
      }
    }

    function step(dt: number) {
      const c = size / 2;
      const L = size * 0.31; // the word spans ~56% of the canvas width (~70% of the sphere)
      const e = time - splitAt;
      splitMode = e < BURST_END ? 1 : e < ROAM_END ? 2 : e < REGROUP_END ? 3 : 0;
      swell = e < BURST_END ? e / BURST_END : e < ROAM_END ? 1 : e < REGROUP_END ? 1 - (e - ROAM_END) / (REGROUP_END - ROAM_END) : 0;
      const split = splitMode === 1 || splitMode === 2;
      if (split) stepGroups(dt);

      const kWord = 14 + 26 * Math.min(1, (time - started) / ASSEMBLE); // spring stiffens as it assembles
      // Burst: loose, so particles fly. Roam: medium, balls hold together but stay alive.
      const k = splitMode === 1 ? 5 : splitMode === 2 ? 12 : kWord;
      const damp = 2 * Math.sqrt(k) * 0.55; // slightly under-damped: settles with a little life
      const wander = size * 0.006;
      const reach = size * 0.17;
      const push = size * 9;
      const swarmR = size * 0.07;

      for (let i = 0; i < nLetters; i++) {
        let tx: number, ty: number;
        if (split) {
          const g = group[i];
          const a = orbitA[i] + time * orbitW[i];
          const r = orbitR[i] * swarmR * (1 + 0.15 * Math.sin(time * 2 + g));
          tx = gx[g] + Math.cos(a) * r;
          ty = gy[g] + Math.sin(a) * r * 0.85;
        } else {
          tx = c + ux[i] * L + Math.sin(time * freq[i] + phase[i]) * wander;
          ty = c + uy[i] * L + Math.cos(time * freq[i] * 1.3 + phase[i]) * wander;
        }
        let ax = (tx - px[i]) * k - vx[i] * damp;
        let ay = (ty - py[i]) * k - vy[i] * damp;
        const ddx = px[i] - pointerX, ddy = py[i] - pointerY;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < reach * reach) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / reach) * push;
          ax += (ddx / d) * f;
          ay += (ddy / d) * f;
        }
        vx[i] += ax * dt;
        vy[i] += ay * dt;
        px[i] += vx[i] * dt;
        py[i] += vy[i] * dt;
      }

      for (let i = 0; i < nDust; i++) {
        dx[i] += dvx[i] * dt;
        dy[i] += dvy[i] * dt;
        if (dx[i] < -1) dx[i] += 2; else if (dx[i] > 1) dx[i] -= 2;
        if (dy[i] < -1) dy[i] += 2; else if (dy[i] > 1) dy[i] -= 2;
      }
    }

    function draw() {
      const c = size / 2;
      const R = size * 0.44 * (1 + 0.04 * swell);
      const split = splitMode === 1 || splitMode === 2;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, size, size);

      // Breathing glow behind the letters.
      const breathe = 0.5 + 0.5 * Math.sin((time * TAU) / 4);
      const [lr, lg, lb] = letterRgb;
      const glow = ctx!.createRadialGradient(c, c, 0, c, c, R * 0.9);
      glow.addColorStop(0, `rgba(${lr},${lg},${lb},${(dark ? 0.16 : 0.08) + breathe * (dark ? 0.06 : 0.03)})`);
      glow.addColorStop(1, `rgba(${lr},${lg},${lb},0)`);
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, size, size);

      ctx!.globalCompositeOperation = dark ? "lighter" : "source-over";

      // Sphere: rotate around Y with a fixed tilt; depth drives size and opacity.
      const theta = reduceMotion ? 0.6 : (time * TAU) / REVOLUTION;
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      const tilt = 0.35, cosX = Math.cos(tilt), sinX = Math.sin(tilt);
      const base = size / 420;
      for (let i = 0; i < nSphere; i++) {
        const x1 = sx[i] * cosT + sz[i] * sinT;
        const z1 = -sx[i] * sinT + sz[i] * cosT;
        const y2 = sy[i] * cosX - z1 * sinX;
        const z2 = sy[i] * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 back … 1 front
        const persp = 0.9 + z2 * 0.08; // front points sit slightly wider: a hint of perspective
        const x = c + x1 * R * persp;
        const y = c + y2 * R * persp;
        ctx!.globalAlpha = (dark ? 0.2 : 0.22) + depth * (dark ? 0.45 : 0.4);
        const s = (1.2 + depth * 1.6) * base * (dark ? 3.2 : 1.5);
        ctx!.drawImage(letterSprite, x - s / 2, y - s / 2, s, s);
      }

      // Dust.
      for (let i = 0; i < nDust; i++) {
        ctx!.globalAlpha = dark ? 0.35 : 0.25;
        const s = 1.4 * base * (dark ? 3 : 1.4);
        ctx!.drawImage(letterSprite, c + dx[i] * c - s / 2, c + dy[i] * c - s / 2, s, s);
      }

      // Letters, with random twinkles.
      for (let i = 0; i < nLetters; i++) {
        const tw = Math.pow(Math.max(0, Math.sin(time * freq[i] * 1.7 + phase[i] * 3)), 12);
        ctx!.globalAlpha = Math.min(1, (dark ? 0.46 : 0.72) + tw * 0.5);
        const s = dot[i] * (1.3 + tw * 1.3) * base * (dark ? 3.4 : 1.6);
        // While split, each small swarm's core glows mint (the site's "running" colour).
        const mint = isMint[i] || (split && orbitR[i] < 0.32);
        ctx!.drawImage(mint ? mintSprite : letterSprite, px[i] - s / 2, py[i] - s / 2, s, s);
      }

      ctx!.globalCompositeOperation = "source-over";

      // Heartbeat ring from the centre, plus tap ripples.
      const [mr, mg, mb] = mintRgb;
      ctx!.lineWidth = 1.2;
      const beat = reduceMotion || swell > 0 ? 1 : (time % PULSE_EVERY) / 2.6; // paused while split
      if (beat < 1) {
        ctx!.globalAlpha = 0.28 * (1 - beat);
        ctx!.strokeStyle = `rgb(${lr},${lg},${lb})`;
        ctx!.beginPath();
        ctx!.arc(c, c, R * (0.35 + beat * 0.75), 0, TAU);
        ctx!.stroke();
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = (time - ripples[i].t0) / 0.9;
        if (p >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        ctx!.globalAlpha = 0.45 * (1 - p);
        ctx!.strokeStyle = `rgb(${mr},${mg},${mb})`;
        ctx!.beginPath();
        ctx!.arc(ripples[i].x, ripples[i].y, size * 0.05 + p * size * (ripples[i].big ? 0.45 : 0.25), 0, TAU);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      time += dt;
      step(dt);
      draw();
      rafId = requestAnimationFrame(frame);
    }

    /* ---------- Lifecycle: size, visibility, theme ---------- */
    let visible = false;

    function start() {
      if (rafId || reduceMotion || !ready || !visible || document.hidden) return;
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    function drawStill() {
      // Reduced motion: either the formed word or the small swarms on a ring, as one frame.
      const c = size / 2, L = size * 0.31;
      splitMode = stillSplit ? 2 : 0;
      swell = 0;
      const ringR = size * 0.44 * 0.5, swarmR = size * 0.07;
      for (let i = 0; i < nLetters; i++) {
        if (stillSplit) {
          const g = group[i];
          const ga = -Math.PI / 2 + (g / nGroups) * TAU;
          px[i] = c + Math.cos(ga) * ringR + Math.cos(orbitA[i]) * orbitR[i] * swarmR;
          py[i] = c + Math.sin(ga) * ringR + Math.sin(orbitA[i]) * orbitR[i] * swarmR * 0.85;
        } else {
          px[i] = c + ux[i] * L;
          py[i] = c + uy[i] * L;
        }
      }
      draw();
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const next = Math.round(rect.width);
      if (!next || next === size) return;
      const firstBuild = size === 0;
      size = next;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(size * dpr);
      canvas!.height = Math.round(size * dpr);
      if (!ready) return;
      build();
      if (!firstBuild) started = time - ASSEMBLE; // re-layout without replaying the assembly
      if (reduceMotion) drawStill();
      else draw();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => {
      readTheme();
      if (!rafId && ready) {
        if (reduceMotion) drawStill();
        else draw();
      }
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    // TEMP-DEBUG (remove after verification)
    (window as unknown as Record<string, unknown>).__swarm = {
      advance(sec: number) {
        const n = Math.round(sec * 60); let worst = 0;
        for (let i = 0; i < n; i++) { const a = performance.now(); time += 1 / 60; step(1 / 60); worst = Math.max(worst, performance.now() - a); }
        const t = performance.now(); draw(); return { worstStepMs: worst, drawMs: performance.now() - t };
      },
      split: (x: number, y: number) => split(x, y),
      state: () => {
        let maxV = 0, outside = 0; const c = size / 2, R = size * 0.44;
        for (let i = 0; i < nLetters; i++) { maxV = Math.max(maxV, Math.hypot(vx[i], vy[i])); if (Math.hypot(px[i] - c, py[i] - c) > R * 1.15) outside++; }
        const minGap = (() => { let m = 1e9; for (let g = 0; g < nGroups; g++) for (let h = g + 1; h < nGroups; h++) m = Math.min(m, Math.hypot(gx[g] - gx[h], gy[g] - gy[h])); return Math.round(m); })();
        const maxCentre = Math.round(Math.max(...Array.from(gx, (x, g) => Math.hypot(x - c, gy[g] - c))) / R * 100);
        return { splitMode, swell: +swell.toFixed(2), nGroups, size, maxV: Math.round(maxV), outsideSphere: outside, minGap, maxCentrePctOfR: maxCentre, finite: Array.from(px).every(Number.isFinite) };
      },
      strip(times: number[], w = 120) {
        const o = document.createElement("canvas"); o.width = w * times.length; o.height = w;
        const g = o.getContext("2d")!; g.fillStyle = dark ? "#0a0a0f" : "#fdfdfd"; g.fillRect(0, 0, o.width, w);
        let t0 = 0; times.forEach((t, k) => { const n = Math.round((t - t0) * 60); for (let i = 0; i < n; i++) { time += 1 / 60; step(1 / 60); } t0 = t; draw(); g.drawImage(canvas!, k * w, 0, w, w); });
        return o.toDataURL("image/jpeg", 0.75);
      },
    };

    // Sample the letters only once the body font has loaded, so the word has the right shape.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ready = true;
      size = 0;
      resize();
      started = time;
      if (reduceMotion) drawStill();
      else start();
    });

    return () => {
      cancelled = true;
      apiRef.current = null;
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /** Mouse/touch split at the click point; keyboard (Enter/Space, detail 0) splits from the centre. */
  function onClick(event: MouseEvent<HTMLButtonElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const keyboard = event.detail === 0;
    apiRef.current?.split(keyboard ? r.width / 2 : event.clientX - r.left, keyboard ? r.height / 2 : event.clientY - r.top);
  }

  return (
    <div className={`relative size-full ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label="Split the swarm"
        className="block size-full cursor-pointer touch-pan-y rounded-full border-0 bg-transparent p-0"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
      </button>
      {/* Discoverability hint; disappears after the first split. */}
      <p
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 -bottom-7 m-0 text-center font-code text-xs text-dim transition-opacity duration-500 ${
          hintSeen ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="[@media(pointer:coarse)]:hidden">Click the swarm</span>
        <span className="hidden [@media(pointer:coarse)]:inline">Tap the swarm</span>
      </p>
    </div>
  );
}
