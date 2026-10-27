"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"), // डेटाबेस कॉलम 'phone' के अनुसार
      email: formData.get("email"),
      subject: formData.get("subject"), // डेटाबेस कॉलम 'subject' के अनुसार
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSent(true);
      } else {
        setError(
          result.error || "संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
        );
      }
    } catch (err) {
      setError("सर्वर से संपर्क नहीं हो सका।");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="animate-rise text-center">
        <p className="text-5xl">🙏</p>
        <h3 className="mt-3 font-head text-2xl">संदेश भेज दिया गया</h3>
        <p className="mt-2">हम शीघ्र ही आपसे संपर्क करेंगे।</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 font-semibold">नाम</label>
        <input
          name="name"
          required
          maxLength={150}
          placeholder="अपना नाम लिखें"
          className="input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-2 font-semibold">फोन नंबर</label>

          <input
            name="phone"
            required
            type="tel"
            maxLength={20}
            placeholder="फोन नंबर डालें"
            className="input"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">ईमेल</label>
          <input
            name="email"
            required
            type="email"
            maxLength={255}
            placeholder="अपना ईमेल लिखें"
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">विषय</label>
        <input
          name="subject"
          maxLength={255}
          placeholder="विषय लिखें"
          className="input"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">संदेश</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="अपना संदेश लिखें"
          className="input"
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-saffron w-40 mx-auto block"
      >
        {loading ? "भेजा जा रहा है..." : "संदेश भेजें"}
      </button>
    </form>
  );
}
