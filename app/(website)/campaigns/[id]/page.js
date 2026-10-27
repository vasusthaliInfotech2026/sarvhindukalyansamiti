import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import Progress from "@/components/Progress";
import { CAMPAIGNS, fmt } from "@/lib/data";

export function generateStaticParams() { return CAMPAIGNS.map((c) => ({ id: c.id })); }
export function generateMetadata({ params }) {
  const c = CAMPAIGNS.find((x) => x.id === params.id);
  return { title: c ? `${c.title} | सर्व समाज कल्याण समिति` : "अभियान" };
}

export default function Campaign({ params }) {
  const c = CAMPAIGNS.find((x) => x.id === params.id);
  if (!c) notFound();
  const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
  const share = encodeURIComponent(`${c.title} – सर्व समाज कल्याण समिति`);
  return (
    <>
      <PageBanner title={c.title} sub={c.short} />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="relative grid h-56 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-saffron-deep text-8xl">
            <div className="rangoli absolute inset-0 opacity-50" /><span className="relative">{c.icon}</span>
          </div>
          <div className="card"><h2 className="font-head text-2xl">अभियान का उद्देश्य</h2><p className="mt-2 text-lg">{c.short}।</p><p className="mt-2"><b>किसे सहायता चाहिए:</b> {c.who}</p></div>
          <div className="card">
            <h2 className="font-head text-2xl">Campaign Updates</h2>
            <ol className="mt-4 space-y-4 border-l-2 border-saffron pl-5">
              <li><p className="text-sm font-semibold text-saffron-deep">अक्टूबर 2026</p><p>अभियान की शुरुआत और प्रारंभिक सहयोग प्राप्त हुआ।</p></li>
              <li><p className="text-sm font-semibold text-saffron-deep">कार्य पूर्ण होने पर</p><p>Impact एवं utilization update यहाँ प्रकाशित किया जाएगा।</p></li>
            </ol>
          </div>
        </div>
        <aside className="lg:col-span-2">
          <div className="card sticky top-24 space-y-3">
            <p className="font-head text-3xl text-leaf">{fmt(c.raised)} <span className="text-base text-navy/70">जुटाए</span></p>
            <Progress pct={pct} />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-sandal p-3"><p className="font-bold">{fmt(c.target)}</p><p className="text-sm">लक्ष्य</p></div>
              <div className="rounded-lg bg-sandal p-3"><p className="font-bold">{fmt(c.target - c.raised)}</p><p className="text-sm">शेष</p></div>
              <div className="rounded-lg bg-sandal p-3"><p className="font-bold">{c.supporters}</p><p className="text-sm">सहयोगी</p></div>
              <div className="rounded-lg bg-sandal p-3"><p className="font-bold">{pct}%</p><p className="text-sm">पूर्ण</p></div>
            </div>
            <p className="text-sm text-navy/70">अंतिम तिथि: {c.end}</p>
            <Link href={`/donate?campaign=${c.id}`} className="btn btn-saffron w-full animate-ring text-lg">अभी दान करें</Link>
            <div className="flex gap-2">
              <a href={`https://wa.me/?text=${share}`} target="_blank" rel="noreferrer" className="btn btn-navy flex-1 !py-2">WhatsApp</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?quote=${share}`} target="_blank" rel="noreferrer" className="btn btn-navy flex-1 !py-2">Facebook</a>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
