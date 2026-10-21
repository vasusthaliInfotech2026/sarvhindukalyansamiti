import fs from "fs";
import path from "path";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";

export const metadata = { title: "हमारे कार्य | सर्व समाज कल्याण समिति" };

// Agar local folder (/public/images/services/) mein photo nahi hai, to ye real photos dikhengi
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80", // 1. अन्न सेवा एवं भोजन वितरण
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80", // 2. मानव सेवा एवं परिवार सहायता
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", // 3. अनाथ एवं जरूरतमंद बच्चों की सहायता
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80", // 4. स्वास्थ्य एवं चिकित्सा सेवा
  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80", // 5. रक्तदान एवं स्वास्थ्य जागरूकता
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80", // 6. शिक्षा सहायता
  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80", // 7. मंदिर एवं सनातन धर्म सेवा
  "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&w=800&q=80", // 8. आपदा एवं आपातकालीन सहायता
];

const getServiceImage = (id, index) => {
  try {
    const localPath = path.join(
      process.cwd(),
      "public",
      "images",
      "services",
      `${id}.jpg`,
    );
    if (fs.existsSync(localPath)) {
      return `/images/services/${id}.jpg`;
    }
  } catch (e) {
    // Fallback if fs check fails
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

export default function Services() {
  return (
    <>
      <PageBanner
        title="हमारे कार्य"
        sub="समिति क्या करती है – श्रेणी अनुसार कार्य"
      />

      <section className="max-w-7xl px-4 py-10 mx-auto sm:px-6 sm:py-14">

        <div className="max-w-2xl mx-auto mb-12 text-center sm:mb-16">

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-xs font-bold text-saffron-deep">
                  <span>✦</span>
                  <span>सेवा ही परमो धर्मः</span>
                  <span>✦</span>
                </div>

          <h2 className="mt-4 text-2xl font-bold font-head text-navy sm:text-3xl md:text-4xl">
            समाज उत्थान के हमारे मुख्य प्रकल्प
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base">
            हम समाज के अंतिम व्यक्ति तक सहायता पहुँचाने और सनातन मूल्यों के संरक्षण के लिए विभिन्न क्षेत्रों में निरंतर कार्यरत हैं।
          </p>
        </div>

        {/* 2-2 Columns Simple Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {SERVICES.map((s, k) => {
            const imgSrc = getServiceImage(s.id, k);

            return (
              <Reveal key={s.id} from="bottom">
                <article className="flex flex-col h-full overflow-hidden transition duration-300 bg-white border shadow-sm rounded-2xl border-stone-200/80 hover:shadow-md">
                  {/* 1. Upar Image (No Icons) */}
                  <div className="relative w-full overflow-hidden h-52 sm:h-60 bg-stone-100">
                    <img
                      src={imgSrc}
                      alt={s.title}
                      loading={k < 2 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* 2. Niche Simple Content */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <h2 className="text-lg font-bold font-head text-navy sm:text-xl">
                      {s.title}
                    </h2>

                    {/* Simple Saffron Line */}
                    <div className="w-12 h-1 mt-2 rounded bg-saffron" />

                    {/* Easy to Read Bullet Points */}
                    <ul className="mt-4 mb-6 space-y-2 text-sm text-navy/85 sm:text-[15px] flex-1">
                      {s.items.map((t) => (
                        <li key={t} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Simple Action Button */}
                    <Link
                      href="/donate"
                      className="btn btn-saffron w-full !py-2.5 text-center text-sm font-medium rounded-xl"
                    >
                      इस सेवा में सहयोग करें →
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto my-12">
        <Reveal className="mx-auto max-w-7xl px-4">
          <div className=" relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-saffron-deep to-saffron px-6 py-12 text-center shadow-xl sm:px-12 md:py-12">
            {/* Decorative Background Watermark / Elements */}
            <div className="absolute -left-10 -top-10 text-9xl font-bold text-white/10 select-none pointer-events-none">
              ॐ
            </div>
            <div className="absolute -right-10 -bottom-10 text-9xl font-bold text-white/10 select-none pointer-events-none">
              ॐ
            </div>

            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="lAlign font-head text-2xl font-extrabold tracking-wide sm:text-3xl text-white">
                  आपका छोटा सहयोग, किसी का बड़ा सहारा
                </h2>

                <p className="lAlign mt-3 text-sm text-white/90 sm:text-base">
                  आपकी दी गई हर छोटी मदद समाज के जरूरतमंदों के जीवन में एक बड़ा
                  बदलाव ला सकती है। आइए, इस पुण्य कार्य में अपना योगदान दें।
                </p>
              </div>

              <div>
             <Link href="/donate" className="btn text-saffron-deep bg-white ml-1 animate-ring !px-4 !py-2 text-sm xl:ml-2 xl:!px-6 xl:text-base">दान करें</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Section 3: Bottom CTA Banner above Footer */}
      <section className="mx-auto my-12">
        <Reveal className="mx-auto max-w-7xl px-4">
          <div className="h-full card bg-gradient-to-br from-white to-sandal ctaBlock shadow-xl relative overflow-hidden max-w-7xl mx-auto rounded-3xl px-6 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-head text-2xl font-extrabold tracking-wide sm:text-3xl">
                  हमारे साथ सहभागी बनें
                </h2>
                <p className="mt-2 text-sm text-black/85 sm:text-base">
                  समिति की वर्तमान गतिविधियों और सदस्यता विकल्पों के बारे में
                  जानें।
                </p>
              </div>

              <div className="btnDiv flex flex-col gap-3 sm:flex-row sm:gap-4">
               <Link href="/join" className="btn btn-saffron ml-1 animate-ring !px-4 !py-2 text-sm xl:ml-2 xl:!px-6 xl:text-base">सदस्य बनें</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
