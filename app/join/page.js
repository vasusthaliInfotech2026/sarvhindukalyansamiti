import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import VolunteerForm from "./VolunteerForm";

export const metadata = { title: "हमारे साथ जुड़ें | सर्व समाज कल्याण समिति" };

const OPTS = [
  {
    icon: "🪔",
    title: "आर्थिक सहयोग",
    sub: "आर्थिक सहयोग",
    desc: "अन्न सेवा, शिक्षा, चिकित्सा और मंदिर सेवा के पुण्य प्रकल्पों में अपना आर्थिक योगदान दें।",
    href: "/donate",
    cta: "सहयोग करें →",
  },
  {
    icon: "🙏",
    title: "स्वयंसेवक",
    sub: "समय और कौशल से सेवा",
    desc: "ज़मीनी स्तर पर सेवा कार्यों, वितरण अभियानों और शिविरों में अपना अमूल्य समय दें।",
    href: "#volunteer",
    cta: "आवेदन करें →",
  },
  {
    icon: "🩸",
    title: "रक्तदाता",
    sub: "रक्तदान / डोनर नेटवर्क",
    desc: "आपातकालीन स्थिति में किसी का जीवन बचाने के लिए हमारे रक्तदाता नेटवर्क से जुड़ें।",
    href: "#volunteer",
    cta: "रक्तदाता बनें →",
  },
  {
    icon: "🚩",
    title: "अभियान प्रचारक",
    sub: "अभियान साझा व प्रचारित करें",
    desc: "सोशल मीडिया और समाज के बीच समिति के सेवा अभियानों व सनातन मूल्यों की जानकारी पहुँचाएँ।",
    href: "/campaigns",
    cta: "अभियान देखें →",
  },
  {
    icon: "🏛️",
    title: "सामुदायिक सहयोगी",
    sub: "स्थानीय / संस्थागत सहयोग",
    desc: "अपने क्षेत्र, मंदिर समिति या संस्था के माध्यम से सामूहिक सेवा शिविरों का आयोजन करें।",
    href: "/contact",
    cta: "संपर्क करें →",
  },
];

const WHY_JOIN = [
  {
    title: "धर्म एवं मानव सेवा का संगम",
    desc: "सनातन मूल्यों के संरक्षण के साथ-साथ समाज के अंतिम व्यक्ति तक सीधी सहायता पहुँचाने का अवसर।",
  },
  {
    title: "100% पारदर्शिता एवं प्रामाणिकता",
    desc: "आपके द्वारा दिए गए समय, कौशल और सहयोग का उपयोग सीधे ज़मीनी सेवा प्रकल्पों में होता है।",
  },
  {
    title: "आपातकालीन सेवा नेटवर्क",
    desc: "रक्तदान, चिकित्सा सहायता और आपदा राहत के लिए एक संगठित एवं त्वरित परिवार का हिस्सा बनें।",
  },
  {
    title: "सम्मान एवं सेवा प्रमाण-पत्र",
    desc: "सक्रिय स्वयंसेवकों और रक्तदाताओं को समिति के विशेष कार्यक्रमों में सम्मानित किया जाता है।",
  },
];

