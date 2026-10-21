import fs from "fs";
import path from "path";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";

export const metadata = { title: "हमारे कार्य | सर्व समाज कल्याण समिति" };

// अगर लोकल फोल्डर में फोटो नहीं है, तो ये High-Quality Real Images अपने आप दिखेंगी (Index या ID के हिसाब से)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85", // 1. अन्न सेवा एवं भोजन वितरण
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85", // 2. मानव सेवा एवं परिवार सहायता
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=85", // 3. अनाथ एवं जरूरतमंद बच्चों की सहायता
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=85", // 4. स्वास्थ्य एवं चिकित्सा सेवा
  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=85", // 5. रक्तदान एवं स्वास्थ्य जागरूकता
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=85", // 6. शिक्षा सहायता
  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=85", // 7. मंदिर एवं सनातन धर्म सेवा
  "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=1000&q=85", // 8. आपदा एवं आपातकालीन सहायता
];

// चेक करता है कि लोकल इमेज मौजूद है या नहीं, वरना Fallback Image देता है
const getServiceImage = (id, index) => {
  try {
    const localPath = path.join(process.cwd(), "public", "images", "services", `${id}.jpg`);
    if (fs.existsSync(localPath)) {
      return `/images/services/${id}.jpg`;
    }
  } catch (e) {
    // Server fs check fallback
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

export default function Services() {
  return (
    <>
      <PageBanner title="हमारे कार्य" sub="समिति क्या करती है – श्रेणी अनुसार कार्य" />

      <section className="max-w-7xl px-4 py-12 mx-auto overflow-x-clip sm:px-6 sm:py-16">
        {/* सेक्शन इंट्रो हेडर */}
        <div className="max-w-2xl mx-auto mb-12 text-center sm:mb-16">
          <span className="inline-block px-4 py-1.5 mb-3 text-xs font-bold tracking-wider uppercase rounded-full bg-saffron/15 text-saffron-deep border border-saffron/20">
            सेवा ही परमो धर्मः
          </span>
          <h2 className="text-2xl font-bold font-head text-navy sm:text-3xl md:text-4xl">
            समाज उत्थान के हमारे मुख्य प्रकल्प
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base">
            हम समाज के अंतिम व्यक्ति तक सहायता पहुँचाने और सनातन मूल्यों के संरक्षण के लिए विभिन्न क्षेत्रों में निरंतर कार्यरत हैं।
          </p>
        </div>

        {/* सर्विसेज लिस्ट */}
        <div className="space-y-8 sm:space-y-12">
          {SERVICES.map((s, k) => {
            const flip = k % 2 === 1;
            const imgSrc = getServiceImage(s.id, k);
            const num = String(k + 1).padStart(2, "0");

            return (
              <Reveal key={s.id} from={flip ? "right" : "left"}>
                <article
                  className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200/80 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-saffron/30 md:flex-row ${
                    flip ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* ================= IMAGE SECTION (No Icons) ================= */}
                  <div className="relative h-64 w-full overflow-hidden sm:h-72 md:h-auto md:min-h-[320px] md:w-[44%] md:shrink-0">
                    <img
                      src={imgSrc}
                      alt={s.title}
                      loading={k < 2 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Subtle Gradient Overlay for Depth */}
                    <div className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-t from-navy-dark/70 via-navy-dark/15 to-transparent md:bg-gradient-to-tr md:from-navy-dark/50 md:via-transparent md:to-transparent group-hover:opacity-80" />

                    {/* Decorative Inner Frame */}
                    <div className="absolute inset-3 border rounded-xl border-white/25 pointer-events-none" />

                    {/* Clean Number Badge on Image */}
                    <div
                      className={`absolute top-5 ${
                        flip ? "right-5" : "left-5"
                      } flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-navy shadow-md`}
                    >
                      <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                      <span>प्रकल्प #{num}</span>
                    </div>
                  </div>

                  {/* ================= CONTENT SECTION ================= */}
                  <div className="relative flex flex-col justify-between flex-1 min-w-0 p-6 sm:p-8 md:p-10">
                    {/* Background Watermark Number */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none select-none absolute top-4 ${
                        flip ? "left-6" : "right-6"
                      } font-head text-6xl font-extrabold text-stone-100 transition-colors duration-500 group-hover:text-saffron/10 sm:text-7xl`}
                    >
                      {num}
                    </span>

                    <div className="relative z-10">
                      {/* Title & Animated Underline */}
                      <h3 className="text-xl font-bold transition-colors duration-300 font-head text-navy group-hover:text-saffron-deep sm:text-2xl md:text-[26px] leading-snug">
                        {s.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="h-1 transition-all duration-500 rounded-full w-14 bg-saffron group-hover:w-24" />
                        <span className="w-2 h-1 rounded-full bg-saffron/40" />
                        <span className="w-1 h-1 rounded-full bg-saffron/20" />
                      </div>

                      {/* Clean 2-Column Checklist Grid */}
                      <ul className="grid grid-cols-1 gap-2.5 mt-6 sm:grid-cols-2 sm:gap-3">
                        {s.items.map((t) => (
                          <li
                            key={t}
                            className="flex items-start gap-2.5 rounded-xl bg-stone-50/90 border border-stone-200/60 p-3 text-sm text-navy/90 transition-colors duration-300 group-hover:bg-orange-50/40 group-hover:border-saffron/20 sm:text-[14.5px]"
                          >
                            {/* Clean SVG Checkmark */}
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-saffron/15 text-saffron-deep">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                            <span className="font-medium leading-snug">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-5 mt-7 border-t border-stone-100">
                      <Link
                        href="/campaigns"
                        className="btn btn-saffron inline-flex w-full items-center justify-center gap-2 rounded-xl !px-6 !py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:gap-3 hover:shadow-md sm:w-auto"
                      >
                        <span>इस सेवा में सहयोग करें</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>

                      <Link
                        href="/contact"
                        className="hidden text-xs font-semibold transition-colors text-navy/50 hover:text-saffron-deep sm:inline-block"
                      >
                        स्वयंसेवक बनें →
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* ================= BOTTOM CALL TO ACTION BANNER ================= */}
        <Reveal from="bottom">
          <div className="relative p-8 mt-16 overflow-hidden text-center text-white rounded-2xl bg-gradient-to-r from-navy-dark via-navy to-saffron-deep sm:p-12 shadow-lg">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold font-head sm:text-3xl">
                आपका एक छोटा सा सहयोग किसी का जीवन बदल सकता है
              </h3>
              <p className="mt-2.5 text-sm text-white/80 sm:text-base">
                अन्न दान, शिक्षा सहायता या चिकित्सा सेवा में भागीदार बनकर पुण्य के भागी बनें।
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link
                  href="/campaigns"
                  className="btn btn-saffron !px-7 !py-2.5 text-sm font-semibold shadow-lg"
                >
                  दान करें →
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 text-sm font-semibold text-white transition border rounded-full border-white/30 bg-white/10 hover:bg-white/20"
                >
                  हमसे संपर्क करें
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}