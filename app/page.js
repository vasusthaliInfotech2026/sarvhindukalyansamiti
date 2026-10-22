import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import Reveal from "@/components/Reveal";
import ServicesShowcase from "@/components/ServicesShowcase";

const SHLOK = "॥ सेवा परमो धर्मः ॥  ॐ  ॥ परोपकाराय पुण्याय ॥  ॐ ॥ सर्वे भवन्तु सुखिनः ॥  ॐ ॥ नर सेवा ही नारायण सेवा ॥ ॐ  ";

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
          <p className="mt-4 text-lg leading-relaxed text-navy/80">सर्व हिन्दू  कल्याण समिति सामाजिक, मानवीय, स्वास्थ्य, शिक्षा,  और मंदिर सेवा से जुड़े कार्यों को एक व्यवस्थित डिजिटल मंच के माध्यम से समाज तक पहुँचाती है।</p>
          <div className="flex flex-wrap justify-center gap-3 mt-7">
            <Link href="/donate" className="btn btn-saffron">अभी सहयोग करें</Link>
            <Link href="/social-work" className="btn btn-navy">हमारे कार्य देखें</Link>
          </div>
        </Reveal>
      </section>

            <section className="pt-4 pb-20 bg-cream">
        <div className="grid items-center gap-10 px-4 mx-auto max-w-7xl lg:grid-cols-2 lg:gap-14">
          <Reveal from="left">
            <div className="relative group">
              <div className="absolute w-full h-full -bottom-3 -right-3 rounded-3xl bg-saffron/10" aria-hidden />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl lg:aspect-[5/4]">
                <Image src="/images/about.jpg" alt="घाट पर स्थित प्राचीन मंदिर" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-white/90 px-4 py-1.5 font-head text-navy shadow">ॐ सेवा परमो धर्मः</span>
              </div>
            </div>
          </Reveal>

          <Reveal from="right" className="lg:-mt-12">
            <p className="text-4xl font-semibold text-saffron-deep">हमारे बारे में</p>
            <h2 className="mt-2 text-xl leading-tight font-head text-navy sm:text-2xl lg:text-3xl">सेवा से समाज का निर्माण, विश्वास के साथ</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy/80">
              सर्व हिन्दू  कल्याण समिति का उद्देश्य मानव सेवा, शिक्षा, स्वास्थ्य, और मंदिर सेवा जैसे कार्यों को एक व्यवस्थित मंच के माध्यम से समाज तक पहुँचाना है।
            </p>
            <p className="mt-3 text-navy/75">
              हम वास्तविक सेवा कार्य दिखाते हैं, दान का हिसाब पारदर्शी रखते हैं और हर सहयोगी तक आसान तरीके से पहुँचते हैं।
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["सेवा", "मानवता", "पारदर्शिता", "जिम्मेदारी", "सामाजिक सहयोग"].map((v) => (
                <span key={v} className="px-4 py-1 text-sm font-semibold border rounded-full border-saffron/40 bg-sandal text-navy">{v}</span>
              ))}
            </div>

            <Link href="/about" className="btn btn-saffron mt-7">पूरा परिचय पढ़ें</Link>
          </Reveal>
        </div>
      </section>

<ServicesShowcase />
      

     <section className="py-16 bg-cream/95">
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
            <Link href="/donate?services=mandir-seva" className="mt-6 btn btn-saffron">मंदिर सेवा में सहयोग करें</Link>
          </Reveal>
        </div>
      </section>

      

      <section className="grid max-w-5xl gap-6 px-4 mx-auto ">
        <Reveal from="left"><div className="h-full card bg-gradient-to-br from-white to-sandal">
          <h2 className="relative mt-3 text-3xl text-center font-head text-navy sm:text-4xl">🤝 हमारे साथ जुड़ें 🤝</h2>
          <p className="mt-2 text-lg text-center text-navy/80">स्वयंसेवक, रक्तदाता या सहयोगी बनकर सेवा में भागीदार बनें।</p>
          <div className="flex justify-center">
          <Link href="/join" className="relative mt-4 text-center btn btn-navy">अभी जुड़ें</Link>
          </div>
        </div></Reveal>
    
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
