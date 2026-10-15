import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CampaignCard from "@/components/CampaignCard";
import SampleNote from "@/components/SampleNote";
import { SERVICES, CAMPAIGNS, ACTIVITIES, EVENTS } from "@/lib/data";

const STATS = [[12500, "+", "भोजन वितरण"], [3200, "+", "परिवारों तक सहायता"], [48, "", "स्वास्थ्य/रक्तदान शिविर"], [350, "+", "स्वयंसेवक"]];
const SHLOK = "॥ सेवा परमो धर्मः ॥   ॥ परोपकाराय पुण्याय ॥   ॥ सर्वे भवन्तु सुखिनः ॥   ॥ नर सेवा ही नारायण सेवा ॥   ";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <div className="overflow-hidden bg-navy py-2.5 text-sandal">
        <div className="flex text-lg whitespace-pre w-max animate-marquee font-head">{SHLOK.repeat(6)}</div>
      </div>

      <section className="max-w-4xl px-4 py-16 mx-auto text-center">
        <Reveal>
          <h2 className="text-3xl font-head text-navy sm:text-4xl">विश्वास · पारदर्शिता · आसान सहयोग</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy/80">सर्व समाज कल्याण समिति सामाजिक, मानवीय, स्वास्थ्य, शिक्षा, बुजुर्ग सहायता, निर्धन कन्या विवाह, रक्तदान और मंदिर सेवा से जुड़े कार्यों को एक व्यवस्थित डिजिटल मंच के माध्यम से समाज तक पहुँचाती है।</p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link href="/donate" className="btn btn-saffron">अभी सहयोग करें</Link>
            <Link href="/social-work" className="btn btn-navy">हमारे कार्य देखें</Link>
          </div>
        </Reveal>
      </section>

      <section className="py-16 rangoli bg-sandal">
        <div className="px-4 mx-auto max-w-7xl">
          <SectionTitle title="हमारी प्रमुख सेवाएं" sub="जरूरतमंदों तक पहुँचती दस सेवा श्रेणियाँ" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {SERVICES.map((s, k) => (
              <Reveal key={s.id} delay={(k % 5) * 80}>
                <Link href="/services" className="block h-full text-center card card-hover">
                  <span className="grid mx-auto text-3xl rounded-full h-14 w-14 place-items-center bg-sandal">{s.icon}</span>
                  <p className="mt-3 font-semibold text-navy">{s.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 mx-auto max-w-7xl">
        <SectionTitle title="सक्रिय सहयोग अभियान" sub="अपनी पसंद के अभियान में योगदान करें" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGNS.slice(0, 3).map((c, k) => <Reveal key={c.id} delay={k * 120}><CampaignCard c={c} /></Reveal>)}
        </div>
        <div className="mt-8 text-center"><Link href="/campaigns" className="btn btn-navy">सभी अभियान देखें</Link></div>
      </section>

      <section className="relative py-16 overflow-hidden text-white bg-gradient-to-br from-navy-dark via-navy to-saffron-deep">
        <div className="absolute inset-0 rangoli opacity-40" />
        <div className="relative px-4 mx-auto max-w-7xl">
          <Reveal><h2 className="mb-10 text-3xl text-center font-head sm:text-4xl">हमारा प्रभाव</h2></Reveal>
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(([n, s, l]) => (
              <div key={l}><p className="text-5xl font-head text-saffron-light"><CountUp to={n} suffix={s} /></p><p className="mt-1 text-lg text-sandal">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 mx-auto max-w-7xl">
        <SectionTitle title="हाल के सामाजिक कार्य" />
        <div className="grid gap-6 md:grid-cols-3">
          {ACTIVITIES.slice(0, 3).map((a, k) => (
            <Reveal key={a.title} delay={k * 120}>
              <div className="h-full border-l-4 card card-hover border-l-saffron">
                <span className="text-4xl">{a.icon}</span>
                <h3 className="mt-2 text-xl font-head text-navy">{a.title}</h3>
                <p className="text-sm font-semibold text-saffron-deep">{a.date} · {a.place}</p>
                <p className="mt-2 text-navy/75">{a.sum}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SampleNote />
      </section>

      <section className="py-16 bg-sandal">
        <div className="grid items-center gap-10 px-4 mx-auto max-w-7xl md:grid-cols-2">
          <Reveal from="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-gold shadow-2xl">
              <Image src="/images/mandi.jpg" alt="मंदिर परिसर" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 hover:scale-105" style={{ objectPosition: "50% 60%" }} />
            </div>
          </Reveal>
          <Reveal from="right">
            <h2 className="text-3xl font-head text-navy sm:text-4xl">मंदिर एवं सनातन धर्म सेवा</h2>
            <ul className="mt-5 space-y-2 text-lg">
              {["मंदिर सेवा एवं रखरखाव में सहयोग", "मंदिर स्वच्छ अभियान", "धार्मिक एवं सांस्कृतिक कार्यक्रम", "धार्मिक साहित्य/सामग्री का वितरण"].map((t) => <li key={t} className="flex gap-2"><span className="text-saffron">🪔</span>{t}</li>)}
            </ul>
            <Link href="/donate?campaign=mandir-seva" className="mt-6 btn btn-saffron">मंदिर सेवा में सहयोग करें</Link>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 mx-auto max-w-7xl">
        <SectionTitle title="आगामी कार्यक्रम एवं शिविर" />
        <div className="grid gap-5 md:grid-cols-3">
          {EVENTS.filter((e) => e.up).map((e, k) => (
            <Reveal key={e.title} delay={k * 120}>
              <div className="h-full card card-hover">
                <p className="inline-block px-3 py-1 text-sm font-semibold text-white rounded-full bg-saffron">{e.date}</p>
                <h3 className="mt-3 text-xl font-head text-navy">{e.title}</h3>
                <p className="mt-1 text-navy/75">🕒 {e.time}</p><p className="text-navy/75">📍 {e.place}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-6 px-4 mx-auto max-w-7xl md:grid-cols-2">
        <Reveal from="left"><div className="h-full card bg-gradient-to-br from-white to-sandal"><h3 className="text-2xl font-head text-navy">🤝 हमारे साथ जुड़ें</h3><p className="mt-2 text-lg text-navy/80">Volunteer, रक्तदाता या सहयोगी बनकर सेवा में भागीदार बनें।</p><Link href="/join" className="mt-4 btn btn-navy">अभी जुड़ें</Link></div></Reveal>
        <Reveal from="right"><div className="h-full card bg-gradient-to-br from-white to-sandal"><h3 className="text-2xl font-head text-navy">🔍 पारदर्शिता</h3><p className="mt-2 text-lg text-navy/80">पंजीकरण, रिपोर्ट और दस्तावेज – सब सार्वजनिक रूप से उपलब्ध।</p><Link href="/transparency" className="mt-4 btn btn-navy">दस्तावेज देखें</Link></div></Reveal>
      </section>

      <section className="max-w-5xl px-4 mx-auto mt-16">
        <Reveal>
          <div className="relative p-10 overflow-hidden text-center text-white shadow-xl rounded-3xl bg-gradient-to-r from-saffron-deep via-saffron to-saffron-light">
            <span aria-hidden className="absolute -left-6 -top-10 animate-spin-slow font-head text-[14rem] leading-none text-white/15">ॐ</span>
            <h2 className="relative text-3xl font-head sm:text-4xl">आपका छोटा सहयोग, किसी का बड़ा सहारा</h2>
            <Link href="/donate" className="relative mt-6 bg-white btn text-saffron-deep hover:bg-navy hover:text-white">अभी दान करें</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
