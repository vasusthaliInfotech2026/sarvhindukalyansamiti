"use client";
import { useEffect, useRef, useState } from "react";
export default function Reveal({ children, delay = 0, className = "", from = "up" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const off = from === "left" ? "-translate-x-10" : from === "right" ? "translate-x-10" : "translate-y-8";
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${on ? "translate-x-0 translate-y-0 opacity-100" : `${off} opacity-0`} ${className}`}>{children}</div>
  );
}
