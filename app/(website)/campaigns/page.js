import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import CampaignCard from "@/components/CampaignCard";
import SampleNote from "@/components/SampleNote";
import { CAMPAIGNS } from "@/lib/data";
export const metadata = { title: "सहयोग अभियान | सर्व समाज कल्याण समिति" };
export default function Campaigns() {
  return (
    <>
      <PageBanner title="सहयोग अभियान" sub="सक्रिय crowdfunding अभियान – लक्ष्य, जुटाई गई राशि और progress" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SampleNote>राशियाँ नमूना हैं – वास्तविक अभियान डेटा से बदली जाएंगी।</SampleNote>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGNS.map((c, k) => <Reveal key={c.id} delay={(k % 3) * 100}><CampaignCard c={c} /></Reveal>)}
        </div>
      </section>
    </>
  );
}
