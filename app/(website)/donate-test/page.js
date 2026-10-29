import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import DonateForm from "./DonateForm";
import Script from "next/script";

export const metadata = { title: "दान करें | सर्व समाज कल्याण समिति" };

const steps = [
  {
    title: "अभियान या उद्देश्य चुनें",
    desc: "अन्न सेवा, शिक्षा, स्वास्थ्य या सामान्य दान में से अपना उद्देश्य चुनें।",
  },
  {
    title: "राशि और विवरण भरें",
    desc: "अपनी इच्छानुसार दान राशि चुनें और रसीद के लिए आवश्यक जानकारी दर्ज करें।",
  },
  {
    title: "सुरक्षित भुगतान (Secure Payment)",
    desc: "UPI, डेबिट/क्रेडिट कार्ड या नेट बैंकिंग के माध्यम से सुरक्षित भुगतान करें।",
  },
  {
    title: "तुरंत पुष्टि एवं रसीद",
    desc: "भुगतान सफल होने के बाद तुरंत स्क्रीन पर पुष्टि और ईमेल पर रसीद प्राप्त करें।",
  },
];

export default function Donate() {
  return (
    <>

    <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />
      
      <PageBanner title="दान करें" sub="आसान, सुरक्षित और पारदर्शी सहयोग" />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 md:py-20">
        {/* Top Section Title (Dono Boxes ke Upar) */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-sm font-bold text-saffron-deep">
            <span>✦</span>
            <span>सेवा और समर्पण</span>
            <span>✦</span>
          </div>

          <h2 className="mt-3 font-head text-3xl font-bold text-navy sm:text-4xl">
            समाज कल्याण में अपना सहयोग दें
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-navy/70 sm:text-base">
            आपका प्रत्येक योगदान समाज के वंचित वर्गों तक शिक्षा, स्वास्थ्य और
            अन्न पहुँचाने में सीधा सहायक होता है।
          </p>
        </div>

        {/* Equal Height 12-Column Grid */}
        <div className="grid w-full grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Box: 5 Columns */}
          <div className="flex w-full flex-col lg:col-span-5">
            {/* Box ke upar ka label */}
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron/15 text-xs font-bold text-saffron">
                01
              </span>
              <h3 className="font-head text-lg font-bold text-navy">
                सहयोग की प्रक्रिया (Steps to Donate)
              </h3>
            </div>

            <Reveal from="left" className="flex flex-1 w-full">
              <div className="flex h-full w-full flex-col justify-between rounded-2xl border border-orange-100 bg-white p-6 shadow-md sm:p-8">
                <div>
                  <div className="border-b border-slate-100 pb-4">
                    <h4 className="font-head text-xl font-bold text-navy sm:text-2xl">
                      आसान 4 चरणों में दान करें
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-navy/65 sm:text-sm">
                      नीचे दिए गए चरणों का पालन करके सुरक्षित रूप से अपना सहयोग
                      दर्ज करें:
                    </p>
                  </div>

                  <ol className="mt-6 space-y-4">
                    {steps.map((step, i) => (
                      <li
                        key={step.title}
                        className="flex items-start gap-3.5 rounded-xl border border-orange-100/80 bg-[#FFFDF9] p-4 transition hover:border-saffron/40 hover:shadow-sm"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron text-sm font-bold text-white shadow-sm">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-sm font-bold text-navy sm:text-base">
                            {step.title}
                          </h5>
                          <p className="mt-1 text-xs leading-relaxed text-navy/70">
                            {step.desc}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Bottom Trust Note */}
                <div className="mt-6 rounded-xl border border-orange-200/60 bg-orange-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🔒</span>
                    <p className="text-xs leading-relaxed text-navy/80">
                      <strong className="text-navy">
                        100% सुरक्षित एवं पारदर्शी:
                      </strong>{" "}
                      आपके दान का पूरा रिकॉर्ड सुरक्षित रखा जाता है और अभियान की
                      प्रगति सार्वजनिक रूप से दिखाई जाती है।
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Box: 7 Columns */}
          <div className="flex w-full flex-col lg:col-span-7">
            {/* Box ke upar ka label */}
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron/15 text-xs font-bold text-saffron">
                02
              </span>
              <h3 className="font-head text-lg font-bold text-navy">
                ऑनलाइन दान फॉर्म (Donation Form)
              </h3>
            </div>

            <Reveal from="right" className="flex flex-1 w-full">
              <DonateForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
