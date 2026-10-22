"use client";

import { useEffect, useState } from "react";

export default function RazorpayTest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: 200,
    purpose: "General Donation",
  });

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Load Razorpay Checkout script
  // --------------------------------------------------
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // --------------------------------------------------
  // Handle input changes
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Verify payment with our server
  // --------------------------------------------------
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch(
        "/api/razorpay/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorName: formData.name.trim(),
            donorEmail: formData.email.trim(),
            donorPhone: formData.phone.trim(),

            amount: Number(formData.amount),

            purpose: formData.purpose,

            razorpayOrderId:
              paymentResponse.razorpay_order_id,

            razorpayPaymentId:
              paymentResponse.razorpay_payment_id,

            razorpaySignature:
              paymentResponse.razorpay_signature,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Payment Verification Response:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          "Payment was completed, but verification failed.\n\n" +
            (data.message ||
              "We could not verify your payment. Please contact support.")
        );

        return;
      }

      // ----------------------------------------------
      // Payment successfully verified + saved
      // ----------------------------------------------

      alert(
        "Donation Successful! 🎉\n\n" +
          "Thank you, " +
          formData.name.trim() +
          ", for your generous donation.\n\n" +
          "Amount: ₹" +
          Number(formData.amount).toFixed(2) +
          "\n" +
          "Payment ID: " +
          data.payment_id +
          "\n" +
          "Order ID: " +
          data.order_id +
          "\n" +
          "Receipt No: " +
          data.receipt_number
      );

      // Reset form after successful payment
      setFormData({
        name: "",
        email: "",
        phone: "",
        amount: 200,
        purpose: "General Donation",
      });
    } catch (error) {
      console.error(
        "Payment Verification Error:",
        error
      );

      alert(
        "Payment was completed, but we could not confirm the payment with our server.\n\n" +
          "Please do not make another payment immediately.\n\n" +
          "Payment ID: " +
          (paymentResponse?.razorpay_payment_id ||
            "Not available") +
          "\n\nPlease contact support if the amount was deducted."
      );
    }
  };

  // --------------------------------------------------
  // Create Razorpay Order
  // --------------------------------------------------
  const createOrder = async () => {
    try {
      // ----------------------------------------------
      // Basic validation
      // ----------------------------------------------

      if (!formData.name.trim()) {
        alert("Please enter your name.");
        return;
      }

      if (!formData.email.trim()) {
        alert("Please enter your email.");
        return;
      }

      // Basic email validation
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email.trim())) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!formData.phone.trim()) {
        alert("Please enter your phone number.");
        return;
      }

      // Indian phone validation
      const phoneRegex = /^[6-9]\d{9}$/;

      if (!phoneRegex.test(formData.phone.trim())) {
        alert(
          "Please enter a valid 10-digit Indian phone number."
        );
        return;
      }

      if (
        !formData.amount ||
        Number(formData.amount) < 50
      ) {
        alert(
          "Please enter an amount of at least ₹50."
        );
        return;
      }

      setLoading(true);

      // ----------------------------------------------
      // 1. Create Razorpay Order on our server
      // ----------------------------------------------

      const response = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(formData.amount),
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            purpose: formData.purpose,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Razorpay Order Response:",
        data
      );

      if (!response.ok || !data.success) {
        alert(
          data.message ||
            "Unable to create Razorpay order."
        );

        return;
      }

      // ----------------------------------------------
      // 2. Open Razorpay Checkout
      // ----------------------------------------------

      const options = {
        key:
          process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "सर्व हिन्दू कल्याण समिति",

        description: "Donation",

        order_id: data.order.id,

        // --------------------------------------------
        // Payment successful
        // --------------------------------------------
        handler: async function (
          paymentResponse
        ) {
          console.log(
            "Razorpay Payment Response:",
            paymentResponse
          );

          // Verify payment on our server
          await verifyPayment(
            paymentResponse
          );
        },

        // --------------------------------------------
        // Prefill donor information
        // --------------------------------------------
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },

        // --------------------------------------------
        // Notes
        // --------------------------------------------
        notes: {
          purpose: formData.purpose,
          donor_name: formData.name.trim(),
        },

        // --------------------------------------------
        // Checkout theme
        // --------------------------------------------
        theme: {
          color: "#f97316",
        },
      };

      // ----------------------------------------------
      // Check Razorpay SDK
      // ----------------------------------------------

      if (!window.Razorpay) {
        alert(
          "Razorpay Checkout could not be loaded. Please refresh the page and try again."
        );

        return;
      }

      const razorpay =
        new window.Razorpay(options);

      // ----------------------------------------------
      // Payment failed
      // ----------------------------------------------

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response.error
          );

          const error =
            response?.error || {};

          const reason =
            error.description ||
            error.reason ||
            "Payment failed. Please try again.";

          alert(
            "Payment Failed ❌\n\n" +
              "Reason: " +
              reason +
              "\n\n" +
              "Please try again or use another payment method."
          );
        }
      );

      // ----------------------------------------------
      // Open Razorpay
      // ----------------------------------------------

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        "Something went wrong while processing the payment.\n\n" +
          (error?.message ||
            "Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Page UI
  // --------------------------------------------------

  return (
    <main className="min-h-[500px] flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">

        <h1 className="text-2xl font-bold mb-6">
          Razorpay Donation Test
        </h1>

        {/* ----------------------------------------- */}
        {/* Donor Name */}
        {/* ----------------------------------------- */}

        <label className="block mb-2 font-medium">
          Donor Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-5"
          placeholder="Enter your name"
        />

        {/* ----------------------------------------- */}
        {/* Email */}
        {/* ----------------------------------------- */}

        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-5"
          placeholder="Enter your email"
        />

        {/* ----------------------------------------- */}
        {/* Phone */}
        {/* ----------------------------------------- */}

        <label className="block mb-2 font-medium">
          Phone Number
        </label>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-5"
          placeholder="Enter your 10-digit phone number"
          maxLength={10}
        />

        {/* ----------------------------------------- */}
        {/* Donation Amount */}
        {/* ----------------------------------------- */}

        <label className="block mb-2 font-medium">
          Donation Amount
        </label>

        <input
          type="number"
          name="amount"
          min="50"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-5"
          placeholder="Enter amount"
        />

        {/* ----------------------------------------- */}
        {/* Donation Purpose */}
        {/* ----------------------------------------- */}

        <label className="block mb-2 font-medium">
          Donation Purpose
        </label>

        <select
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-5"
        >
          <option value="General Donation">
            General Donation
          </option>

          <option value="Orphanage">
            Orphanage
          </option>

          <option value="Food Distribution">
            Food Distribution
          </option>

          <option value="Medical Help">
            Medical Help
          </option>

          <option value="Clothes Distribution">
            Clothes Distribution
          </option>

          <option value="Nirdhan Kanya Vivah">
            Nirdhan Kanya Vivah
          </option>

          <option value="Samuhik Vivah">
            Samuhik Vivah
          </option>

          <option value="Elderly Support">
            Elderly Support
          </option>

          <option value="Ayushman Card Help">
            Ayushman Card Help
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        {/* ----------------------------------------- */}
        {/* Donate Button */}
        {/* ----------------------------------------- */}

        <button
          type="button"
          onClick={createOrder}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 text-white py-3 font-semibold disabled:opacity-50"
        >
          {loading
            ? "Creating Order..."
            : "Donate Now"}
        </button>

      </div>
    </main>
  );
}