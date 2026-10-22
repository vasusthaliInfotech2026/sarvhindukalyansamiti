"use client";
import { useState } from "react";
const AREAS = ["अन्न सेवा", "स्वास्थ्य", "शिक्षा", "बुजुर्ग सेवा", "कन्या विवाह", "रक्तदान", "मंदिर सेवा"];
export default function VolunteerForm() {
  const [ok, setOk] = useState(false);
  if (ok) return <div className="card animate-rise text-center"><p className="text-5xl">🙏</p><h3 className="mt-2 font-head text-2xl">आवेदन प्राप्त हुआ</h3><p className="mt-2">Admin approval के बाद हम आपसे संपर्क करेंगे।</p></div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); setOk(true); }} className="card space-y-4">
      <input required placeholder="नाम" className="input" />
      <div className="grid gap-4 sm:grid-cols-2"><input required type="tel" placeholder="मोबाइल" className="input" /><input type="email" placeholder="ईमेल" className="input" /></div>
      <input required placeholder="शहर / क्षेत्र" className="input" />
      <div><p className="mb-2 font-semibold">सेवा क्षेत्रों में रुचि</p><div className="flex flex-wrap gap-3">{AREAS.map((a) => <label key={a} className="flex items-center gap-1.5"><input type="checkbox" className="accent-saffron" />{a}</label>)}</div></div>
      <div className="grid gap-4 sm:grid-cols-2"><input placeholder="उपलब्ध समय" className="input" /><input placeholder="Skills / Profession" className="input" /></div>
      <textarea rows={3} placeholder="संदेश" className="input" />
      <button className="btn btn-saffron w-60 mx-auto block">Volunteer आवेदन भेजें</button>
    </form>
  );
}
