import Link from "next/link";
import Progress from "./Progress";
import { fmt } from "@/lib/data";
export default function CampaignCard({ c }) {
  const pct = Math.min(100, Math.round((c.raised / c.target) * 100));
  return (
    <div className="card card-hover flex h-full flex-col overflow-hidden !p-0">
      <div className="relative grid h-32 place-items-center bg-gradient-to-br from-navy via-navy to-saffron-deep text-5xl">
        <div className="rangoli absolute inset-0 opacity-50" /><span className="relative">{c.icon}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-head text-xl text-navy">{c.title}</h3>
        <p className="mt-1.5 flex-1 text-navy/75">{c.short}</p>
        <div className="mt-4"><Progress pct={pct} /></div>
        <div className="mt-2 flex justify-between text-sm"><span><b className="text-leaf">{fmt(c.raised)}</b> जुटाए</span><b>{pct}%</b></div>
        <p className="text-sm text-navy/70">लक्ष्य {fmt(c.target)} · {c.supporters} सहयोगी</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/donate?campaign=${c.id}`} className="btn btn-saffron flex-1 !py-2">दान करें</Link>
          <Link href={`/campaigns/${c.id}`} className="btn border-2 border-navy text-navy hover:bg-navy hover:text-white !py-2">विवरण</Link>
        </div>
      </div>
    </div>
  );
}
