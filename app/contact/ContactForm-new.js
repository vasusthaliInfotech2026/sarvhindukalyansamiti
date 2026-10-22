"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Message भेजने में समस्या हुई।"
        );
      }

      // Success
      setSent(true);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

    } catch (err) {
      console.error("Contact form submission error:", err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success message
  if (sent) {
    return (
      <div className="card animate-rise text-center">
        <p className="text-5xl">🙏</p>

        <h3 className="mt-3 font-head text-2xl">
          संदेश भेज दिया गया!
        </h3>

        <p className="mt-2">
          धन्यवाद। आपका संदेश हमें सफलतापूर्वक प्राप्त हो गया है।
          हम जल्द ही आपसे संपर्क करेंगे।
        </p>

        <button
          type="button"
          onClick={() => {
            setSent(false);
            setError("");
          }}
          className="btn btn-saffron mt-5"
        >
          नया संदेश भेजें
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-4"
    >
      <div>
        <label className="block mb-2 font-semibold">
          नाम
        </label>

        <input
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="अपना नाम लिखें"
          className="input w-full"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-2 font-semibold">
            ईमेल
          </label>

          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="अपना ईमेल लिखें"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            फोन नंबर
          </label>

          <input
            required
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="फोन नंबर डालें"
            className="input w-full"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          विषय
        </label>

        <input
          required
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="विषय लिखें"
          className="input w-full"
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">
          संदेश
        </label>

        <textarea
          required
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="अपना संदेश लिखें"
          className="input w-full"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-saffron w-full"
      >
        {loading ? "भेजा जा रहा है..." : "संदेश भेजें"}
      </button>
    </form>
  );
}