"use client";
import { useEffect, useRef, useState } from "react";
export default function Progress({ pct }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setW(pct); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div ref={ref} className="h-3 overflow-hidden rounded-full bg-sandal" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-leaf to-saffron-light transition-all duration-[1600ms] ease-out" style={{ width: `${w}%` }} />
    </div>
  );
}
