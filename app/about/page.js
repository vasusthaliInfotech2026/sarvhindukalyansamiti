import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import Reveal from "@/components/Reveal";
export const metadata = { title: "हमारे बारे में | सर्व समाज कल्याण समिति" };
const values = [["🙏", "सेवा"], ["❤️", "मानवता"], ["🔍", "पारदर्शिता"], ["⚖️", "जिम्मेदारी"], ["🤝", "सामाजिक सहयोग"]];
export default function About() {
  return (
    <>
      <PageBanner title="हमारे बारे में" sub="समिति का परिचय, उद्देश्य और सेवा के सिद्धांत" />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2">
        <Reveal from="left">
          <h2 className="font-head text-3xl">समिति का परिचय</h2>
          <p className="mt-4 text-lg leading-relaxed">सर्व समाज कल्याण समिति का उद्देश्य मानव सेवा, शिक्षा, स्वास्थ्य, बुजुर्ग सहायता, निर्धन कन्या विवाह, रक्तदान और मंदिर सेवा जैसे कार्यों को संगठित रूप से समाज तक पहुँचाना है। हम सेवा के साथ विश्वास और पारदर्शिता को सबसे ऊपर रखते हैं।</p>
          <p className="mt-4 text-sm text-navy/70">पंजीकरण संख्या/तिथि एवं नेतृत्व की जानकारी, संस्था द्वारा प्रदर्शित करने पर यहाँ जोड़ी जाएगी।</p>
        </Reveal>
        <Reveal from="right" className="space-y-4">
          <div className="card border-l-4 border-l-saffron"><h3 className="font-head text-2xl text-saffron-deep">🎯 Vision</h3><p className="mt-1 text-lg">एक ऐसा समाज जहाँ कोई जरूरतमंद सहायता से वंचित न रहे।</p></div>
          <div className="card border-l-4 border-l-navy"><h3 className="font-head text-2xl text-navy">🚩 Mission</h3><p className="mt-1 text-lg">वास्तविक सेवा कार्यों के माध्यम से जरूरतमंदों तक पारदर्शी और आसान सहयोग पहुँचाना।</p></div>
        </Reveal>
      </section>
      <section className="rangoli bg-sandal py-16">
        <div className="mx-auto max-w-5xl px-4">
          <SectionTitle title="हमारे मूल्य" />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
            {values.map(([i, t], k) => <Reveal key={t} delay={k * 90}><div className="card card-hover text-center"><p className="text-4xl">{i}</p><p className="mt-2 font-head text-xl">{t}</p></div></Reveal>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <SectionTitle title="सेवा के सिद्धांत" />
        <ul className="space-y-3 text-lg">
          {["वास्तविक कार्य, वास्तविक फोटो/वीडियो", "लाभार्थियों की गरिमा, निजता और सहमति का सम्मान", "दान और प्रभाव के आँकड़ों में पारदर्शिता", "सरकारी योजनाओं में केवल ‘आवेदन/प्रक्रिया में सहायता’ – हम स्वयं लाभ जारी करने वाली संस्था नहीं हैं"].map((t, k) => <Reveal key={t} delay={k * 80}><li className="card flex gap-3 py-3"><span className="text-saffron">🪔</span>{t}</li></Reveal>)}
        </ul>
        <div className="mt-8 text-center"><Link href="/donate" className="btn btn-saffron">Support Our Mission</Link></div>
      </section>
    </>
  );
}
