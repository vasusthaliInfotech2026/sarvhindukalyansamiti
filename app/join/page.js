import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import VolunteerForm from "./VolunteerForm";
export const metadata = { title: "हमारे साथ जुड़ें | सर्व समाज कल्याण समिति" };
const OPTS = [["💰", "Donate", "आर्थिक सहयोग", "/donate"], ["🙋", "Volunteer", "समय और skills से सेवा", "#volunteer"], ["🩸", "Blood Donor", "रक्तदान / donor network", "#volunteer"], ["📣", "Campaign Support", "अभियान share / promote करें", "/campaigns"], ["🏛️", "Community Partner", "स्थानीय/संस्थागत सहयोग", "/contact"]];
export default function Join() {
  return (
    <>
      <PageBanner title="हमारे साथ जुड़ें" sub="सेवा के कई तरीके – अपने लिए चुनें" />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {OPTS.map(([i, t, d, h], k) => (
            <Reveal key={t} delay={k * 90}><Link href={h} className="card card-hover block h-full text-center"><p className="text-4xl">{i}</p><h3 className="mt-2 font-head text-xl">{t}</h3><p className="text-sm text-navy/75">{d}</p></Link></Reveal>
          ))}
        </div>
        <div id="volunteer" className="mx-auto mt-14 max-w-3xl scroll-mt-28"><h2 className="mb-5 text-center font-head text-3xl">Volunteer / Blood Donor आवेदन</h2><VolunteerForm /></div>
      </section>
    </>
  );
}
