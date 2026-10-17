import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import ServiceArt, { ART_IDS } from "@/components/ServiceArt";
import { SERVICES } from "@/lib/data";


const SHOW = ["food", "temple", "health", "needy", "orphan", "disaster"];


const photo = (id) => {
  const f = ["jpg", "png", "webp"].map((e) => `${id}.${e}`).find((n) => fs.existsSync(path.join(process.cwd(), "public", "images", "services", n)));
  return f ? `/images/services/${f}` : id === "temple" ? "/images/mandi.jpg" : null;

};

export default function ServicesShowcase() {
  const list = SHOW.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean);
  return (
    <section className="py-16 rangoli bg-sandal">
      <div className="px-4 mx-auto max-w-7xl">
        <SectionTitle title="हमारी प्रमुख सेवाएं" sub="हर हाथ तक सहारा, हर दिल तक अपनापन" />
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, k) => {
            const img = photo(s.id);
            return (
              <Reveal key={s.id} delay={(k % 3) * 120}>
                <Link href="/services" className="group card card-hover relative block h-full overflow-hidden !p-0">
                  <div className="relative overflow-hidden h-52">
                    <div className="absolute inset-0 transition duration-700 group-hover:scale-110">
                      {img ? (
                        <Image src={img} alt={s.title} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                      ) : ART_IDS.includes(s.id) ? (
                        <ServiceArt id={s.id} />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-navy to-saffron-deep text-7xl">{s.icon}</div>
                      )}
                    </div>
                    <div className="absolute inset-0 transition duration-500 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent group-hover:opacity-40" />
                    
                  </div>
                  <div className="relative px-5 pt-10 pb-6 text-center">
                    <span className="absolute -top-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full border-4 border-white bg-sandal text-3xl shadow-lg transition duration-500 group-hover:rotate-[360deg] group-hover:scale-110">{s.icon}</span>
                    <h3 className="text-xl transition-colors duration-300 font-head text-navy group-hover:text-saffron-deep">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/75">{s.items[0]}</p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 transition duration-500 origin-left scale-x-0 bg-gradient-to-r from-saffron via-gold to-saffron group-hover:scale-x-100" />
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 text-center"><Link href="/services" className="btn btn-navy">सभी सेवाएं देखें</Link></div>
      </div>
    </section>
  );
}