import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import DonateForm from "./DonateForm";
export const metadata = { title: "दान करें | सर्व समाज कल्याण समिति" };
const steps = ["अभियान/उद्देश्य चुनें", "राशि और विवरण भरें", "Secure payment (UPI / Card / Net Banking)", "Server verification के बाद Thank You एवं receipt"];
export default function Donate() {
  return (
    <>
      <PageBanner title="दान करें" sub="आपका सहयोग – हमारी शक्ति। आपका हर छोटा-बड़ा योगदान मंदिर निर्माण, शिक्षा, गो सेवा और समाज कल्याण के लिए अमूल्य है।" />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5">
        <Reveal from="left" className="md:col-span-2">
          <h2 className="font-head text-3xl">सहयोग की प्रक्रिया</h2>
          <ol className="mt-5 space-y-3">{steps.map((s, i) => <li key={s} className="card flex items-center gap-3 py-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron font-bold text-white">{i + 1}</span>{s}</li>)}</ol>
          <p className="mt-5 text-navy/75">आपके दान का रिकॉर्ड सुरक्षित रखा जाता है और अभियान की प्रगति सार्वजनिक रूप से दिखाई जाती है।</p>
        </Reveal>
        <Reveal from="right" className="md:col-span-3"><DonateForm /></Reveal>
      </section>
    </>
  );
}
