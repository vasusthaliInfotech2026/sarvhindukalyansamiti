import Link from "next/link";
export default function PageBanner({ title, sub }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-saffron-deep text-white">
      <div className="rangoli absolute inset-0 opacity-40" />
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-16 animate-spin-slow select-none font-head text-[18rem] leading-none text-white/10">ॐ</span>
      <div className="relative mx-auto max-w-7xl px-4 py-14">
        {/* <nav className="mb-3 text-sm text-sandal"><Link href="/" className="hover:text-white">मुख्य पृष्ठ</Link> / {title}</nav> */}
        <h1 className="animate-rise font-head text-4xl sm:text-5xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl animate-rise text-lg text-sandal [animation-delay:.15s]">{sub}</p>}
      </div>
      <div className="h-1.5 bg-gradient-to-r from-gold via-saffron-light to-gold" />
    </section>
  );
}
