"use client";

import { useEffect, useState } from "react";

const MEMBERSHIP_FEES = [51, 101, 201, 501, 1001, 1100, 2100, 2500, 5100];

export default function MemberRegistrationTest() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    membership_type: "General",
    role: "",
    membership_fee: 500,
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Load Razorpay Checkout
  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    if (!MEMBERSHIP_FEES.includes(Number(formData.membership_fee))) {
      return "Please select a valid membership fee.";
    }

    return null;
  };

  const createOrder = async () => {
    try {
      setErrorMessage("");
      setSuccessData(null);

      const validationError = validateForm();

      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      setLoading(true);

      // Create membership order on server
      const response = await fetch("/api/members/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          membership_type: formData.membership_type,
          role: formData.role.trim(),
          membership_fee: Number(formData.membership_fee),
        }),
      });

      const data = await response.json();

      console.log("Member Order Response:", data);

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "Unable to create membership order."
        );
        return;
      }

      if (!window.Razorpay) {
        setErrorMessage(
          "Razorpay Checkout could not be loaded. Please refresh the page and try again."
        );
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.order.amount,
        currency: data.order.currency,

        name: "सर्व हिन्दू कल्याण समिति",

        description: "Membership Registration Fee",

        order_id: data.order.id,

        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          purpose: "Membership Registration",
          membership_type: formData.membership_type,
        },

        theme: {
          color: "#f97316",
        },

        handler: async function (paymentResponse) {
          try {
            setLoading(true);

            console.log("Razorpay Payment Response:", paymentResponse);

            // Verify payment on our server
            const verifyResponse = await fetch(
              "/api/members/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  member_id: data.member_id,

                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            console.log("Membership Verification:", verifyData);

            if (!verifyResponse.ok || !verifyData.success) {
              setErrorMessage(
                verifyData.message ||
                  "Payment was received but verification failed. Please contact the committee."
              );
              return;
            }

            // Payment + member successfully verified
            setSuccessData({
              memberName: formData.full_name,
              amount: formData.membership_fee,
              paymentId:
                paymentResponse.razorpay_payment_id,
              orderId:
                paymentResponse.razorpay_order_id,
              receiptNumber:
                verifyData.receipt_number,
              membershipId:
                verifyData.member_id,
            });
          } catch (error) {
            console.error(
              "Membership Verification Error:",
              error
            );

            setErrorMessage(
              "Payment was completed, but we could not verify it. Please contact the committee with your payment details."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async function (response) {
        console.error("Payment Failed:", response.error);

        setLoading(false);

        const reason =
          response?.error?.description ||
          response?.error?.reason ||
          "Payment failed. Please try again.";

        setErrorMessage(`Payment failed: ${reason}`);
      });

      razorpay.open();
    } catch (error) {
      console.error("Membership Payment Error:", error);

      setErrorMessage(
        "Something went wrong while processing your membership registration."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (successData) {
    return (
      <main className="min-h-[600px] flex items-center justify-center p-8">
        <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">🎉</div>

          <h1 className="text-3xl font-bold text-green-600 mb-3">
            Registration Successful!
          </h1>

          <p className="text-gray-700 mb-6">
            Thank you, {successData.memberName}. Your membership
            registration has been successfully completed.
          </p>

          <div className="text-left rounded-xl bg-gray-50 p-5 space-y-3">
            <div>
              <strong>Membership ID:</strong>{" "}
              {successData.membershipId}
            </div>

            <div>
              <strong>Membership Fee:</strong> ₹
              {Number(successData.amount).toLocaleString("en-IN")}
            </div>

            <div>
              <strong>Payment ID:</strong>{" "}
              {successData.paymentId}
            </div>

            <div>
              <strong>Order ID:</strong>{" "}
              {successData.orderId}
            </div>

            <div>
              <strong>Receipt No:</strong>{" "}
              {successData.receiptNumber}
            </div>

            <div>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-semibold">
                Active
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-lg bg-orange-500 py-3 text-white font-semibold"
          >
            Register Another Member
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[600px] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Member Registration
        </h1>

        <p className="text-gray-600 mb-8">
          Enter your details and complete the membership fee payment.
        </p>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Full Name */}
        <label className="block mb-2 font-medium">
          Full Name *
        </label>

        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter your full name"
        />

        {/* Email */}
        <label className="block mb-2 font-medium">
          Email *
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter your email"
        />

        {/* Phone */}
        <label className="block mb-2 font-medium">
          Phone Number *
        </label>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter 10-digit phone number"
        />

        {/* Address */}
        <label className="block mb-2 font-medium">
          Address *
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter your complete address"
        />

        {/* City */}
        <label className="block mb-2 font-medium">
          City *
        </label>

        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter city"
        />

        {/* State */}
        <label className="block mb-2 font-medium">
          State *
        </label>

        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter state"
        />

        {/* Pincode */}
        <label className="block mb-2 font-medium">
          Pincode *
        </label>

        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          maxLength={6}
          className="w-full rounded-lg border p-3 mb-5"
          placeholder="Enter 6-digit pincode"
        />

        {/* Membership Type */}
        <label className="block mb-2 font-medium">
          Membership Type *
        </label>

        <select
          name="membership_type"
          value={formData.membership_type}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-5"
        >
          <option value="General">General</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Blood Donor">Blood Donor</option>
          <option value="Community Partner">
            Community Partner
          </option>
        </select>

        {/* Role */}
        <label className="block mb-2 font-medium">
          Role (Optional)
        </label>

        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 mb-6"
          placeholder="Enter role if applicable"
        />

        {/* Membership Fee */}
        <label className="block mb-3 font-medium">
          सदस्यता / सहायता शुल्क *
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {MEMBERSHIP_FEES.map((fee) => (
            <button
              key={fee}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  membership_fee: fee,
                }))
              }
              className={`rounded-lg border py-3 font-semibold transition ${
                Number(formData.membership_fee) === fee
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white border-orange-300"
              }`}
            >
              ₹{fee.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        {/* Selected Amount */}
        <div className="mb-6 rounded-lg bg-orange-50 p-4">
          <span className="font-medium">
            Selected Membership Fee:
          </span>

          <span className="ml-2 text-xl font-bold text-orange-600">
            ₹
            {Number(formData.membership_fee).toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={createOrder}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 py-4 text-white font-bold text-lg disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : "Register & Pay"}
        </button>
      </div>
    </main>
  );
}