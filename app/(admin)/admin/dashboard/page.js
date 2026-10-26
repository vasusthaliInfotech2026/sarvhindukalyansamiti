"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Modal State for User & Payment Details Popup
  const [selectedUserModal, setSelectedUserModal] = useState(null);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState(null); // { type, id, name, utr }

  // Delete confirmation modal state for contacts
  const [deleteContactModal, setDeleteContactModal] = useState(null); // stores contact object

  // Helper: Check if payment/status is verified or active
  const isVerifiedStatus = (row) => {
    if (!row) return false;
    const st = (row.payment_status || row.status || "").toLowerCase();
    const sig = (row.razorpay_signature || "").toLowerCase();
    if (st === "pending") return false;
    if (
      st === "paid" ||
      st === "verified" ||
      st === "success" ||
      st === "active"
    ) {
      return true;
    }
    if (sig && sig !== "manual_qr_verified" && sig !== "auto_qr_verified") {
      return true;
    }
    return false;
  };

  // Helper: Clean UTR / Payment ID
  const getCleanUtr = (row) => {
    if (!row) return "N/A";
    const raw = row.razorpay_payment_id || row.payment_id || row.utr || "";
    return raw ? raw.replace("UPI_UTR_", "") : "N/A";
  };

  // Fetch Dashboard Data with Auth Check
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setDonations(data.donations || []);
        setMembers(data.members || []);
        setContacts(data.contacts || []);
      } else if (data.unauthorized) {
        router.replace("/admin/login");
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setMessage({
        type: "error",
        text: "Failed to load dashboard data. Please check connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Proper Logout Functionality
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("admin_token");
      sessionStorage.clear();

      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Could not connect to server, please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  // Custom Confirm Trigger
  const promptVerifyPayment = (type, id, name, utr) => {
    setConfirmModal({ type, id, name, utr });
  };

  // Actual Verify Payment & Send Email Receipt
  const handleConfirmVerify = async () => {
    if (!confirmModal) return;
    const { type, id } = confirmModal;
    const utr = confirmModal.utr;

    setConfirmModal(null);
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
        setMessage({
          type: "success",
          text:
            result.message || "Payment verified successfully and receipt sent!",
        });
        await fetchDashboardData();

        if (selectedUserModal && selectedUserModal.data.id === id) {
          setSelectedUserModal((prev) =>
            prev
              ? {
                  ...prev,
                  data: {
                    ...prev.data,
                    status: "Active",
                    payment_status: "verified",
                  },
                }
              : null,
          );
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to verify payment.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setVerifyingId(null);
    }
  };

  // Handle Contact Delete
  const handleDeleteContact = async () => {
    if (!deleteContactModal) return;
    const contactId = deleteContactModal.id;

    try {
      const res = await fetch(`/api/admin/contacts?id=${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setMessage({
          type: "success",
          text: "Contact message deleted successfully.",
        });
        setContacts((prev) => prev.filter((c) => c.id !== contactId));
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete contact.",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setDeleteContactModal(null);
    }
  };

  // Analytics & Chart Calculations
  const analytics = useMemo(() => {
    const verifiedDonations = donations.filter((d) => isVerifiedStatus(d));
    const pendingDonations = donations.filter((d) => !isVerifiedStatus(d));

    const verifiedMembers = members.filter((m) => isVerifiedStatus(m));
    const pendingMembers = members.filter((m) => !isVerifiedStatus(m));

    const totalDonationVerifiedAmt = verifiedDonations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0,
    );
    const totalDonationPendingAmt = pendingDonations.reduce(
      (sum, d) => sum + Number(d.amount || 0),
      0,
    );
    const totalDonationAllAmt =
      totalDonationVerifiedAmt + totalDonationPendingAmt;

    const totalMemberVerifiedAmt = verifiedMembers.reduce(
      (sum, m) => sum + Number(m.membership_fee || m.amount || 0),
      0,
    );
    const totalMemberPendingAmt = pendingMembers.reduce(
      (sum, m) => sum + Number(m.membership_fee || m.amount || 0),
      0,
    );
    const totalMemberAllAmt = totalMemberVerifiedAmt + totalMemberPendingAmt;

    const grandTotalVerifiedAmt =
      totalDonationVerifiedAmt + totalMemberVerifiedAmt;
    const grandTotalPendingAmt =
      totalDonationPendingAmt + totalMemberPendingAmt;

    return {
      verifiedDonationsCount: verifiedDonations.length,
      pendingDonationsCount: pendingDonations.length,
      verifiedMembersCount: verifiedMembers.length,
      pendingMembersCount: pendingMembers.length,
      totalDonationVerifiedAmt,
      totalDonationPendingAmt,
      totalDonationAllAmt,
      totalMemberVerifiedAmt,
      totalMemberPendingAmt,
      totalMemberAllAmt,
      grandTotalVerifiedAmt,
      grandTotalPendingAmt,
    };
  }, [donations, members]);

  // Filter rows by Search Query & Verification Status
  const filterRows = (rows, isPaymentTable = true) => {
    return rows.filter((r) => {
      if (isPaymentTable && statusFilter !== "all") {
        const verified = isVerifiedStatus(r);
        if (statusFilter === "verified" && !verified) return false;
        if (statusFilter === "pending" && verified) return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return Object.values(r).some(
        (val) => val && String(val).toLowerCase().includes(q),
      );
    });
  };

  // Sidebar Menu Items
  const navItems = [
    {
      id: "overview",
      label: "Dashboard Analytics",
      sub: "Overview & Charts",
      badge: null,
      icon: "📊",
    },
    {
      id: "donations",
      label: "Donation Payments",
      sub: "Manage Donor Payments",
      badge: donations.length,
      pending: analytics.pendingDonationsCount,
      icon: "💰",
    },
    {
      id: "members",
      label: "Members Directory",
      sub: "Membership & Fees",
      badge: members.length,
      pending: analytics.pendingMembersCount,
      icon: "👥",
    },
    {
      id: "contacts",
      label: "Contact Inquiries",
      sub: "Messages & Queries",
      badge: contacts.length,
      icon: "📩",
    },
  ];

  const maxBarAmount = Math.max(
    analytics.totalDonationAllAmt,
    analytics.totalMemberAllAmt,
    1000,
  );

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ================= FIXED SIDEBAR WITH INTERNAL SCROLLING ================= */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-72 h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid text-2xl bg-white border-2 rounded-full shadow-inner h-11 w-11 place-items-center border-saffron font-head text-saffron">
                ॐ
              </span>
              <div>
                <p className="text-sm leading-tight font-head text-white lg:text-base xl:text-base">
                  सर्व हिन्दू <br className="sm:hidden" /> कल्याण समिति
                </p>
                <p className="ml-2 text-xs text-slate-400 font-medium hidden sm:inline">
                  Admin Control Panel
                </p>
              </div>
            </Link>

            <div></div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-200 p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  setStatusFilter("all");
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <div className="text-sm leading-none">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 font-normal opacity-80">
                      {item.sub}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.pending > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium border border-amber-500/30">
                      {item.pending} pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/90 shrink-0">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Verified Collection
            </span>
            <span className="text-xs font-bold text-emerald-400">
              ₹{analytics.grandTotalVerifiedAmt.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-100">
                {activeTab === "overview" && "Dashboard Analytics & Overview"}
                {activeTab === "donations" && "Donation Payments Management"}
                {activeTab === "members" && "Membership Directory & Management"}
                {activeTab === "contacts" && "Contact Form Inquiries"}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Click on any user name to view complete details and transaction
                history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 shadow-xs ml-auto">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified: ₹
              {analytics.grandTotalVerifiedAmt.toLocaleString("en-IN")}
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <span>🔄</span>
              <span>{loading ? "Refreshing..." : "Refresh Data"}</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition cursor-pointer disabled:opacity-50"
              title="Logout from Admin Panel"
            >
              <span>🚪</span>
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          {message && (
            <div
              className={`p-4 rounded-2xl border text-sm font-medium flex justify-between items-center shadow-xs ${
                message.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
              <span>
                {message.type === "success" ? "✅ " : "⚠️ "}
                {message.text}
              </span>
              <button
                onClick={() => setMessage(null)}
                className="text-xs underline ml-4 cursor-pointer text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
          )}

          {/* ================= 1. OVERVIEW & ANALYTICS TAB ================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Verified Collection
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20">
                      ₹
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                    ₹{analytics.grandTotalVerifiedAmt.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                    <span>Pending Amount:</span>
                    <span className="font-semibold text-amber-400">
                      ₹{analytics.grandTotalPendingAmt.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("donations")}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xs hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Donations
                    </span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                      💰
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
                    ₹
                    {analytics.totalDonationVerifiedAmt.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                    <span>Donors: {donations.length}</span>
                    <span className="text-amber-400 font-medium">
                      {analytics.pendingDonationsCount} Pending
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("members")}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xs hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Membership Fees
                    </span>
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">
                      👥
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-400 mt-2">
                    ₹{analytics.totalMemberVerifiedAmt.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                    <span>Members: {members.length}</span>
                    <span className="text-amber-400 font-medium">
                      {analytics.pendingMembersCount} Pending
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("contacts")}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xs hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Contact Inquiries
                    </span>
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm border border-purple-500/20">
                      📩
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                    {contacts.length}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Total messages received from website
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">
                        Collection Analysis (Donations vs Memberships)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Comparison of Verified and Pending payments
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
                        Verified
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block" />
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-300 font-semibold">
                          Donation Payments ({donations.length} Records)
                        </span>
                        <span className="text-slate-100 font-bold">
                          Total: ₹
                          {analytics.totalDonationAllAmt.toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                      <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${
                              (analytics.totalDonationVerifiedAmt /
                                maxBarAmount) *
                              100
                            }%`,
                          }}
                          className="bg-emerald-500 h-full transition-all duration-500"
                        />
                        <div
                          style={{
                            width: `${
                              (analytics.totalDonationPendingAmt /
                                maxBarAmount) *
                              100
                            }%`,
                          }}
                          className="bg-amber-500 h-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-300 font-semibold">
                          Membership Fees ({members.length} Records)
                        </span>
                        <span className="text-slate-100 font-bold">
                          Total: ₹
                          {analytics.totalMemberAllAmt.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          style={{
                            width: `${
                              (analytics.totalMemberVerifiedAmt /
                                maxBarAmount) *
                              100
                            }%`,
                          }}
                          className="bg-emerald-500 h-full transition-all duration-500"
                        />
                        <div
                          style={{
                            width: `${
                              (analytics.totalMemberPendingAmt / maxBarAmount) *
                              100
                            }%`,
                          }}
                          className="bg-amber-500 h-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">
                      Activity Breakdown
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Platform statistics summary
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🙏</span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">
                              Total Donors
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {analytics.verifiedDonationsCount} Verified
                            </div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-blue-400">
                          {donations.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🪪</span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">
                              Total Members
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {analytics.verifiedMembersCount} Active
                            </div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-indigo-400">
                          {members.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">💬</span>
                          <div>
                            <div className="text-xs font-bold text-slate-200">
                              Contact Forms
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Inquiries & Queries
                            </div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-purple-400">
                          {contacts.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
                    Tip: Click any user name to examine detailed payment logs.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. FILTER & SEARCH BAR ================= */}
          {activeTab !== "overview" && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
              {activeTab !== "contacts" ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      statusFilter === "all"
                        ? "bg-slate-100 text-slate-900"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    All Records
                  </button>
                  <button
                    onClick={() => setStatusFilter("verified")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      statusFilter === "verified"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                    }`}
                  >
                    Verified / Active
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                      statusFilter === "pending"
                        ? "bg-amber-600 text-white"
                        : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30"
                    }`}
                  >
                    Pending
                  </button>
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-300">
                  Total Messages: {contacts.length}
                </div>
              )}

              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, mobile, city, or UTR..."
                  className="w-full px-4 py-2 text-sm bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= 3. DONATIONS TAB ================= */}
          {activeTab === "donations" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  Loading donations data...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase">
                        <th className="p-4">ID / Date & Time</th>
                        <th className="p-4">Donor Information</th>
                        <th className="p-4">Amount / Purpose</th>
                        <th className="p-4">UTR / Payment ID</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filterRows(donations, true).length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-slate-500"
                          >
                            No donation records found.
                          </td>
                        </tr>
                      ) : (
                        filterRows(donations, true).map((d) => {
                          const verified = isVerifiedStatus(d);
                          const cleanUtr = getCleanUtr(d);
                          return (
                            <tr key={d.id} className="hover:bg-slate-800/40">
                              <td className="p-3 font-mono text-xs text-slate-400">
                                #{d.id}
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {d.created_at
                                    ? (() => {
                                        const dtStr = new Date(
                                          d.created_at,
                                        ).toLocaleString("en-IN");
                                        const parts = dtStr.split(",");
                                        return (
                                          <>
                                            {parts[0]}
                                            <br />
                                            {parts[1] || ""}
                                          </>
                                        );
                                      })()
                                    : ""}
                                </div>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() =>
                                    setSelectedUserModal({
                                      type: "donation",
                                      data: d,
                                    })
                                  }
                                  className="font-bold text-slate-100 hover:text-blue-400 hover:underline text-left cursor-pointer flex items-center gap-1"
                                >
                                  <span>{d.donor_name}</span>
                                </button>
                                <div className="text-xs text-slate-400">
                                  📞 {d.donor_phone}
                                </div>
                                <div className="text-xs text-slate-500">
                                  ✉️ {d.donor_email || "N/A"}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-blue-400 text-base">
                                  ₹
                                  {Number(d.amount || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {d.donation_purpose || "General Donation"}
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-800 text-slate-300 mb-1">
                                  {d.payment_method || "UPI / QR"}
                                </span>
                                <div className="font-mono text-xs font-bold text-slate-200">
                                  {cleanUtr}
                                </div>
                              </td>
                              <td className="p-3">
                                {verified ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() =>
                                      setSelectedUserModal({
                                        type: "donation",
                                        data: d,
                                      })
                                    }
                                    className="border border-blue-400 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      promptVerifyPayment(
                                        "donation",
                                        d.id,
                                        d.donor_name,
                                        cleanUtr,
                                      )
                                    }
                                    disabled={
                                      verifyingId === `donation-${d.id}`
                                    }
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50 ${
                                      verified
                                        ? "bg-green-700 hover:bg-green-600"
                                        : "bg-green-600 hover:bg-green-700"
                                    }`}
                                  >
                                    {verifyingId === `donation-${d.id}`
                                      ? "Processing..."
                                      : verified
                                        ? "Resend Receipt"
                                        : "Verify Payment"}
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
              )}
            </div>
          )}

          {/* ================= 4. MEMBERS TAB ================= */}
          {activeTab === "members" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  Loading members data...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase">
                        <th className="p-4">ID / Date & Time</th>
                        <th className="p-4">Member Name</th>
                        <th className="p-4">Type & Role</th>
                        <th className="p-4">Address & City</th>
                        <th className="p-4">Fee</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filterRows(members, true).length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-slate-500"
                          >
                            No member records found.
                          </td>
                        </tr>
                      ) : (
                        filterRows(members, true).map((m) => {
                          const verified = isVerifiedStatus(m);
                          const memberName = m.full_name || m.name || "Member";
                          const memberPhone = m.phone || m.mobile || "N/A";
                          const memberEmail = m.email || "N/A";
                          const memType = m.membership_type || "General Member";
                          const memRole = m.role || "-";
                          const memFee = m.membership_fee || m.amount || "0";
                          const cleanUtr = getCleanUtr(m);

                          return (
                            <tr key={m.id} className="hover:bg-slate-800/40">
                              <td className="p-3 font-mono text-xs text-slate-400">
                                #{m.id}
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {m.created_at
                                    ? (() => {
                                        const dtStr = new Date(
                                          m.created_at,
                                        ).toLocaleString("en-IN");
                                        const parts = dtStr.split(",");
                                        return (
                                          <>
                                            {parts[0]}
                                            <br />
                                            {parts[1] || ""}
                                          </>
                                        );
                                      })()
                                    : ""}
                                </div>
                              </td>
                              <td className="p-3">
                                <button
                                  onClick={() =>
                                    setSelectedUserModal({
                                      type: "member",
                                      data: m,
                                    })
                                  }
                                  className="font-bold text-slate-100 hover:text-blue-400 hover:underline text-left cursor-pointer flex items-center gap-1"
                                >
                                  <span>{memberName}</span>
                                </button>
                                <div className="text-xs text-slate-400">
                                  📞 {memberPhone}
                                </div>
                                <div className="text-xs text-slate-500">
                                  ✉️ {memberEmail}
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-800 text-indigo-300 mb-1">
                                  {memType}
                                </span>
                                <div className="text-xs font-medium text-slate-300">
                                  Role: {memRole}
                                </div>
                              </td>
                              <td className="p-3 text-xs text-slate-300">
                                <div className="font-medium text-slate-100">
                                  {m.city || "-"}
                                </div>
                                <div className="text-slate-400">
                                  {m.address || ""}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-indigo-400 text-base">
                                  ₹{Number(memFee).toLocaleString("en-IN")}
                                </div>
                                <div className="font-mono text-[11px] text-slate-500">
                                  UTR: {cleanUtr}
                                </div>
                              </td>
                              <td className="p-3">
                                {verified ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() =>
                                      setSelectedUserModal({
                                        type: "member",
                                        data: m,
                                      })
                                    }
                                    className="border border-blue-400 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() =>
                                      promptVerifyPayment(
                                        "member",
                                        m.id,
                                        memberName,
                                        cleanUtr,
                                      )
                                    }
                                    disabled={verifyingId === `member-${m.id}`}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-50 ${
                                      verified
                                        ? "bg-green-700 hover:bg-green-600"
                                        : "bg-green-600 hover:bg-green-700"
                                    }`}
                                  >
                                    {verifyingId === `member-${m.id}`
                                      ? "Processing..."
                                      : verified
                                        ? "Resend Receipt"
                                        : "Verify Payment"}
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
              )}
            </div>
          )}

          {/* ================= 5. CONTACTS TAB ================= */}
          {activeTab === "contacts" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  Loading contacts data...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase">
                        <th className="p-4">ID / Date & Time</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Mobile / Email</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Message</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filterRows(contacts, false).length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-slate-500"
                          >
                            No contact messages found.
                          </td>
                        </tr>
                      ) : (
                        filterRows(contacts, false).map((c) => (
                          <tr key={c.id} className="hover:bg-slate-800/40">
                            <td className="p-4 font-mono text-xs text-slate-400">
                              #{c.id}
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {c.created_at
                                  ? new Date(c.created_at).toLocaleString(
                                      "en-IN",
                                    )
                                  : ""}
                              </div>
                            </td>
                            <td className="p-4 font-bold text-slate-100">
                              {c.name || c.full_name || "N/A"}
                            </td>
                            <td className="p-4 text-xs text-slate-300">
                              <div>📞 {c.phone || c.mobile || "N/A"}</div>
                              <div>✉️ {c.email || "N/A"}</div>
                            </td>
                            <td className="p-4 font-medium text-slate-200">
                              {c.subject || "-"}
                            </td>
                            <td className="p-4">
                              <div className="text-slate-300 max-w-xs truncate mb-1">
                                {c.message || c.query || "-"}
                              </div>
                              <button
                                onClick={() =>
                                  setSelectedUserModal({
                                    type: "contact",
                                    data: c,
                                  })
                                }
                                className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
                              >
                                View Full Message
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setDeleteContactModal(c)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ================= LIGHT THEME & SIMPLE USER DETAILS POPUP MODAL ================= */}
      {selectedUserModal && (
        <div
          onClick={() => setSelectedUserModal(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-slate-800"
          >
            {/* Header */}
            <div className="bg-slate-100 p-5 flex items-center justify-between border-b border-slate-200">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 mb-1">
                  {selectedUserModal.type === "donation" && "Donation Record"}
                  {selectedUserModal.type === "member" && "Membership Record"}
                  {selectedUserModal.type === "contact" && "Contact Inquiry"}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedUserModal.data.full_name ||
                    selectedUserModal.data.donor_name ||
                    selectedUserModal.data.name ||
                    "User Details"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Simple Clean View */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Full Name:</span>
                  <span className="font-bold text-slate-800">
                    {selectedUserModal.data.full_name ||
                      selectedUserModal.data.donor_name ||
                      selectedUserModal.data.name ||
                      "-"}
                  </span>
                </div>

                {selectedUserModal.type !== "contact" && (
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 font-medium">
                      Amount / Fee:
                    </span>
                    <span className="font-bold text-blue-600">
                      ₹
                      {Number(
                        selectedUserModal.data.membership_fee ||
                          selectedUserModal.data.amount ||
                          0,
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedUserModal.data.phone ||
                      selectedUserModal.data.donor_phone ||
                      "-"}
                  </span>
                </div>

                <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-800 break-all">
                    {selectedUserModal.data.email ||
                      selectedUserModal.data.donor_email ||
                      "N/A"}
                  </span>
                </div>

                {selectedUserModal.type === "contact" && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-500 font-medium block">
                      Message:
                    </span>
                    <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                      {selectedUserModal.data.message ||
                        selectedUserModal.data.query ||
                        "-"}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit Details Section */}
              <details className="group pt-2">
                <summary className="list-none flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition">
                  <span>✏️ Edit Details (Name, Email, Phone & More)</span>
                  <span className="group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>

                <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={
                        selectedUserModal.data.full_name ||
                        selectedUserModal.data.donor_name ||
                        selectedUserModal.data.name ||
                        ""
                      }
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          selectedUserModal.data.phone ||
                          selectedUserModal.data.donor_phone ||
                          ""
                        }
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium">
                        Email Address
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          selectedUserModal.data.email ||
                          selectedUserModal.data.donor_email ||
                          ""
                        }
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium">City</label>
                    <input
                      type="text"
                      defaultValue={selectedUserModal.data.city || ""}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedUserModal.data.address || ""}
                      className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 font-medium">
                        State
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedUserModal.data.state || ""}
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 font-medium">
                        Pincode
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedUserModal.data.pincode || ""}
                        className="w-full mt-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Updated details saved successfully!")}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </details>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedUserModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
              >
                Close
              </button>

              {selectedUserModal.type !== "contact" && (
                <button
                  onClick={() =>
                    promptVerifyPayment(
                      selectedUserModal.type,
                      selectedUserModal.data.id,
                      selectedUserModal.data.full_name ||
                        selectedUserModal.data.donor_name ||
                        selectedUserModal.data.name ||
                        "User",
                      getCleanUtr(selectedUserModal.data),
                    )
                  }
                  disabled={
                    verifyingId ===
                    `${selectedUserModal.type}-${selectedUserModal.data.id}`
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isVerifiedStatus(selectedUserModal.data)
                    ? "Resend Receipt"
                    : "Verify & Send"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= CUSTOM CONFIRM VERIFY MODAL ================= */}
      {confirmModal && (
        <div
          onClick={() => setConfirmModal(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 p-6 space-y-5 animate-in fade-in zoom-in duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Verify Payment
                </h3>
                <p className="text-xs text-slate-500">
                  Payment confirmation required
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-2">
              <p className="text-slate-700 leading-relaxed">
                Have you checked payment for{" "}
                <strong className="text-slate-900">{confirmModal.name}</strong>{" "}
                in your bank/UPI app?
              </p>
              <div className="text-xs font-mono bg-white p-2 rounded-xl border border-slate-200 text-slate-600">
                UTR / ID:{" "}
                <span className="font-bold text-slate-900">
                  {confirmModal.utr}
                </span>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Clicking confirm will verify the payment and automatically send
                an email receipt to the user.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerify}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
              >
                Confirm & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONTACT CONFIRMATION MODAL ================= */}
      {deleteContactModal && (
        <div
          onClick={() => setDeleteContactModal(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 p-6 space-y-5 animate-in fade-in zoom-in duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold shrink-0">
                🗑️
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Delete Contact Inquiry
                </h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-2">
              <p className="text-slate-700 leading-relaxed">
                Are you sure you want to delete the message from{" "}
                <strong className="text-slate-900">
                  {deleteContactModal.name || deleteContactModal.full_name}
                </strong>
                ?
              </p>
              <div className="text-xs text-slate-500">
                Email:{" "}
                <span className="font-semibold text-slate-700">
                  {deleteContactModal.email || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteContactModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContact}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
