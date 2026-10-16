"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  { pos: "50% 62%", a: "आइए, मिलकर बनाएँ मंदिर सर्व समाज कल्याण समिति बचाएँ संस्कृति और करें समाज की सेवा।", b: "धर्म, सेवा और समाज कल्याण की दिशा में – सर्व हिन्दू कल्याण समिति धर्म, सेवा और समाज कल्याण की दिशा में कल्याण समिति धर्म, सेवा और समाज कल्याण की दिशा में हिन्दू कल्याण समिति ।", c1: ["दान करें", "/donate"], c2: ["हमारे कार्य देखें", "/social-work"] },
  { pos: "50% 62%", a: "सेवा से समाज का निर्माण", b: "सर्व समाज कल्याण समिति – मानव सेवा, शिक्षा, स्वास्थ्य और धर्म सेवा के कार्यों को पारदर्शिता के साथ आप तक पहुँचाने का मंच।", c1: ["दान करें", "/donate"], c2: ["हमारे कार्य देखें", "/social-work"] },
  { pos: "50% 30%", a: "आपका सहयोग, किसी के जीवन में नई उम्मीद", b: "अन्न सेवा, चिकित्सा, कन्या विवाह, शिक्षा और बुजुर्ग सेवा – अपनी पसंद के अभियान में सहयोग करें।", c1: ["सहयोग अभियान देखें", "/campaigns"], c2: ["अभी दान करें", "/donate"] },
  { pos: "88% 55%", a: "मंदिर एवं सनातन धर्म सेवा", b: "मंदिर सेवा, स्वच्छता अभियान और सांस्कृतिक कार्यक्रमों से अपनी परंपरा को सँजोएँ।", c1: ["हमारी सेवाएं", "/services"], c2: ["हमारे साथ जुड़ें", "/join"] },

];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), []);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), 6500);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  return (
    <section className="relative overflow-hidden bg-navy-dark" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
      <div className="relative h-[560px] sm:h-[640px]">
        {SLIDES.map((s, n) => (
          <div key={n} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <Image src="/images/mandi.jpg" alt="भव्य मंदिर" fill priority={n === 0} sizes="100vw"
              style={{ objectPosition: s.pos }} className={`object-cover ${n === i ? "animate-kenburns" : ""}`} />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-saffron-deep/40 via-transparent to-navy-dark/30" />
            <div className="relative flex items-center h-full px-4 pb-20 mx-auto max-w-7xl sm:px-16 sm:pb-28">
              {n === i && (
                <div className="max-w-2xl text-white lg:ml-[12%]">
                  <span className="inline-block px-4 py-1 text-sm border rounded-full animate-rise border-gold/70 bg-navy-dark/40 text-sandal backdrop-blur">ॐ सेवा परमो धर्मः</span>
                  <h1 className="mt-4 animate-rise font-head text-4xl leading-tight [animation-delay:.15s] sm:text-6xl">{s.a}</h1>
                  <p className="mt-5 max-w-xl animate-rise text-lg text-sandal [animation-delay:.3s] sm:text-xl">{s.b}</p>
                  <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:.45s]">
                    <Link href={s.c1[1]} className="btn btn-saffron animate-ring">{s.c1[0]}</Link>
                    <Link href={s.c2[1]} className="btn btn-outline">{s.c2[0]}</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <span aria-hidden className="pointer-events-none absolute -right-24 top-8 hidden animate-spin-slow select-none font-head text-[26rem] leading-none text-white/10 lg:block">ॐ</span>
      </div>
      <button onClick={() => go(i - 1)} aria-label="पिछला" className="absolute hidden text-2xl text-white transition -translate-y-1/2 rounded-full left-8 top-1/2 h-11 w-11 bg-saffron-light hover:bg-white/60 sm:block">‹</button>
      <button onClick={() => go(i + 1)} aria-label="अगला" className="absolute hidden text-2xl text-white transition -translate-y-1/2 rounded-full right-5 top-1/2 h-11 w-11 bg-saffron-light hover:bg-white/60 sm:block">›</button>
      <div className="absolute flex gap-2 -translate-x-1/2 bottom-8 left-1/2">
        {SLIDES.map((_, n) => <button key={n} onClick={() => go(n)} aria-label={`स्लाइड ${n + 1}`} className={`h-2.5 rounded-full transition-all duration-500 ${n === i ? "w-9 bg-saffron-light" : "w-2.5 bg-white/60"}`} />)}
      </div>
      <div className="scallop absolute inset-x-0 bottom-0 h-[18px]" />
    </section>
  );
}
