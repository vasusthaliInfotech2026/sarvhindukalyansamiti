import Link from "next/link";

const CONTACT = {
  phone: "+91 7275000028",        
  phoneRaw: "917275000028",        
  email: "info@sarvhindukalyansamiti.org",
  address: "616/111 के विहार कॉलोनी, मड़ियाव, सीतापुर रोड, लखनऊ",
  mapQuery: "616/111 K VIHAR COLONY, MADIYAON, SITAPUR ROAD, LUCKNOW", 
  instagram: "https://www.instagram.com/yourpage",
  facebook: "https://www.facebook.com/yourpage",
  waText: "नमस्ते, मुझे सर्व हिन्दू कल्याण समिति के बारे में जानकारी चाहिए।",
};

const LINKS = [
  ["मुख्य पृष्ठ", "/"],
  ["हमारे बारे में", "/about"],
  ["हमारे कार्य", "/services"],
  ["सदस्य बनें", "/join"],
  ["गैलरी", "/gallery"],
  ["संपर्क करें", "/contact"],
];

const ext = { target: "_blank", rel: "noopener noreferrer" };

const Ico = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 h-5 w-5 shrink-0 text-amber-400 group-hover:scale-110 transition-transform" aria-hidden="true">{children}</svg>
);

export default function Footer() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapQuery)}`;
  const waUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(CONTACT.waText)}`;
  const rowCls = "group flex items-start gap-3 transition-all duration-200 hover:translate-x-1 hover:text-amber-300";
  const socialCls = "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-amber-200 border border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/30";

  return (
    <footer className="relative mt-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 overflow-hidden border-t border-amber-500/20">
      {/* Top Saffron/Gold Vibrant Border Line */}
      <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 shadow-sm shadow-amber-500/50" />

      {/* Decorative background ambient glow */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.4fr]">
          
          {/* Section 1: Logo, Tagline & CTA */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <span className="grid text-2xl bg-gradient-to-tr from-amber-500 to-orange-500 border-2 rounded-full shadow-md h-12 w-12 place-items-center border-amber-300 font-head text-white group-hover:rotate-12 transition-transform duration-300">
                ॐ
              </span>
              <span className="text-xl font-bold tracking-wide font-head text-white leading-tight lg:text-lg xl:text-2xl">
                सर्व हिन्दू <br className="sm:hidden" /> <span className="text-amber-400 font-normal">कल्याण समिति</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-300 sm:text-base border-l-2 border-amber-500/50 pl-3 py-0.5">
              सेवा, समर्पण और विश्वास — समाज कल्याण और उत्थान के लिए हमारा संकल्प।
            </p>

            <div>
              <Link 
                href="/donate" 
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                🙏 सहयोग करें
              </Link>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="lg:pl-6">
            <p className="mb-4 font-semibold text-white tracking-wider text-xs sm:text-sm border-b border-white/10 pb-2">
              महत्वपूर्ण पृष्ठ
            </p>
            <ul className="space-y-2.5 text-sm sm:text-base">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="inline-block transition-all duration-200 hover:text-amber-300 hover:translate-x-1 text-slate-300"
                  >
                    <span className="text-amber-500 mr-2">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Contact & Social Media */}
          <div className="space-y-4 text-sm sm:text-base">
            <p className="mb-4 font-semibold text-white tracking-wider text-xs sm:text-sm border-b border-white/10 pb-2">
              संपर्क करें
            </p>
            
            <div className="space-y-3">
              <a href={mapUrl} {...ext} className={rowCls}>
                <Ico>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </Ico>
                <span className="text-slate-300 leading-snug">{CONTACT.address}</span>
              </a>

              <a href={`mailto:${CONTACT.email}`} className={rowCls}>
                <Ico>
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
                </Ico>
                <span className="break-all text-slate-300">{CONTACT.email}</span>
              </a>

              <a href={`tel:+${CONTACT.phoneRaw}`} className={rowCls}>
                <Ico>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </Ico>
                <span className="text-slate-300 font-medium">{CONTACT.phone}</span>
              </a>
            </div>

            {/* Social Media Icons */}
            {/* <div className="pt-2">
              <p className="text-xs text-slate-400 mb-2">हमसे सोशल मीडिया पर जुड़ें:</p>
              <div className="flex gap-3">
                <a href={CONTACT.instagram} {...ext} aria-label="Instagram" className={socialCls}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
                <a href={CONTACT.facebook} {...ext} aria-label="Facebook" className={socialCls}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href={waUrl} {...ext} aria-label="WhatsApp" className={socialCls}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
              </div>
            </div> */}

          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/30 py-3 text-center text-xs sm:text-sm text-slate-400">
        <p>© 2026 &nbsp; &nbsp; सर्व हिन्दू कल्याण समिति। &nbsp; &nbsp; सर्वाधिकार सुरक्षित।</p>
      </div>
    </footer>
  );
}