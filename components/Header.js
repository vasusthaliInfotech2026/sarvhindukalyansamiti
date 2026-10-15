"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN, MORE } from "./nav";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const moreActive = MORE.some((m) => m.href === path);
  const cls = (a) => `relative rounded-full px-3 py-2 font-semibold transition ${a ? "bg-saffron text-white" : "text-navy hover:bg-sandal"}`;

  return (
    <header className={`sticky top-0 z-50 border-b-2 border-gold bg-cream/95 backdrop-blur transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 ${scrolled ? "h-[62px]" : "h-[76px]"}`}>
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-saffron bg-white font-head text-2xl text-saffron shadow-inner">ॐ</span>
          <span className="font-head text-lg leading-tight text-navy sm:text-xl">सर्व समाज<br className="sm:hidden" /> कल्याण समिति</span>
        </Link>

        <nav className="hidden items-center gap-0.5 text-[15px] xl:flex" aria-label="मुख्य मेनू">
          {MAIN.map((n) => <Link key={n.href} href={n.href} className={cls(path === n.href)}>{n.label}</Link>)}
          <div className="group relative">
            <button className={cls(moreActive)}>और देखें ▾</button>
            <div className="invisible absolute right-0 top-full w-56 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden rounded-xl border border-saffron/30 bg-white shadow-xl">
                {MORE.map((m) => (
                  <Link key={m.href} href={m.href} className={`block px-4 py-2.5 font-semibold transition hover:bg-sandal ${path === m.href ? "text-saffron" : "text-navy"}`}>{m.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/donate" className="btn btn-saffron ml-2 animate-ring">अभी दान करें</Link>
        </nav>

        <button onClick={() => setOpen(!open)} aria-label="मेनू" aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-lg border border-saffron text-2xl text-saffron xl:hidden">{open ? "✕" : "☰"}</button>
      </div>

      <nav className={`grid overflow-hidden bg-cream px-4 transition-all duration-300 xl:hidden ${open ? "max-h-[80vh] overflow-y-auto border-t border-saffron/30 pb-4" : "max-h-0"}`}>
        {[...MAIN, ...MORE].map((n) => (
          <Link key={n.href} href={n.href} className={`rounded-lg px-3 py-3 font-semibold ${path === n.href ? "bg-saffron text-white" : "text-navy"}`}>{n.label}</Link>
        ))}
        <Link href="/donate" className="btn btn-saffron mt-2">अभी दान करें</Link>
      </nav>
    </header>
  );
}
