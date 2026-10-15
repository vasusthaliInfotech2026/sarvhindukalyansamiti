import Link from "next/link";
export default function MobileBar() {
  const b = "flex flex-1 flex-col items-center justify-center py-2 text-sm font-semibold text-white";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-gold bg-navy lg:hidden">
      <Link href="/donate" className={`${b} bg-saffron`}><span>🙏</span>दान करें</Link>
      <a href="https://wa.me/910000000000" className={b}><span>💬</span>WhatsApp</a>
      <a href="tel:+910000000000" className={b}><span>📞</span>कॉल</a>
    </div>
  );
}
