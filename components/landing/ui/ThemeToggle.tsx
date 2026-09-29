"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

/** Animated sun/moon switch, ported from DevKit Market so both sites feel the same. */

const stars = [
  { size: 2, top: 6, left: 10, delay: "0s" },
  { size: 2, top: 14, left: 18, delay: "0.5s" },
  { size: 2, top: 8, left: 26, delay: "1s" },
  { size: 3, top: 18, left: 8, delay: "1.5s" },
  { size: 2, top: 22, left: 22, delay: "0.8s" },
];

const craters = [
  { size: 5, style: { top: 6, right: 5 }, delay: "0.05s" },
  { size: 3, style: { top: 14, right: 9 }, delay: "0.13s" },
  { size: 4, style: { bottom: 5, right: 7 }, delay: "0.21s" },
];

const noop = () => () => {};

/** False on the server and during hydration, true afterwards: the theme is only known in the browser. */
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useMounted();
  const [isAnimating, setIsAnimating] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!mounted) {
    return <div aria-hidden="true" className="h-[34px] w-[72px] shrink-0 animate-pulse rounded-full bg-line" />;
  }

  const isDark = resolvedTheme === "dark";

  function handleToggle() {
    if (isAnimating) return;
    setIsAnimating(true);
    // Let the ripple start before the page recolours.
    timers.current = [
      setTimeout(() => setTheme(isDark ? "light" : "dark"), 120),
      setTimeout(() => setIsAnimating(false), 700),
    ];
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="group relative isolate h-[34px] w-[72px] shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0 transition-transform duration-200 hover:scale-105 active:scale-[0.93]"
    >
      <span
        className="theme-toggle-track absolute inset-0 overflow-hidden rounded-full border-[1.5px] shadow-inner"
        style={{
          background: isDark
            ? "linear-gradient(135deg,#1a1a3e 0%,#0d1b4b 50%,#0a0a1f 100%)"
            : "linear-gradient(135deg,#74c0fc 0%,#4dabf7 40%,#a9d8f5 100%)",
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
        }}
      >
        {isAnimating && <span className="theme-flash pointer-events-none absolute inset-0 z-10 rounded-full bg-white" />}

        <span className="theme-toggle-stars absolute inset-0" style={{ opacity: isDark ? 1 : 0 }}>
          {stars.map((s, i) => (
            <span
              key={i}
              className="theme-twinkle absolute rounded-full bg-white"
              style={{ width: s.size, height: s.size, top: s.top, left: s.left, animationDelay: s.delay }}
            />
          ))}
          <span
            className="theme-shoot absolute rounded-full"
            style={{ top: 9, right: 8, width: 14, height: 1.5, background: "linear-gradient(to left, white, transparent)" }}
          />
        </span>

        <span className="theme-toggle-clouds absolute inset-0" style={{ opacity: isDark ? 0 : 1 }}>
          <span className="theme-float absolute" style={{ top: 8, left: 5 }}>
            <span className="absolute rounded-full bg-white/90" style={{ width: 14, height: 5 }} />
            <span className="absolute rounded-full bg-white/90" style={{ width: 8, height: 8, top: -4, left: 2 }} />
            <span className="absolute rounded-full bg-white/90" style={{ width: 6, height: 6, top: -3, left: 7 }} />
          </span>
          <span className="theme-float-slow absolute" style={{ top: 20, left: 9 }}>
            <span className="absolute rounded-full bg-white/60" style={{ width: 9, height: 4 }} />
            <span className="absolute rounded-full bg-white/60" style={{ width: 5, height: 5, top: -2, left: 1 }} />
          </span>
        </span>
      </span>

      <span
        className="theme-toggle-thumb absolute top-[4px] left-[4px] z-[2] flex size-[26px] items-center justify-center rounded-full"
        style={{
          transform: isDark ? "translateX(0px)" : "translateX(38px)",
          background: isDark
            ? "radial-gradient(circle at 35% 35%, #e8e8ff, #b0b0e0)"
            : "radial-gradient(circle at 38% 32%, #ffe57a, #ffb703)",
          boxShadow: isDark
            ? "inset -3px -2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.4)"
            : "0 0 10px rgba(255,183,3,0.6), 0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {isAnimating && (
          <span
            className="theme-ripple pointer-events-none absolute inset-0 rounded-full"
            style={{ background: isDark ? "rgba(110,91,255,0.4)" : "rgba(255,183,3,0.45)" }}
          />
        )}

        {!isDark && <span className="theme-sun-pulse absolute -z-10 rounded-full bg-yellow-300/40 blur-[5px]" style={{ inset: -4 }} />}

        <span
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.4s ease 0.1s" }}
        >
          {craters.map((c, i) => (
            <span
              key={i}
              className="theme-crater absolute rounded-full bg-black/[0.12]"
              style={{ width: c.size, height: c.size, animationDelay: c.delay, ...c.style }}
            />
          ))}
        </span>
      </span>
    </button>
  );
}
