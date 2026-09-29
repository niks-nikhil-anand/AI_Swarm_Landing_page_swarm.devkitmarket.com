"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, routes, type NavLink } from "../data/content";
import { icons } from "../data/icons";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

/** Navbar layout and interactions match DevKit Market's so the two sites feel like one family. */

const spySections = navLinks.flatMap((link) => (link.section ? [link.section] : []));
/** Sticky bar height plus breathing room: a section counts as current once its top passes this line. */
const spyOffset = 120;

/** Id of the homepage section currently under the navbar. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState(spySections[0]);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;

    function update() {
      frame = 0;
      let current = spySections[0];
      for (const id of spySections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= spyOffset) current = id;
      }
      setActive(current);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return active;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(onHome);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (link: NavLink) =>
    link.section ? onHome && activeSection === link.section : pathname === link.href;
  const ariaCurrent = (link: NavLink) =>
    isActive(link) ? (link.section ? ("location" as const) : ("page" as const)) : undefined;

  const close = () => setOpen(false);

  /**
   * On the homepage, scroll to the section ourselves instead of relying on <Link>'s hash
   * handling, which waits a frame and can miss while the drawer is locking page scroll.
   * Elsewhere (e.g. /methodology) the Link navigates to "/#section" as normal.
   */
  function goTo(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (!onHome || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = href === "/" ? "top" : href.startsWith("/#") ? href.slice(2) : null;
    const target = id === "top" ? document.body : id && document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    // Next tick: the drawer's scroll lock is released before we scroll.
    setTimeout(() => {
      if (id === "top") window.scrollTo({ top: 0, behavior });
      else target.scrollIntoView({ behavior, block: "start" });
      history.pushState(null, "", id === "top" ? "/" : `#${id}`);
    }, 0);
  }

  // Lock page scroll behind the drawer; Esc closes it and returns focus to the menu button.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Arriving on the homepage with a hash (e.g. /methodology → "/#waitlist"): make sure we land on it.
  useEffect(() => {
    if (!onHome || !window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (!target) return;
    const timer = setTimeout(() => target.scrollIntoView({ block: "start" }), 0);
    return () => clearTimeout(timer);
  }, [onHome]);

  // The drawer only exists below lg; close it if the window grows past that.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
          <Logo byline />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-5 p-0 2xl:gap-8">
              {navLinks.map((link) => {
                const active = isActive(link);
                return (
                  <li key={link.label} className={link.secondary ? "hidden xl:block" : undefined}>
                    <Link
                      href={link.href}
                      onClick={(event) => goTo(event, link.href)}
                      aria-current={ariaCurrent(link)}
                      className={`relative py-1 text-[13.5px] transition-colors max-xl:inline-block max-xl:py-2.5 ${
                        active ? "font-semibold text-brand" : "text-muted hover:text-fg"
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute right-0 -bottom-1 left-0 h-[1.5px] rounded-full bg-brand shadow-[0_0_8px_rgba(124,111,247,0.5)] max-xl:bottom-1" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-3.5">
            <div className="hidden items-center pr-1 lg:flex">
              <ThemeToggle />
            </div>
            <Link
              href={routes.navbar}
              onClick={(event) => goTo(event, routes.navbar)}
              className="hidden items-center justify-center rounded-[10px] bg-brand px-[18px] py-2 text-[13.5px] font-medium text-white shadow-lg shadow-brand/20 transition-all hover:-translate-y-px hover:bg-[#8d82f8] max-lg:py-2.5 sm:inline-flex"
            >
              Join the waitlist
            </Link>
            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative border-0 bg-transparent p-2.5 text-muted transition-colors hover:text-fg lg:hidden"
            >
              <Icon d={open ? icons.close : icons.menu} size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise trap these fixed layers inside the bar. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-[70] w-[85%] max-w-[300px] border-r border-line bg-ink shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <div className="mb-8 flex items-center justify-between border-b border-line pb-4">
            <Logo onClick={close} />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="rounded-lg border-0 bg-line/50 p-2 text-muted transition-colors hover:text-fg"
            >
              <Icon d={icons.close} size={20} />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(event) => goTo(event, link.href)}
                  aria-current={ariaCurrent(link)}
                  className={`flex items-center justify-between rounded-[10px] px-4 py-3 text-[15.5px] transition-all ${
                    active
                      ? "bg-brand/5 font-bold text-brand"
                      : "font-medium text-muted hover:bg-brand/5 hover:text-brand"
                  }`}
                >
                  {link.label}
                  {active && <span className="size-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(124,111,247,0.6)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-4 border-t border-line pt-8">
            <div className="flex items-center justify-between rounded-xl bg-line/30 px-4 py-2">
              <span className="text-[14px] font-medium text-muted">Theme</span>
              <ThemeToggle />
            </div>
            <Link
              href={routes.navbar}
              onClick={(event) => goTo(event, routes.navbar)}
              className="w-full rounded-[10px] bg-brand py-3.5 text-center text-[14.5px] font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:bg-[#8d82f8]"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
