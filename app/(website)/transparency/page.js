import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { DOCS } from "@/lib/data";
export const metadata = { title: "पारदर्शिता एवं दस्तावेज | सर्व समाज कल्याण समिति" };
export default function Transparency() {
  return (
    <>
      <PageBanner title="पारदर्शिता एवं दस्तावेज" sub="केवल वैध एवं वर्तमान दस्तावेज सार्वजनिक किए जाते हैं" />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS.map((d, k) => (
            <Reveal key={d} delay={(k % 4) * 90}>
              <div className="card card-hover h-full text-center"><p className="text-4xl">📄</p><p className="mt-2 font-semibold">{d}</p><p className="mt-2 inline-block rounded-full bg-sandal px-3 py-0.5 text-xs text-saffron-deep">दस्तावेज अपलोड होना शेष</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal><div className="card mt-10 border-l-4 border-l-leaf"><h2 className="font-head text-2xl">हमारी जवाबदेही</h2>
          <ul className="mt-3 space-y-1.5 text-lg">{["Campaign-wise progress और updates", "पूर्ण कार्यों का फोटो/वीडियो प्रमाण (सहमति एवं निजता के साथ)", "वार्षिक/आवधिक रिपोर्ट", "Impact के आँकड़े केवल वास्तविक और सत्यापित", "किसी tax benefit/registration का दावा तभी, जब वैध approval उपलब्ध हो"].map((t) => <li key={t} className="flex gap-2"><span className="text-leaf">✔</span>{t}</li>)}</ul></div></Reveal>
      </section>
    </>
  );
}
