"use client";
import { useState } from "react";
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="card animate-rise text-center"><p className="text-5xl">🙏</p><h3 className="mt-3 font-head text-2xl">संदेश भेज दिया गया</h3><p className="mt-2">हम शीघ्र ही आपसे संपर्क करेंगे।</p></div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card space-y-4">
      <input required placeholder="आपका नाम" className="input" />
      <div className="grid gap-4 sm:grid-cols-2"><input required type="tel" placeholder="मोबाइल" className="input" /><input required type="email" placeholder="ईमेल" className="input" /></div>
      <textarea required rows={5} placeholder="आपकी जिज्ञासा / संदेश" className="input" />
      <button className="btn btn-saffron w-40 mx-auto block">संदेश भेजें</button>
    </form>
  );
}
