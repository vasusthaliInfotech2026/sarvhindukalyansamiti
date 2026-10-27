import PageBanner from "@/components/PageBanner";
import Progress from "@/components/Progress";
import SampleNote from "@/components/SampleNote";
import { CAMPAIGNS, fmt } from "@/lib/data";
export const metadata = { title: "डैशबोर्ड | सर्व समाज कल्याण समिति" };
const rows = [["रमेश कुमार", "मंदिर सेवा", 5100, "Success"], ["सीमा देवी", "अन्न सेवा", 1100, "Success"], ["अमित वर्मा", "शिक्षा", 2500, "Pending"], ["अनाम", "चिकित्सा", 500, "Success"]];
export default function Dashboard() {
  const total = CAMPAIGNS.reduce((a, c) => a + c.raised, 0);
  const sup = CAMPAIGNS.reduce((a, c) => a + c.supporters, 0);
  const cards = [["कुल राशि जुटाई गई", fmt(total)], ["कुल सहयोगी", sup], ["सक्रिय अभियान", CAMPAIGNS.length], ["आगामी कार्यक्रम", 3]];
  return (
    <>
      <PageBanner title="डैशबोर्ड" sub="दान, अभियान और गतिविधियों का सारांश" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SampleNote>यह Admin Panel का डेमो ओवरव्यू है – नमूना डेटा के साथ।</SampleNote>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([l, v]) => <div key={l} className="card border-t-4 border-t-saffron"><p className="text-navy/70">{l}</p><p className="mt-1 font-head text-3xl text-saffron-deep">{v}</p></div>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="card lg:col-span-3"><h2 className="mb-4 font-head text-2xl">हाल के दान</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-saffron/30 text-navy/70"><th className="py-2">दानदाता</th><th>उद्देश्य</th><th>राशि</th><th>स्थिति</th></tr></thead>
              <tbody>{rows.map((r) => <tr key={r[0]} className="border-b border-saffron/10"><td className="py-2.5">{r[0]}</td><td>{r[1]}</td><td>{fmt(r[2])}</td><td><span className={`rounded-full px-2.5 py-0.5 text-sm ${r[3] === "Success" ? "bg-leaf/15 text-leaf" : "bg-gold/20 text-gold"}`}>{r[3]}</span></td></tr>)}</tbody></table></div></div>
          <div className="card lg:col-span-2"><h2 className="mb-4 font-head text-2xl">अभियान progress</h2>
            <div className="space-y-4">{CAMPAIGNS.slice(0, 5).map((c) => { const p = Math.round((c.raised / c.target) * 100); return <div key={c.id}><div className="mb-1 flex justify-between text-sm"><span>{c.title}</span><b>{p}%</b></div><Progress pct={p} /></div>; })}</div></div>
        </div>
      </section>
    </>
  );
}
