"use client";
import { useEffect, useState } from "react";
import { CAMPAIGNS } from "@/lib/data";

const AMOUNTS = [100, 500, 1000, 2500, 5000];
const CAUSES = ["Food (अन्न सेवा)", "Medical (चिकित्सा)", "Education (शिक्षा)", "Elderly (बुजुर्ग)", "Girl Marriage (कन्या विवाह)", "Temple Seva (मंदिर सेवा)"];

export default function DonateForm() {
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [campaign, setCampaign] = useState("general");
  const [done, setDone] = useState(null);
  useEffect(() => { const c = new URLSearchParams(window.location.search).get("campaign"); if (c) setCampaign(c); }, []);
  const final = custom ? Number(custom) : amount;

  function submit(e) {
    e.preventDefault();
    if (!final || final < 1) return;
    const f = new FormData(e.target);
    setDone({ name: f.get("anon") ? "दानदाता" : f.get("name"), amount: final, id: "SSKS-" + Date.now().toString().slice(-7) });
  }

  if (done)
    return (
      <div className="card animate-rise text-center">
        <p className="text-6xl">🙏</p>
        <h3 className="mt-3 font-head text-3xl">धन्यवाद, {done.name}!</h3>
        <p className="mt-2 text-lg">₹{done.amount.toLocaleString("en-IN")} के आपके सहयोग के लिए आभार।</p>
        <p className="mt-1 text-sm text-navy/70">Reference ID: {done.id}</p>
        <p className="mt-3 rounded-lg bg-sandal p-3 text-sm">यह डेमो फ्लो है। Payment gateway जुड़ने पर यहाँ वास्तविक भुगतान, server-side verification और receipt उपलब्ध होगी।</p>
        <button onClick={() => setDone(null)} className="btn btn-saffron mt-5">नया दान करें</button>
      </div>
    );

  return (
    <form onSubmit={submit} className="card space-y-4">
      <select value={campaign} onChange={(e) => setCampaign(e.target.value)} className="input" aria-label="अभियान">
        <option value="general">General Donation (सामान्य दान)</option>
        {CAMPAIGNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <select name="cause" className="input" aria-label="सेवा">{CAUSES.map((c) => <option key={c}>{c}</option>)}</select>
      <div>
        <p className="mb-2 font-semibold">दान राशि</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {AMOUNTS.map((a) => (
            <button type="button" key={a} onClick={() => { setAmount(a); setCustom(""); }}
              className={`rounded-lg border-2 py-2 font-semibold transition ${!custom && amount === a ? "border-saffron bg-saffron text-white" : "border-saffron/40 hover:bg-sandal"}`}>₹{a.toLocaleString("en-IN")}</button>
          ))}
        </div>
        <input type="number" min="1" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom Amount (₹)" className="input mt-3" />
      </div>
      <input name="name" required placeholder="दानदाता का नाम" className="input" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="mobile" required type="tel" placeholder="मोबाइल नंबर" className="input" />
        <input name="email" required type="email" placeholder="ईमेल (receipt हेतु)" className="input" />
      </div>
      <input name="pan" placeholder="PAN (वैकल्पिक – जहाँ आवश्यक हो)" className="input" />
      <label className="flex items-center gap-2"><input type="checkbox" name="anon" className="h-4 w-4 accent-saffron" /> Anonymous Donation</label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" required className="mt-1 h-4 w-4 accent-saffron" /> मैं Donation Terms एवं Consent से सहमत हूँ।</label>
      <button className="btn btn-saffron w-full text-lg">₹{(final || 0).toLocaleString("en-IN")} सुरक्षित रूप से दान करें</button>
    </form>
  );
}
