"use client";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("donations"); // 'donations' | 'members' | 'contacts'
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
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

  // Action Handler: actionType can be 'verify' or 'reject'
  const handleAction = async (type, id, name, actionType) => {
    const isVerify = actionType === "verify";
    const confirmMsg = isVerify
      ? `Kya aapne UPI app mein ${name} ka payment check kar liya hai?\n\nOK dabane par payment verify ho jayegi aur user ko email receipt chali jayegi.`
      : `Kya aap ${name} ko ye mail bhejna chahte hain ki payment prapt nahi hui hai?`;

    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    setProcessingId(`${type}-${id}-${actionType}`);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, action: actionType }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage({ type: "success", text: result.message });
        await fetchDashboardData();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Action poora karne mein samasya aayi.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server se sampark nahi ho saka." });
    } finally {
      setProcessingId(null);
    }
  };

  const isVerifiedStatus = (row) => {
    const st = (row.payment_status || row.status || "").toLowerCase();
    if (st === "pending" || st === "failed" || st === "rejected") return false;
    if (st === "paid" || st === "verified") return true;
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
      Sarv Hindu Kalyan Samiti — Admin Dashboard
    </h1>
    <p className="text-sm text-slate-600 mt-1">
      Yahan se sabhi daan, sadasya aur contact form dekhein aur QR payment verify ya reject karein.
    </p>
  </div>
  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
    <button
      onClick={fetchDashboardData}
      className="px-4 py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold rounded-xl text-sm transition cursor-pointer"
    >
      🔄 Refresh
    </button>
    <button
      onClick={async () => {
        try {
          await fetch("/api/admin/logout", { method: "POST" });
          window.location.href = "/admin/login";
        } catch (err) {
          console.error("Logout failed", err);
        }
      }}
      className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition cursor-pointer"
    >
      🚪 Logout
    </button>
  </div>
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
            <div className="text-sm font-medium opacity-85">Kul Daan (Donations)</div>
            <div className="text-3xl font-bold mt-1">{donations.length}</div>
            <div className="text-xs mt-2 opacity-90">
              Pending: {donations.filter((d) => !isVerifiedStatus(d)).length}
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
            <div className="text-sm font-medium opacity-85">Kul Sadasya (Members)</div>
            <div className="text-3xl font-bold mt-1">{members.length}</div>
            <div className="text-xs mt-2 opacity-90">
              Pending: {members.filter((m) => !isVerifiedStatus(m)).length}
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
            <div className="text-sm font-medium opacity-85">Contact Messages</div>
            <div className="text-3xl font-bold mt-1">{contacts.length}</div>
            <div className="text-xs mt-2 opacity-90">Sabhi poochtach</div>
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
            <span>{message.type === "success" ? "✅ " : "⚠️ "} {message.text}</span>
            <button onClick={() => setMessage(null)} className="text-xs underline ml-4">
              Band Karein
            </button>
          </div>
        )}

        {/* Search & Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("donations")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "donations" ? "bg-orange-600 text-white" : "bg-amber-50 text-slate-700"
              }`}
            >
              💰 Donations ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "members" ? "bg-orange-600 text-white" : "bg-amber-50 text-slate-700"
              }`}
            >
              👥 Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer ${
                activeTab === "contacts" ? "bg-orange-600 text-white" : "bg-amber-50 text-slate-700"
              }`}
            >
              📩 Contacts ({contacts.length})
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Naam, mobile ya email se khojein..."
            className="w-full sm:w-80 px-4 py-2 text-sm border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Main Content Table */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">⏳ Data load ho raha hai...</div>
          ) : activeTab === "donations" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50 border-b border-amber-200 text-slate-700">
                    <th className="p-4">ID / Tareekh</th>
                    <th className="p-4">Donar Details</th>
                    <th className="p-4">Rashi / Udeshya</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions (Verify / Payment Not Received)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(donations).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Koi donation record nahi mila.</td>
                    </tr>
                  ) : (
                    filterRows(donations).map((d) => {
                      const verified = isVerifiedStatus(d);
                      return (
                        <tr key={d.id} className="hover:bg-amber-50/40">
                          <td className="p-4 font-mono text-xs text-slate-500">
                            #{d.id}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {d.created_at ? new Date(d.created_at).toLocaleString("hi-IN") : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{d.donor_name}</div>
                            <div className="text-xs text-slate-600">📞 {d.donor_phone}</div>
                            <div className="text-xs text-slate-500">✉️ {d.donor_email || "N/A"}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-orange-700 text-base">
                              ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                            </div>
                            <div className="text-xs text-slate-600">{d.donation_purpose}</div>
                          </td>
                          <td className="p-4">
                            {verified ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                ✅ Verified (Paid)
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                ⏳ Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleAction("donation", d.id, d.donor_name, "verify")}
                                disabled={processingId === `donation-${d.id}-verify`}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {processingId === `donation-${d.id}-verify` ? "Bhej rahe..." : "✅ Verify Payment"}
                              </button>
                              <button
                                onClick={() => handleAction("donation", d.id, d.donor_name, "reject")}
                                disabled={processingId === `donation-${d.id}-reject`}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {processingId === `donation-${d.id}-reject` ? "Bhej rahe..." : "❌ Payment Not Received"}
                              </button>
                            </div>
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
                    <th className="p-4">ID / Tareekh</th>
                    <th className="p-4">Sadasya Details</th>
                    <th className="p-4">Pata / State</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions (Verify / Payment Not Received)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(members).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Koi sadasya record nahi mila.</td>
                    </tr>
                  ) : (
                    filterRows(members).map((m) => {
                      const verified = isVerifiedStatus(m);
                      const memberName = m.full_name || m.name || m.member_name || "Sadasya";
                      const memberPhone = m.phone || m.mobile || m.member_phone || "N/A";
                      const memberEmail = m.email || m.member_email || "N/A";

                      return (
                        <tr key={m.id} className="hover:bg-amber-50/40">
                          <td className="p-4 font-mono text-xs text-slate-500">
                            #{m.id}
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {m.created_at ? new Date(m.created_at).toLocaleString("hi-IN") : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{memberName}</div>
                            <div className="text-xs text-slate-600">📞 {memberPhone}</div>
                            <div className="text-xs text-slate-500">✉️ {memberEmail}</div>
                          </td>
                          <td className="p-4 text-xs text-slate-600">
                            <div>{m.city || m.district || m.address || "-"}</div>
                            {m.state && <div className="text-slate-400">{m.state}</div>}
                          </td>
                          <td className="p-4">
                            {verified ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                ✅ Verified (Paid)
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                ⏳ Pending
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleAction("member", m.id, memberName, "verify")}
                                disabled={processingId === `member-${m.id}-verify`}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {processingId === `member-${m.id}-verify` ? "Bhej rahe..." : "✅ Verify Payment"}
                              </button>
                              <button
                                onClick={() => handleAction("member", m.id, memberName, "reject")}
                                disabled={processingId === `member-${m.id}-reject`}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition cursor-pointer"
                              >
                                {processingId === `member-${m.id}-reject` ? "Bhej rahe..." : "❌ Payment Not Received"}
                              </button>
                            </div>
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
                    <th className="p-4">ID / Tareekh</th>
                    <th className="p-4">Naam</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {filterRows(contacts).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Koi contact message nahi mila.</td>
                    </tr>
                  ) : (
                    filterRows(contacts).map((c) => (
                      <tr key={c.id} className="hover:bg-amber-50/40">
                        <td className="p-4 font-mono text-xs text-slate-500">
                          #{c.id}
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {c.created_at ? new Date(c.created_at).toLocaleString("hi-IN") : ""}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-900">{c.name || c.full_name || "N/A"}</td>
                        <td className="p-4 text-xs text-slate-600">
                          <div>📞 {c.phone || c.mobile || "N/A"}</div>
                          <div>✉️ {c.email || "N/A"}</div>
                        </td>
                        <td className="p-4 font-medium text-slate-800">{c.subject || "-"}</td>
                        <td className="p-4 text-slate-700 max-w-md whitespace-pre-wrap">{c.message || c.query || "-"}</td>
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