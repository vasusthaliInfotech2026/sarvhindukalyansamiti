"use client";

import { useState } from "react";

export default function RazorpayTest() {
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      console.log("Razorpay Order Response:", data);

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(`Order created successfully!\nOrder ID: ${data.order.id}`);
    } catch (error) {
      console.error(error);
      alert("Unable to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Razorpay Test</h1>

      <input
        type="number"
        value={amount}
        min="50"
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px",
          marginRight: "10px",
        }}
      />

      <button
        onClick={createOrder}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Razorpay Order"}
      </button>
    </div>
  );
}