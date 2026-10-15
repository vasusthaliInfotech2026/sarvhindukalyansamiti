import Link from "next/link";
import { MAIN, MORE } from "./nav";
export default function Footer() {
  return (
    <footer className="mt-20 bg-navy-dark text-sandal">
      <div className="h-1.5 bg-gradient-to-r from-saffron via-gold to-saffron" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-head text-2xl text-white">ॐ सर्व समाज कल्याण समिति</p>
          <p className="mt-3 max-w-sm leading-relaxed">विश्वास, पारदर्शिता और आसान सहयोग – मानव सेवा, शिक्षा, स्वास्थ्य, बुजुर्ग सेवा, कन्या विवाह और धर्म सेवा के लिए समर्पित।</p>
          <Link href="/donate" className="btn btn-saffron mt-5">Support Our Work – दान करें</Link>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">पृष्ठ</p>
          <ul className="grid grid-cols-2 gap-1.5">{[...MAIN, ...MORE].map((n) => <li key={n.href}><Link href={n.href} className="hover:text-saffron-light">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">संपर्क</p>
          <p>लखनऊ, उत्तर प्रदेश</p><p>info@example.org</p><p>+91 00000 00000</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-sm">© 2026 सर्व समाज कल्याण समिति। सर्वाधिकार सुरक्षित।</p>
    </footer>
  );
}
