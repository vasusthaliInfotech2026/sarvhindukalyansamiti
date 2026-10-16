import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/data";

export const metadata = { title: "हमारे कार्य | सर्व समाज कल्याण समिति" };

const GRADS = ["from-navy to-saffron-deep", "from-saffron-deep to-navy", "from-leaf to-navy", "from-navy-dark to-gold"];

const hasImg = (id) => fs.existsSync(path.join(process.cwd(), "public", "images", "services", `${id}.jpg`));

export default function Services() {
  return (
    <>
      <PageBanner title="हमारे कार्य" sub="समिति क्या करती है – श्रेणी अनुसार कार्य" />
      <section className="max-w-5xl px-4 py-10 mx-auto space-y-5 overflow-x-clip sm:space-y-6 sm:py-12">
        {SERVICES.map((s, k) => {
          const flip = k % 2 === 1;
          const img = hasImg(s.id);
          return (
            <Reveal key={s.id} from={flip ? "right" : "left"}>
              <article className={`group card card-hover flex flex-col overflow-hidden !p-0 md:flex-row ${flip ? "md:flex-row-reverse" : ""}`}>
              
                <div className="relative h-44 overflow-hidden sm:h-52 md:h-auto md:min-h-[210px] md:w-[36%] md:shrink-0">
                  {img ? (
                    <Image src={`/images/services/${s.id}.jpg`} alt={s.title} fill sizes="(min-width:768px) 36vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-110" />
                  ) : (
                    <div className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${GRADS[k % 4]}`}>
                      <div className="absolute inset-0 opacity-50 rangoli" />
                      <span className="relative text-6xl transition duration-500 group-hover:-translate-y-2 group-hover:rotate-6 group-hover:scale-125 md:text-7xl">{s.icon}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 transition duration-500 bg-gradient-to-t from-navy-dark/50 via-transparent to-transparent opacity-70 group-hover:opacity-30" />
                  {img && <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-xl shadow transition duration-700 group-hover:rotate-[360deg]">{s.icon}</span>}
                </div>

                {/* लिखा हुआ हिस्सा */}
                <div className="flex flex-col justify-center flex-1 min-w-0 p-4 sm:p-5 md:p-6">
                  <h2 className="text-lg transition-colors duration-300 font-head text-navy group-hover:text-saffron-deep sm:text-xl md:text-2xl">{s.title}</h2>
                  <div className="w-12 h-1 mt-2 transition-all duration-500 rounded bg-saffron group-hover:w-24" />
                  <ul className="mt-3 space-y-1 text-sm text-navy/85 sm:text-[15px]">
                    {s.items.map((t) => <li key={t} className="flex gap-2"><span className="text-saffron">✦</span><span>{t}</span></li>)}
                  </ul>
                  <Link href="/campaigns" className="btn btn-saffron mt-4 w-full !px-5 !py-1.5 text-center text-sm sm:w-fit">इस सेवा में सहयोग करें →</Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}