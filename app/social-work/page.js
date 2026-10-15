import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import SampleNote from "@/components/SampleNote";
import { ACTIVITIES } from "@/lib/data";
export const metadata = { title: "सामाजिक कार्य | सर्व समाज कल्याण समिति" };
export default function SocialWork() {
  return (
    <>
      <PageBanner title="सामाजिक कार्य" sub="‘हमारी सेवाएं’ में समिति क्या करती है; यहाँ दिखता है कि समिति ने वास्तव में क्या किया" />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <SampleNote />
        <div className="space-y-6">
          {ACTIVITIES.map((a, k) => (
            <Reveal key={a.title} delay={k * 80}>
              <div className="card card-hover grid gap-5 md:grid-cols-[120px_1fr]">
                <div className="grid h-28 place-items-center rounded-xl bg-gradient-to-br from-navy to-saffron-deep text-5xl">{a.icon}</div>
                <div>
                  <h2 className="font-head text-2xl text-navy">{a.title}</h2>
                  <p className="font-semibold text-saffron-deep">{a.date} · 📍 {a.place}</p>
                  <p className="mt-2"><b>लाभार्थी:</b> {a.who}</p>
                  <p>{a.sum}</p>
                  <p className="text-sm text-navy/70">परिणाम/Impact: {a.impact}</p>
                  <Link href={`/campaigns/${a.campaign}`} className="btn btn-saffron mt-3 !py-2">Support Similar Work</Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
