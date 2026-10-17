import Link from "next/link";


const CONTACT = {
  phone: "+91 98765 43210",        
  phoneRaw: "919876543210",        
  email: "info@yourdomain.org",
  address: "लखनऊ, उत्तर प्रदेश",
  mapQuery: "Lucknow, Uttar Pradesh", 
  instagram: "https://www.instagram.com/yourpage",
  facebook: "https://www.facebook.com/yourpage",
  waText: "नमस्ते, मुझे सर्व हिन्दू  कल्याण समिति के बारे में जानकारी चाहिए।",
};

const LINKS = [
  ["मुख्य पृष्ठ", "/"],
  ["हमारे बारे में", "/about"],
  ["हमारे कार्य", "/social-work"],
  ["सदस्य बनें", "/join"],
  ["गैलरी", "/gallery"],
  ["संपर्क करें", "/contact"],
];

const ext = { target: "_blank", rel: "noopener noreferrer" };
const Ico = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-4 w-4 shrink-0 text-saffron-light" aria-hidden="true">{children}</svg>
);

export default function Footer() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapQuery)}`;
  const waUrl = `https://wa.me/${CONTACT.phoneRaw}?text=${encodeURIComponent(CONTACT.waText)}`;
  const rowCls = "flex items-start gap-2 transition hover:text-saffron-light";
  const socialCls = "grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sandal transition duration-300 hover:-translate-y-1 hover:bg-saffron hover:text-white";

  return (
    <footer className="mt-10 bg-navy-dark text-sandal">
      <div className="h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr] lg:gap-10">
        {/* परिचय + Support Our Work */}
        <div>
          <p className="text-xl text-white font-head sm:text-2xl">ॐ सर्व हिन्दू  कल्याण समिति</p>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed sm:text-base">
            विश्वास, पारदर्शिता और आसान सहयोग – मानव सेवा, शिक्षा, स्वास्थ्य, और धर्म सेवा के लिए समर्पित।
          </p>
          <Link href="/donate" className="btn btn-saffron mt-5 animate-ring !px-5 !py-2 text-sm shadow-lg shadow-saffron/40">
            सहयोग करें
          </Link>
        </div>

        
        <div>
          <p className="mb-1.5 font-semibold text-white">पृष्ठ</p>
          <ul className="space-y-1 text-sm sm:text-base">
            {LINKS.map(([label, href]) => (
              <li key={href}><Link href={href} className="transition hover:text-saffron-light">{label}</Link></li>
            ))}
          </ul>
        </div>

        
        <div className="text-sm sm:text-base">
          <p className="mb-1.5 font-semibold text-white">संपर्क</p>
          <div className="space-y-1.5">
            <a href={mapUrl} {...ext} className={rowCls}>
              <Ico><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Ico>
              <span>{CONTACT.address}</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className={rowCls}>
              <Ico><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></Ico>
              <span className="break-all">{CONTACT.email}</span>
            </a>
            <a href={`tel:+${CONTACT.phoneRaw}`} className={rowCls}>
              <Ico><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Ico>
              <span>{CONTACT.phone}</span>
            </a>
          </div>

          
          <div className="mt-3 flex gap-2.5">
            <a href={CONTACT.instagram} {...ext} aria-label="Instagram" className={socialCls}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href={CONTACT.facebook} {...ext} aria-label="Facebook" className={socialCls}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href={waUrl} {...ext} aria-label="WhatsApp" className={socialCls}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <p className="border-t border-white/10 bg-black/10 py-2.5 text-center text-sm text-white">© 2026 सर्व हिन्दू कल्याण समिति। सर्वाधिकार सुरक्षित।</p>
    </footer>
  );
}