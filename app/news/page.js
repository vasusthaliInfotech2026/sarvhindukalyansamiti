import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import SampleNote from "@/components/SampleNote";
import { NEWS } from "@/lib/data";
export const metadata = { title: "समाचार | सर्व समाज कल्याण समिति" };
export default function News() {
  return (
    <>
      <PageBanner title="समाचार एवं अपडेट" sub="हाल के सेवा कार्य, campaign updates और घोषणाएँ" />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <SampleNote />
        <div className="grid gap-6 md:grid-cols-2">
          {NEWS.map(([cat, d, t, s], k) => (
            <Reveal key={t} delay={(k % 2) * 100}>
              <article className="card card-hover h-full border-l-4 border-l-saffron">
                <span className="rounded-full bg-sandal px-3 py-0.5 text-xs font-semibold text-saffron-deep">{cat}</span>
                <h2 className="mt-2 font-head text-2xl text-navy">{t}</h2>
                <time className="text-sm text-navy/60">{d}</time>
                <p className="mt-2 text-navy/80">{s}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
