"use client";
import { useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/lib/data";
const GRADS = ["from-navy to-saffron-deep", "from-saffron-deep to-navy", "from-leaf to-navy", "from-navy-dark to-gold"];
export default function GalleryClient() {
  const [cat, setCat] = useState("सभी");
  const list = cat === "सभी" ? GALLERY : GALLERY.filter((g) => g.cat === cat);
  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {["सभी", ...GALLERY.map((g) => g.cat)].map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${cat === c ? "border-saffron bg-saffron text-white" : "border-saffron/40 hover:bg-sandal"}`}>{c}</button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <div key={g.cat} className="card card-hover group animate-rise overflow-hidden !p-0">
            <div className={`relative grid h-44 place-items-center overflow-hidden bg-gradient-to-br ${GRADS[g.i % 4]} text-6xl`}>
              {g.cat === "मंदिर सेवा"
                ? <Image src="/images/mandi.jpg" alt="मंदिर सेवा" fill sizes="400px" className="object-cover transition duration-700 group-hover:scale-110" />
                : <span className="transition duration-500 group-hover:scale-125">{g.icon}</span>}
            </div>
            <div className="p-5"><h3 className="font-head text-xl text-navy">{g.title}</h3><p className="text-sm font-semibold text-saffron-deep">{g.date} · 📍 {g.place}</p><p className="mt-1 text-navy/75">{g.desc}</p></div>
          </div>
        ))}
      </div>
    </>
  );
}