export default function Join() {
  return (
    <>
      <PageBanner
        title="हमारे साथ जुड़ें"
        sub="सेवा के कई तरीके – अपने लिए चुनें"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Section Intro Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-xs font-bold text-saffron-deep">
            <span>✦</span>
            <span>एक साथ, एक विचार</span>
            <span>✦</span>
          </div>
          <h2 className="mt-3 font-head text-2xl font-bold text-navy sm:text-3xl">
            सेवा के पथ पर अपना माध्यम चुनें
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
            आप अपने समय, कौशल, रक्तदान या अर्थ सहयोग के माध्यम से समाज उत्थान के इस महायज्ञ में सहभागी बन सकते हैं।
          </p>
        </div>

        {/* 5 Service Options Cards - Redesigned for Hindu Charity Trust Look */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {OPTS.map((item, k) => (
            <Reveal key={item.title} delay={k * 80} from="bottom">
              <div
                href={item.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-saffron hover:shadow-md"
              >
                {/* Top Saffron Accent Bar */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600 via-saffron to-amber-500" />

                <div>
                  {/* Icon Badge & Subtle Om Accent */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200/60 bg-amber-50/80 text-2xl shadow-inner transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="select-none font-head text-lg font-bold text-amber-500/25 transition-colors group-hover:text-saffron/40">
                      ॐ
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="mt-4 font-head text-lg font-bold text-navy group-hover:text-saffron-deep">
                    {item.title}
                  </h3>
                  {/* <p className="mt-0.5 text-xs font-semibold text-saffron-deep">
                    {item.sub}
                  </p> */}

                  {/* Divider */}
                  <div className="my-3 h-px w-full bg-amber-100" />

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-navy/75 sm:text-[13px]">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action Text */}
                {/* <div className="mt-4 pt-2 text-xs font-bold text-saffron-deep transition-transform duration-200 group-hover:translate-x-1">
                  {item.cta}
                </div> */}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Balanced 2-Column Volunteer & Blood Donor Section */}
        <div
          id="volunteer"
          className="mt-14 scroll-mt-24 sm:mt-20"
        >
          <div className="grid items-stretch gap-8 lg:grid-cols-12">
            {/* Left Column: Trust Info & Spiritual Motivation (5 Cols) */}
            <Reveal className="lg:col-span-5" from="bottom">
              <div className="border border-amber-500/80 rangoli bg-saffron-100 relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-lg sm:p-8">
                {/* Decorative Om Watermark */}
                <div className="pointer-events-none absolute -bottom-10 -right-8 select-none text-[150px] font-bold leading-none text-white/10">
                  ॐ
                </div>

                <div className="relative z-10">
                  <span className="inline-block rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold tracking-wide text-saffron backdrop-blur-sm">
                    ✦ राष्ट्र एवं धर्म सेवा ✦
                  </span>

                  <h2 className="mt-4 font-head text-2xl font-extrabold leading-snug sm:text-3xl">
                    समिति परिवार का हिस्सा क्यों बनें?
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-black/90">
                    आपका थोड़ा सा समय या एक यूनिट रक्त किसी असहाय परिवार के चेहरे पर मुस्कान और जीवन की नई किरण ला सकता है।
                  </p>

                  {/* Key Points */}
                  <div className="mt-6 space-y-4">
                    {WHY_JOIN.map((point) => (
                      <div
                        key={point.title}
                        className="rounded-2xl border border-saffron/15 bg-white/10 p-3.5 backdrop-blur-sm"
                      >
                        <h3 className="flex items-center gap-2 font-head text-sm font-bold  sm:text-base text-saffron">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-saffron">
                            ✓
                          </span>
                          {point.title}
                        </h3>
                        <p className="mt-1 pl-7 text-xs leading-relaxed text-black/85 sm:text-[13px]">
                          {point.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Help Box */}
                {/* <div className="relative z-10 mt-8 rounded-2xl border border-white/20 bg-black/15 p-4">
                  <p className="text-xs font-medium text-amber-100">
                    किसी अन्य जानकारी या संस्थागत सहयोग के लिए:
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white">
                      📍 लखनऊ, उत्तर प्रदेश
                    </span>
                    <Link
                      href="/contact"
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-saffron-deep transition hover:bg-amber-50"
                    >
                      संपर्क करें →
                    </Link>
                  </div>
                </div> */}


              </div>
            </Reveal>

            {/* Right Column: Volunteer Form Container (7 Cols) */}
            <Reveal className="lg:col-span-7" from="bottom">
              <div className="relative h-full overflow-hidden rounded-3xl border border-amber-200/80 bg-white p-6 shadow-md sm:p-8">
                {/* Top Saffron Strip */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600 via-saffron to-amber-500" />

                <div className="mb-6 border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron">
                    पंजीकरण फॉर्म
                  </span>
                  <h2 className="mt-1 font-head text-2xl font-bold text-navy sm:text-3xl">
                    स्वयंसेवक बनने के लिए आवेदन
                  </h2>
                  <p className="mt-1 text-xs text-navy/70 sm:text-sm">
                    कृपया नीचे अपनी जानकारी भरें, हमारी टीम जल्द ही आपसे संपर्क करेगी।
                  </p>
                </div>

                {/* Existing Form Component */}
                <VolunteerForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

