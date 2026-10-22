"use client";
import { useState } from "react";
const AREAS = ["अन्न सेवा", "स्वास्थ्य", "शिक्षा", "बुजुर्ग सेवा", "कन्या विवाह", "रक्तदान", "मंदिर सेवा"];
export default function VolunteerForm() {
  const [ok, setOk] = useState(false);
  if (ok) return <div className="card animate-rise text-center"><p className="text-5xl">🙏</p><h3 className="mt-2 font-head text-2xl">आवेदन प्राप्त हुआ</h3><p className="mt-2">Admin approval के बाद हम आपसे संपर्क करेंगे।</p></div>;
  return (
   <form
  onSubmit={(e) => {
    e.preventDefault();
    setOk(true);
  }}
  className=" space-y-4"
>
  <input required placeholder="नाम" className="input" />

  <div className="grid gap-4 sm:grid-cols-2">
    <input required type="tel" placeholder="मोबाइल" className="input" />
    <input type="email" placeholder="ईमेल" className="input" />
  </div>

  {/* New Field: Pata */}
  <textarea required placeholder="पता" rows="3" className="input" />

  {/* New Fields: Shehar & Pin Code */}
  <div className="grid gap-4 sm:grid-cols-2">
    <input required placeholder="शहर" className="input" />
    <input
      required
      type="text"
      inputMode="numeric"
      maxLength={6}
      placeholder="पिन कोड"
      className="input"
    />
  </div>

  <div>
    <p className="mb-2 font-semibold">सेवा क्षेत्रों में रुचि</p>
    <div className="flex flex-wrap gap-3">
      {AREAS.map((a) => (
        <label key={a} className="flex items-center gap-1.5">
          <input type="checkbox" className="accent-saffron" />
          {a}
        </label>
      ))}
    </div>
  </div>

  <button className="btn btn-saffron mx-auto block w-60">
    आवेदन भेजें
  </button>
</form>

    
  );
}
