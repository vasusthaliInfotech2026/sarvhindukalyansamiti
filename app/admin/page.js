"use client";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("donations"); // 'donations' | 'members' | 'contacts'
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setDonations(data.donations || []);
        setMembers(data.members || []);
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleVerifyPayment = async (type, id, name, utr) => {
    const confirmed = window.confirm(
      `क्या आपने अपने UPI ऐप में ${name} का पेमेंट (UTR/ID: ${utr}) चेक कर लिया है?\n\nOK दबाने पर पेमेंट वेरीफाई हो जाएगा और यूजर को ईमेल रसीद चली जाएगी।`
    );
    if (!confirmed) return;

    setVerifyingId(`${type}-${id}`);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage({ type: "success", text: result.message });
        await fetchDashboardData();
      } else {
        setMessage({
          type: "error",
          text: result.error || "वेरीफाई करने में समस्या आई।",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "सर्वर से संपर्क नहीं हो सका।" });
    } finally {
      setVerifyingId(null);
    }
  };

  const isVerifiedStatus = (row) => {
    const st = (row.payment_status || row.status || "").toLowerCase();
    const sig = (row.razorpay_signature || "").toLowerCase();
    if (st === "pending") return false;
    if (st === "paid" || st === "verified") return true;
    if (sig && sig !== "manual_qr_verified" && sig !== "auto_qr_verified") {
      return true;
    }
    return false;
  };

  const filterRows = (rows) => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some(
        (val) => val && String(val).toLowerCase().includes(q)
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-800">
              सर्व हिन्दू कल्याण समिति — एडमिन डैशबोर्ड
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              यहाँ से सभी दान (Donations), सदस्य (Members) और संपर्क फॉर्म (Contacts) देखें व QR पेमेंट वेरीफाई कर ईमेल रसीद भेजें।
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            🔄 डेटा रिफ्रेश करें
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => setActiveTab("donations")}
            className={`cursor-pointer p-5 rounded-2xl border transition ${
              activeTab === "donations"
                ? "bg-orange-600 text-white border-orange-600 shadow-md"
                : "bg-white text-slate-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <div className="text-sm font-medium opacity-85">
              कुल दान (Donations)
            </div>
            <div className="text-3xl font-bold mt-1">{donations.length}</div>
            <div className="text-xs mt-2 opacity-90">
              लंबित सत्यापन (Pending):{" "}
              {donations.filter((d) => !isVerifiedStatus(d)).length}
            </div>
          </div>

          <div
            onClick={() => setActiveTab("members")}
            className={`cursor-pointer p-5 rounded-2xl border transition ${
              activeTab === "members"
                ? "bg-orange-600 text-white border-orange-600 shadow-md"
                : "bg-white text-slate-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <div className="text-sm font-medium opacity-85">
              कुल सदस्य (Members)
            </div>
            <div className="text-3xl font-bold mt-1">{members.length}</div>
            <div className="text-xs mt-2 opacity-90">
              लंबित सत्यापन (Pending):{" "}
              {members.filter((m) => !isVerifiedStatus(m)).length}
            </div>
          </div>

          <div
            onClick={() => setActiveTab("contacts")}
            className={`cursor-pointer p-5 rounded-2xl border transition ${
              activeTab === "contacts"
                ? "bg-orange-600 text-white border-orange-600 shadow-md"
                : "bg-white text-slate-800 border-amber-200 hover:bg-amber-50"
            }`}
          >
            <div className="text-sm font-medium opacity-85">
              संपर्क संदेश (Contact Form)
            </div>
            <div className="text-3xl font-bold mt-1">{contacts.length}</div>
            <div className="text-xs mt-2 opacity-90">सभी पूछताछ एवं संदेश</div>
          </div>
        </div>

        {/* Status Notification Banner */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-sm font-medium flex justify-between items-center ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span>
              {message.type === "success" ? "✅ " : "⚠️ "}
              {message.text}
            </span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs underline ml-4"
            >
              बंद करें
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "donations"
                  ? "bg-orange-600 text-white"
                  : "bg-amber-50 text-slate-700"
              }`}
            >
              💰 डोनेशन पेमेंट्स ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "members"
                  ? "bg-orange-600 text-white"
                  : "bg-amber-50 text-slate-700"
              }`}
            >
              👥 मेंबर पेमेंट्स ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-orange-600 text-white"
                  : "bg-amber-50 text-slate-700"
              }`}
            >
              📩 कॉन्टैक्ट फॉर्म ({contacts.length})
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, मोबाइल, ईमेल या 12-अंकों का UTR खोजें..."
            className="w-full sm:w-80 px-4 py-2 text-sm border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Main Table Content */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              ⏳ डेटा लोड हो रहा है...
            </div>
          ) : activeTab === "donations" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-200 text-slate-700">
                    <th className="p-4">ID / तारीख</th>
                    <th className="p-4">दानदाता का विवरण</th>
                    <th className="p-4">राशि / उद्देश्य</th>
                    <th className="p-4">माध्यम & UTR / Payment ID</th>
                    <th className="p-4">स्टेटस</th>
                    <th className="p-4 text-center">एक्शन (Verify)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(donations).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        कोई डोनेशन रिकॉर्ड नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filterRows(donations).map((d) => {
                      const verified = isVerifiedStatus(d);
                      const cleanUtr = (d.razorpay_payment_id || "").replace(
                        "UPI_UTR_",
                        ""
                      );
                      return (
                        <tr key={d.id} className="hover:bg-amber-50/40">
                          <td className="p-4 font-mono text-xs text-slate-500">
                            #{d.id}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {d.created_at
                                ? new Date(d.created_at).toLocaleString("hi-IN")
                                : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">
                              {d.donor_name}
                            </div>
                            <div className="text-xs text-slate-600">
                              📞 {d.donor_phone}
                            </div>
                            <div className="text-xs text-slate-500">
                              ✉️ {d.donor_email || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-orange-700 text-base">
                              ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                            </div>
                            <div className="text-xs text-slate-600">
                              {d.donation_purpose}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 text-slate-700 mb-1">
                              {d.payment_method || "UPI / Online"}
                            </span>
                            <div className="font-mono text-xs font-bold text-slate-800">
                              UTR/ID: {cleanUtr}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Receipt: {d.receipt_number || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            {verified ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                ✅ Verified (Paid)
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                ⏳ Pending Verification
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {verified ? (
                              <button
                                onClick={() =>
                                  handleVerifyPayment(
                                    "donation",
                                    d.id,
                                    d.donor_name,
                                    cleanUtr
                                  )
                                }
                                disabled={verifyingId === `donation-${d.id}`}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                {verifyingId === `donation-${d.id}`
                                  ? "भेजा जा रहा..."
                                  : "📧 रसीद पुनः भेजें"}
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleVerifyPayment(
                                    "donation",
                                    d.id,
                                    d.donor_name,
                                    cleanUtr
                                  )
                                }
                                disabled={verifyingId === `donation-${d.id}`}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {verifyingId === `donation-${d.id}`
                                  ? "वेरीफाई हो रहा..."
                                  : "✅ Verify Payment"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === "members" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-200 text-slate-700">
                    <th className="p-4">ID / तारीख</th>
                    <th className="p-4">सदस्य का विवरण</th>
                    <th className="p-4">पता / पद / अन्य</th>
                    <th className="p-4">राशि & UTR / Payment ID</th>
                    <th className="p-4">स्टेटस</th>
                    <th className="p-4 text-center">एक्शन (Verify)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(members).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        कोई सदस्य रिकॉर्ड नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filterRows(members).map((m) => {
                      const verified = isVerifiedStatus(m);
                      const memberName =
                        m.full_name || m.name || m.member_name || "सदस्य";
                      const memberPhone =
                        m.phone || m.mobile || m.member_phone || "N/A";
                      const memberEmail = m.email || m.member_email || "N/A";
                      const cleanUtr = (
                        m.razorpay_payment_id ||
                        m.payment_id ||
                        ""
                      ).replace("UPI_UTR_", "");

                      return (
                        <tr key={m.id} className="hover:bg-amber-50/40">
                          <td className="p-4 font-mono text-xs text-slate-500">
                            #{m.id}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {m.created_at
                                ? new Date(m.created_at).toLocaleString("hi-IN")
                                : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">
                              {memberName}
                            </div>
                            <div className="text-xs text-slate-600">
                              📞 {memberPhone}
                            </div>
                            <div className="text-xs text-slate-500">
                              ✉️ {memberEmail}
                            </div>
                          </td>
                          <td className="p-4 text-xs text-slate-600">
                            <div>
                              {m.city || m.district || m.address || "-"}
                            </div>
                            {m.state && (
                              <div className="text-slate-400">{m.state}</div>
                            )}
                          </td>
                          <td className="p-4">
                            {m.amount && (
                              <div className="font-bold text-orange-700">
                                ₹{m.amount}
                              </div>
                            )}
                            <div className="font-mono text-xs font-bold text-slate-800">
                              UTR/ID: {cleanUtr || "N/A"}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              Order: {m.razorpay_order_id || m.order_id || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            {verified ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                ✅ Verified (Paid)
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                ⏳ Pending Verification
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {verified ? (
                              <button
                                onClick={() =>
                                  handleVerifyPayment(
                                    "member",
                                    m.id,
                                    memberName,
                                    cleanUtr
                                  )
                                }
                                disabled={verifyingId === `member-${m.id}`}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              >
                                {verifyingId === `member-${m.id}`
                                  ? "भेजा जा रहा..."
                                  : "📧 रसीद पुनः भेजें"}
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleVerifyPayment(
                                    "member",
                                    m.id,
                                    memberName,
                                    cleanUtr
                                  )
                                }
                                disabled={verifyingId === `member-${m.id}`}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {verifyingId === `member-${m.id}`
                                  ? "वेरीफाई हो रहा..."
                                  : "✅ Verify Payment"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-200 text-slate-700">
                    <th className="p-4">ID / तारीख</th>
                    <th className="p-4">नाम</th>
                    <th className="p-4">संपर्क (मोबाइल / ईमेल)</th>
                    <th className="p-4">विषय (Subject)</th>
                    <th className="p-4">संदेश (Message)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(contacts).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        कोई संपर्क संदेश (Contact Form Data) नहीं मिला।
                      </td>
                    </tr>
                  ) : (
                    filterRows(contacts).map((c) => (
                      <tr key={c.id} className="hover:bg-amber-50/40">
                        <td className="p-4 font-mono text-xs text-slate-500">
                          #{c.id}
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {c.created_at
                              ? new Date(c.created_at).toLocaleString("hi-IN")
                              : ""}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {c.name || c.full_name || "N/A"}
                        </td>
                        <td className="p-4 text-xs text-slate-600">
                          <div>📞 {c.phone || c.mobile || "N/A"}</div>
                          <div>✉️ {c.email || "N/A"}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">
                          {c.subject || "-"}
                        </td>
                        <td className="p-4 text-slate-700 max-w-md whitespace-pre-wrap">
                          {c.message || c.query || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}