import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import SampleNote from "@/components/SampleNote";
import { EVENTS } from "@/lib/data";
export const metadata = { title: "कार्यक्रम एवं शिविर | सर्व समाज कल्याण समिति" };
function List({ title, items }) {
  return (
    <div className="mb-12">
      <h2 className="mb-5 font-head text-3xl">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((e, k) => (
          <Reveal key={e.title + e.date} delay={(k % 2) * 100}>
            <div className="card card-hover h-full">
              <p className="inline-block rounded-full bg-saffron px-3 py-1 text-sm font-semibold text-white">{e.date}</p>
              <h3 className="mt-3 font-head text-2xl text-navy">{e.title}</h3>
              <p className="mt-1">🕒 {e.time} · 📍 {e.place}</p>
              <p><b>उद्देश्य:</b> {e.purpose}</p><p><b>पात्रता:</b> {e.elig}</p>
              {e.up && <Link href="/join" className="btn btn-navy mt-4 !py-2">Registration / Volunteer</Link>}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
export default function Events() {
  return (
    <>
      <PageBanner title="कार्यक्रम एवं शिविर" sub="आगामी और संपन्न कार्यक्रम" />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SampleNote />
        <List title="आगामी कार्यक्रम" items={EVENTS.filter((e) => e.up)} />
        <List title="संपन्न कार्यक्रम" items={EVENTS.filter((e) => !e.up)} />
      </section>
    </>
  );
}
