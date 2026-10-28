import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import ContactForm from "./ContactForm";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from '@mui/icons-material/Place';

export const metadata = { title: "संपर्क करें | सर्व समाज कल्याण समिति" };

const CONTACT_ITEMS = [
  {
    icon: PhoneIcon,
    label: "मोबाइल नंबर",
    value: "+91 7275000028",
    sub: "सीधे कॉल पर बात करें",
    href: "tel:+917275000028",
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp सेवा",
    value: "+91 7275000028",
    sub: "त्वरित संदेश भेजें",
    href: "https://wa.me/917275000028",
  },
  {
    icon: EmailIcon,
    label: "आधिकारिक ईमेल",
    value: "info@sarvhindukalyansamiti.org",
    sub: "सुझाव एवं संस्थागत पत्र",
    href: "mailto:info@sarvhindukalyansamiti.org",
  },
  {
    icon: AccessTimeIcon,
    label: "कार्यालय समय",
    value: "सोम – शनि (9 AM - 6 PM)",
    sub: "आपातकालीन सेवा 24×7 उपलब्ध",
    href: null,
  },
];

export default function Contact() {
  return (
    <>
      <PageBanner
        title="संपर्क करें"
        sub="सेवा, सुझाव या सहयोग के लिए हमसे जुड़ें"
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Section Intro Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/50 px-3.5 py-1 text-sm font-bold text-saffron-deep">
            <span>✦</span>
            <span>सेवा • संवाद • सहयोग</span>
            <span>✦</span>
          </div>
          <h2 className="mt-3 font-head text-2xl font-bold text-navy sm:text-3xl">
            हमसे सीधे संवाद करें
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
            किसी भी सेवा प्रकल्प की जानकारी, सहायता निवेदन या अपने बहुमूल्य सुझाव साझा करने के लिए नीचे दिए गए माध्यमों से जुड़ें।
          </p>
        </div>

        {/* Balanced 2-Column Main Grid */}
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Structured Contact Info Panel (6 Cols) */}
          <Reveal from="left" className="lg:col-span-6">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/80 rangoli bg-saffron-100 p-6 text-white shadow-lg sm:p-8">
              {/* Subtle Om Watermark */}
              <div className="pointer-events-none absolute -bottom-10 -right-6 select-none text-[140px] font-bold leading-none text-white/10">
                ॐ
              </div>

              <div className="relative z-10">
                <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold tracking-wide text-saffron bg-saffron/15 backdrop-blur-sm">
                  ✦ केंद्रीय कार्यालय एवं हेल्पलाइन ✦
                </span>

                <h3 className="mt-3 font-head text-2xl font-extrabold sm:text-3xl text-black">
                  संपर्क सूत्र एवं पता
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-black/90 sm:text-sm">
आप कार्यालय आकर या फोन अथवा व्हाट्सएप के जरिए हमसे संपर्क कर सकते हैं। </p>

               

                {/* 2x2 Compact Contact Grid */}
                <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                  {CONTACT_ITEMS.map((item) => {
                    const CardContent = (
                      <div className="group flex h-full items-start gap-3 rounded-2xl border border-saffron/15 bg-white/10 p-3.5 backdrop-blur-sm transition duration-200 hover:bg-white/20">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/95 text-lg text-saffron shadow-sm">
                          <item.icon />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold text-saffron ">
                            {item.label}
                          </p>
                          <p className="mt-0.5 truncate font-head text-sm font-bold text-black">
                            {item.value}
                          </p>
                          <p className="mt-0.5 text-[11px] text-black/80">
                            {item.sub}
                          </p>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block"
                      >
                        {CardContent}
                      </a>
                    ) : (
                      <div key={item.label}>{CardContent}</div>
                    );
                  })}
                </div>

                 {/* Main Address Card */}
                <div className="mt-5 rounded-2xl border border-saffron/15 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      <PlaceIcon className="text-saffron" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-saffron">
                        प्रधान कार्यालय का पता
                      </p>
                      <p className="mt-1 font-head text-base font-bold text-black sm:text-base">
                       616/111 के विहार कॉलोनी, मड़ियाव, सीतापुर रोड, लखनऊ
                      </p>
                     
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Note Strip */}
              <div className="relative z-10 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-saffron/10 bg-saffron-light/20 px-4 py-3 text-xs text-black/80">
                <span>जनसेवा एवं सहायता हेतु सदैव तत्पर 🙏</span>
                <span className="font-bold text-black">लखनऊ, उ.प्र.</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Contact Form Container (6 Cols) */}
          <Reveal from="right" className="lg:col-span-6">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-amber-200/80 bg-white p-6 shadow-md sm:p-8">
              {/* Top Saffron Accent Bar */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-600 via-saffron to-amber-500" />

              <div>
                <div className="mb-5 border-b border-stone-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron">
                    संदेश फॉर्म
                  </span>
                  <h3 className="mt-1 font-head text-2xl font-bold text-navy sm:text-3xl">
                    अपनी जिज्ञासा या सुझाव भेजें
                  </h3>
                  <p className="mt-1 text-xs text-navy/70 sm:text-sm">
                    कृपया नीचे दिए गए फॉर्म में अपना विवरण भरें, हमारी टीम शीघ्र ही आपसे संपर्क करेगी।
                  </p>
                </div>

                {/* Existing ContactForm Component */}
                <ContactForm />
              </div>

              {/* Subtle Bottom Trust Footer inside Form Card to keep height balanced */}
              {/* <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-50/70 px-4 py-2.5 text-xs text-navy/75 border border-amber-100">
                <span>🔒 आपकी व्यक्तिगत जानकारी पूर्णतः सुरक्षित रहेगी।</span>
                <span className="font-semibold text-saffron-deep">
                  त्वरित प्रतिक्रिया
                </span>
              </div> */}
            </div>
          </Reveal>
        </div>

        {/* Full-Width Map Section Below to Eliminate Empty Vertical Space */}
        <Reveal from="bottom" className="mt-8 sm:mt-10">
          <div className="overflow-hidden rounded-3xl border border-amber-200/80 bg-white p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-sm">
                  🗺️
                </span>
                <h3 className="font-head text-base font-bold text-navy sm:text-lg">
                  कार्यालय लोकेशन मैप (लखनऊ, उत्तर प्रदेश)
                </h3>
              </div>
              <a
                href="https://maps.google.com/?q=Lucknow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-saffron-deep hover:underline"
              >
                Google Maps में बड़ा देखें ↗
              </a>
            </div>

           

            <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3559.0650535063683!2d81.01276777543795!3d26.86967417667295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDUyJzEwLjgiTiA4McKwMDAnNTUuMiJF!5e0!3m2!1sen!2sin!4v1792656759178!5m2!1sen!2sin" className="h-64 w-full rounded-2xl border border-stone-200/80 sm:h-72"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}


