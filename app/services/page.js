import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";
export const metadata = { title: "हमारी सेवाएं | सर्व समाज कल्याण समिति" };
export default function Services() {
  return (
    <>
      <PageBanner title="हमारी सेवाएं" sub="समिति क्या करती है – श्रेणी अनुसार सेवाएं" />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2">
        {SERVICES.map((s, k) => (
          <Reveal key={s.id} delay={(k % 2) * 100}>
            <div className="card card-hover h-full">
              <div className="flex items-center gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sandal text-3xl">{s.icon}</span><h2 className="font-head text-xl text-navy">{s.title}</h2></div>
              <ul className="mt-4 space-y-1.5 text-navy/85">{s.items.map((t) => <li key={t} className="flex gap-2"><span className="text-saffron">•</span>{t}</li>)}</ul>
              <Link href="/campaigns" className="btn btn-saffron mt-5 !py-2">इस सेवा में सहयोग करें</Link>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
