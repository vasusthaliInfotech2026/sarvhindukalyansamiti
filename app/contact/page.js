import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";
export const metadata = { title: "संपर्क करें | सर्व समाज कल्याण समिति" };
export default function Contact() {
  return (
    <>
      <PageBanner title="संपर्क करें" sub="सेवा, सुझाव या सहयोग के लिए हमसे जुड़ें" />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
        <Reveal from="left" className="space-y-4 text-lg">
          <div className="card">📍 <b>पता:</b> लखनऊ, उत्तर प्रदेश (समिति का आधिकारिक पता जोड़ें)</div>
          <div className="card">📞 <b>मोबाइल:</b> +91 00000 00000</div>
          <div className="card">💬 <b>WhatsApp:</b> +91 00000 00000</div>
          <div className="card">✉ <b>ईमेल:</b> info@example.org</div>
          <div className="card">🕒 <b>समय:</b> सोम–शनि, सुबह 9 से शाम 6</div>
          <iframe title="Map" src="https://www.google.com/maps?q=Lucknow&output=embed" className="h-56 w-full rounded-2xl border border-saffron/30" loading="lazy" />
        </Reveal>
        <Reveal from="right"><ContactForm /></Reveal>
      </section>
    </>
  );
}
