import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";

export const metadata = { title: "हमारे बारे में | सर्व समाज कल्याण समिति" };

const values = [
  ["🙏", "सेवा"],
  ["❤️", "मानवता"],
  ["🔍", "पारदर्शिता"],
  ["⚖️", "जिम्मेदारी"],
  ["🤝", "सामाजिक सहयोग"],
];

const principles = [
  "वास्तविक कार्य, वास्तविक फोटो/वीडियो",
  "लाभार्थियों की गरिमा, निजता और सहमति का सम्मान",
  "दान और प्रभाव के आँकड़ों में पारदर्शिता",
  "सरकारी योजनाओं में केवल ‘आवेदन/प्रक्रिया में सहायता’ – हम स्वयं लाभ जारी करने वाली संस्था नहीं हैं",
];

export default function About() {
  return (
    <>
      <PageBanner
        title="हमारे बारे में"
        sub="समिति का परिचय, उद्देश्य और सेवा के सिद्धांत"
      />

      {/* Section 1: Modern UI Image Box + Content Box */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-br from-white via-amber-50/30 to-white p-6 shadow-xl sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Image Box UI (Layered Frame, Zero Text on Image) */}
            <div className="lg:col-span-5">
              <Reveal from="left">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative Background Accent Layer */}
                  <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-gradient-to-br from-saffron/25 to-amber-300/40" />
                  <div className="absolute -left-3 -top-3 h-24 w-24 rounded-tl-2xl border-l-4 border-t-4 border-saffron/60" />

                  {/* Main Clean Image Frame */}
                  <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-white p-2 shadow-lg">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-amber-50">
                      <img
                        src="/images/architecture.jpg"
                        alt="समिति का परिचय"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Content Box UI */}
            <div className="lg:col-span-7">
              <Reveal from="right">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-xs font-bold text-saffron-deep">
                  <span>✦</span>
                  <span>समिति का परिचय</span>
                </div>

                <h2 className="mt-3 font-head text-3xl font-extrabold text-navy sm:text-4xl">
                  समिति का परिचय
                </h2>

                <div className="mt-4 rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-sm">
                  <p className="text-lg leading-relaxed text-navy/90">
                    सर्व समाज कल्याण समिति का उद्देश्य मानव सेवा, शिक्षा, स्वास्थ्य,
                    बुजुर्ग सहायता, निर्धन कन्या विवाह, रक्तदान और मंदिर सेवा जैसे
                    कार्यों को संगठित रूप से समाज तक पहुँचाना है। हम सेवा के साथ
                    विश्वास और पारदर्शिता को सबसे ऊपर रखते हैं।
                  </p>
                  <p className="mt-3 border-t border-amber-100 pt-3 text-xs text-navy/65">
                    पंजीकरण संख्या/तिथि एवं नेतृत्व की जानकारी, संस्था द्वारा
                    प्रदर्शित करने पर यहाँ जोड़ी जाएगी।
                  </p>
                </div>

                {/* सेवा के सिद्धांत UI Box */}
                <div className="mt-7">
                  <h3 className="flex items-center gap-2 font-head text-xl font-bold text-navy sm:text-2xl">
                    <span className="text-saffron">✦</span>
                    <span>सेवा के सिद्धांत</span>
                  </h3>

                  <ul className="mt-3.5 grid gap-2.5">
                    {principles.map((t, k) => (
                      <li
                        key={k}
                        className="flex items-start gap-3 rounded-xl border border-amber-100/90 bg-white px-4 py-3 text-sm font-medium text-navy/90 shadow-sm transition hover:border-saffron/40 hover:shadow sm:text-base"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm text-saffron">
                          🪔
                        </span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: हमारा विजन, हमारा मिशन with Background Images & हमारे मूल्य */}
      <section className="rangoli bg-sandal py-16">
        <div className="mx-auto max-w-6xl px-4">
          
          {/* विजन & मिशन Cards with Background Images */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Vision Card */}
            <Reveal from="left">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-amber-200/60 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                  <img
                    src="/images/architecture.jpg"
                    alt="Vision"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Light/Clean Gradient Overlay so text is clearly readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70" />
                </div>

                {/* Content Box */}
                <div className="relative z-10 p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-saffron/15 text-2xl text-saffron-deep">
                      🎯
                    </span>
                    <h3 className="font-head text-2xl font-bold text-saffron-deep">
                      हमारी दूरदृष्टि
                    </h3>
                  </div>
                  <p className="mt-4 text-lg font-medium leading-relaxed text-navy/90">
                    हमारी दूरदृष्टि एक ऐसे समाज का निर्माण करना है, जहाँ प्रत्येक जरूरतमंद व्यक्ति को बिना किसी भेदभाव के सही जानकारी, आवश्यक सहायता और जनकल्याणकारी योजनाओं का लाभ प्राप्त हो सके। हम एक ऐसे भविष्य की कल्पना करते हैं, जहाँ तकनीक, पारदर्शिता और सामाजिक सहयोग के माध्यम से लोगों का जीवन सरल और बेहतर बनाया जा सके। हमारा लक्ष्य ग्रामीण एवं शहरी क्षेत्रों के नागरिकों तक आवश्यक सेवाओं और सुविधाओं की जानकारी पहुँचाना तथा उन्हें आत्मनिर्भर बनने के लिए प्रोत्साहित करना है। हम चाहते हैं कि कोई भी व्यक्ति जानकारी या संसाधनों की कमी के कारण अपने अधिकारों और अवसरों से वंचित न रहे। हमारा विश्वास है कि जागरूकता, समान अवसर और सामूहिक प्रयासों से एक सशक्त, समावेशी और खुशहाल समाज का निर्माण संभव है।
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Mission Card */}
            <Reveal from="right">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-amber-200/60 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0">
                  <img
                    src="/images/architecture.jpg"
                    alt="Mission"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Light/Clean Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/70" />
                </div>

                {/* Content Box */}
                <div className="relative z-10 p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-2xl text-navy">
                      🚩
                    </span>
                    <h3 className="font-head text-2xl font-bold text-navy">
                      हमारा उद्देश्य
                    </h3>
                  </div>
                  <p className="mt-4 text-lg font-medium leading-relaxed text-navy/90">
                   हमारा उद्देश्य वास्तविक सेवा कार्यों और सही जानकारी के माध्यम से जरूरतमंद लोगों तक पारदर्शी एवं आसान सहायता पहुँचाना है। हम नागरिकों को सरकारी योजनाओं, जनकल्याणकारी सेवाओं और आवश्यक सुविधाओं से संबंधित उपयोगी जानकारी उपलब्ध कराने के लिए प्रतिबद्ध हैं। हमारा प्रयास है कि प्रत्येक व्यक्ति बिना अनावश्यक परेशानियों के उपलब्ध सेवाओं का लाभ उठा सके। हम तकनीक के माध्यम से सेवाओं को सरल, सुलभ और प्रभावी बनाना चाहते हैं। साथ ही, लोगों को उनके अधिकारों के प्रति जागरूक करना, जरूरतमंद परिवारों का सहयोग करना और समाज में सेवा एवं सहयोग की भावना को बढ़ावा देना हमारा प्रमुख लक्ष्य है।
                  </p>
                </div>
              </div>
            </Reveal>

          </div>

          <section className="rangoli bg-sandal py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Heading */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100/80 px-4 py-1 text-xs font-bold uppercase tracking-widest text-saffron-deep">
            ✦ हमारे आदर्श ✦
          </span>
          <h2 className="mt-3 font-head text-3xl font-extrabold text-navy sm:text-4xl">
            हमारे मूल्य
          </h2>
          <div className="mx-auto mt-2 flex items-center justify-center gap-2 text-saffron">
            <span className="h-px w-12 bg-amber-300" />
            <span className="text-lg">ॐ</span>
            <span className="h-px w-12 bg-amber-300" />
          </div>
        </div>

        {/* Modern 5-Column Grid with Floating Cards & Hover Glow */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {values.map(([icon, label, subtitle], k) => (
            <Reveal key={label} delay={k * 80}>
              <div className="group relative h-full rounded-2xl border border-amber-200/70 bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-saffron hover:shadow-xl">
                {/* Top Glow Accent on Hover */}
                {/* <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-saffron to-saffron-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100" /> */}

                {/* Icon Container with Soft Background */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110">
                  {icon}
                </div>

                <h3 className="mt-4 font-head text-xl font-bold text-navy">
                  {label}
                </h3>
                <p className="mt-1.5 text-xs font-medium text-navy/60">
                  {subtitle}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

          {/* हमारे मूल्य */}
          {/* <div className="mt-16">
            <SectionTitle title="हमारे मूल्य" />
            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">
              {values.map(([i, t], k) => (
                <Reveal key={t} delay={k * 90}>
                  <div className="card card-hover rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <p className="text-4xl">{i}</p>
                    <p className="mt-3 font-head text-xl font-bold text-navy">
                      {t}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div> */}

          {/* CTA Button */}
          <div className="mt-0 text-center">
            <Link href="/donate" className="btn btn-saffron">
              हमारे मिशन में सहयोग करें
            </Link>
          </div>

        </div>
      </section>

      {/* Section 3: Bottom CTA Banner above Footer */}
      <section className="ctaBlock bg-gradient-to-r from-navy via-saffron-deep to-saffron py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-head text-2xl font-extrabold tracking-wide sm:text-3xl">
              हमारे साथ सहभागी बनें
            </h2>
            <p className="mt-2 text-sm text-white/85 sm:text-base">
              समिति की वर्तमान गतिविधियों और सदस्यता विकल्पों के बारे में जानें।
            </p>
          </div>


<div className="btnDiv flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/join"
            className="relative mt-6 bg-amber-200 btn text-saffron-deep hover:bg-navy hover:text-white"
          >
            <span>सदस्य बनें</span>
           
          </Link>

          <Link href="/donate" className="relative mt-6 bg-white btn text-saffron-deep hover:bg-navy hover:text-white">अभी दान करें</Link>
</div>


        </div>
      </section>
    </>
  );
}