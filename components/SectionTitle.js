import Reveal from "./Reveal";
export default function SectionTitle({ title, sub }) {
  return (
    <Reveal className="mb-10 text-center">
      <h2 className="font-head text-3xl text-navy sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-gold" aria-hidden>
        <span className="h-px w-16 bg-gold" /><span className="font-head text-2xl">ॐ</span><span className="h-px w-16 bg-gold" />
      </div>
      {sub && <p className="mx-auto mt-3 max-w-2xl text-lg text-navy/75">{sub}</p>}
    </Reveal>
  );
}
