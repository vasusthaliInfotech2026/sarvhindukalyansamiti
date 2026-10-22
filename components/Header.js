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
  const cls = (a) => `whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold transition xl:px-3 xl:text-[15px] ${a ? "bg-saffron text-white" : "text-navy hover:bg-sandal"}`;

  return (
    
    <>
      <div className="bg-gradient-to-r from-saffron-deep via-saffron to-saffron-light py-2 text-center text-sm tracking-[0.1em] text-white">
        {/* <span className="text-navy">✺</span> */}
        <span>✦</span>
        <span className="mx-3 font-head">धर्म</span>
        {/* <span className="text-sandal">•</span> */}
        <span>✦</span>
        <span className="mx-3 font-head">संस्कृति</span>
        {/* <span className="text-sandal">•</span> */}
        <span>✦</span>
        <span className="mx-3 font-head">समर्पण</span>
        {/* <span className="text-navy">✺</span> */}
        <span>✦</span>
      </div>

      <header className="sticky top-0 z-50 border-b shadow-sm border-saffron/20 bg-cream/95 backdrop-blur">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 ${scrolled ? "h-[62px]" : "h-[76px]"}`}>
        <Link href="/" className="flex items-center gap-3">
          <span className="grid text-2xl bg-white border-2 rounded-full shadow-inner h-11 w-11 place-items-center border-saffron font-head text-saffron">ॐ</span>
          <span className="text-lg leading-tight font-head text-navy lg:text-base xl:text-xl">सर्व हिन्दू <br className="sm:hidden" /> कल्याण समिति</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="मुख्य मेनू">
          {MAIN.map((n) => <Link key={n.href} href={n.href} className={cls(path === n.href)}>{n.label}</Link>)}
          <div className="relative group">
            {/* <button className={cls(moreActive)}>और देखें ▾</button> */}
            <div className="absolute right-0 invisible w-56 pt-2 transition-all duration-200 translate-y-2 opacity-0 top-full group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="overflow-hidden bg-white border shadow-xl rounded-xl border-saffron/30">
                {MORE.map((m) => (
                  <Link key={m.href} href={m.href} className={`block px-4 py-2.5 font-semibold transition hover:bg-sandal ${path === m.href ? "text-saffron" : "text-navy"}`}>{m.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/donate" className="btn btn-saffron ml-1 animate-ring !px-4 !py-2 text-sm xl:ml-2 xl:!px-6 xl:text-base">दान करें</Link>
        </nav>

        <button onClick={() => setOpen(!open)} aria-label="मेनू" aria-expanded={open}
          className="grid text-2xl border rounded-lg h-11 w-11 place-items-center border-saffron text-saffron lg:hidden">{open ? "✕" : "☰"}</button>
      </div>

      <nav className={`grid overflow-hidden bg-cream px-4 transition-all duration-300 lg:hidden ${open ? "max-h-[80vh] overflow-y-auto border-t border-saffron/30 pb-4" : "max-h-0"}`}>
        {[...MAIN, ...MORE].map((n) => (
          <Link key={n.href} href={n.href} className={`rounded-lg px-3 py-3 font-semibold ${path === n.href ? "bg-saffron text-white" : "text-navy"}`}>{n.label}</Link>
        ))}
        <Link href="/donate" className="mt-2 btn btn-saffron">दान करें</Link>
      </nav>
    </header>
    </>
  );
}