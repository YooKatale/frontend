"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DB_URL } from "@config/config";

const VENDOR_KEY = "yookatale-vendor";
const PAYMENT_METHODS = [
  { value: "mobilemoneyuganda", label: "Mobile Money" },
  { value: "card", label: "Bank card" },
];

const formatPrice = (value, currency = "UGX") => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString()}` : "Contact us";
};

const responseData = (payload) => payload?.data ?? payload;

function normalizePlans(payload) {
  const data = responseData(payload);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.plans)) return data.plans;
  if (Array.isArray(payload?.plans)) return payload.plans;
  return [];
}

function isVerifiedVendor(vendor) {
  return vendor?.isVerified === true || vendor?.verified === true || String(vendor?.status || "").toLowerCase() === "verified";
}

function getActivePlan(payload) {
  const data = responseData(payload);
  if (!data || data.active === false || data.isActive === false || data.hasActivePlan === false) return null;
  const plan = data.activePlan || data.partnerPlan || data.currentPlan || data.plan;
  if (plan) {
    return {
      ...plan,
      expiresAt: plan.expiresAt || data.expiresAt || data.expiryDate || data.expiresOn || data.planExpiresAt,
    };
  }
  return (
    data.hasActivePlan === true || data.isActive === true || data.planName || data.planId || data.name
      ? data
      : null
  );
}

function formatDuration(value) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";
  const count = value.value ?? value.count ?? value.duration;
  const unit = value.unit ?? value.period ?? value.type;
  return [count, unit].filter(Boolean).join(" ");
}

export default function VendorPartnerPlansPage() {
  const [auth, setAuth] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [checkoutPlanId, setCheckoutPlanId] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handledTransactions = useRef(new Set());

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(VENDOR_KEY) || "null");
      setAuth(stored);
    } catch {
      setAuth(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const headers = auth?.token ? { Authorization: `Bearer ${auth.token}` } : {};
    const loadPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await fetch(`${DB_URL}/partner/plans`, { headers, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || "Could not load partner plans.");
        setPlans(normalizePlans(payload));
      } catch (requestError) {
        setError(requestError.message || "Could not load partner plans.");
      } finally {
        setLoadingPlans(false);
      }
    };

    const loadActivePlan = async () => {
      if (!auth?.token) {
        setLoadingActive(false);
        return;
      }
      setLoadingActive(true);
      try {
        const response = await fetch(`${DB_URL}/vendor/partner-plan`, { headers, cache: "no-store" });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || "Could not load your active plan.");
        setActivePlan(getActivePlan(payload));
      } catch (requestError) {
        setError((current) => current || requestError.message || "Could not load your active plan.");
      } finally {
        setLoadingActive(false);
      }
    };

    loadPlans();
    loadActivePlan();

    const query = new URLSearchParams(window.location.search);
    const txRef = query.get("tx_ref");
    const transactionId = query.get("transaction_id");
    if (auth?.token && txRef && !handledTransactions.current.has(txRef)) {
      handledTransactions.current.add(txRef);
      setVerifying(true);
      setError("");
      setMessage("Verifying payment with Flutterwave…");

      (async () => {
        try {
          const response = await fetch(`${DB_URL}/vendor/partner-plan/verify`, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ tx_ref: txRef, ...(transactionId ? { transaction_id: transactionId } : {}) }),
          });
          const payload = await response.json();
          const verification = responseData(payload);
          if (!response.ok || !(payload?.status === "Success" || payload?.status === "success" || payload?.success === true) || verification?.verified === false || verification?.isVerified === false) {
            throw new Error(payload?.message || "Payment could not be verified. Your plan has not been activated.");
          }

          const activeResponse = await fetch(`${DB_URL}/vendor/partner-plan`, { headers, cache: "no-store" });
          const activePayload = await activeResponse.json();
          if (!activeResponse.ok) throw new Error(activePayload?.message || "Payment was verified, but the active plan could not be refreshed.");
          setActivePlan(getActivePlan(activePayload));
          setMessage("Payment verification complete. Your plan status is shown below.");
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("tx_ref");
          cleanUrl.searchParams.delete("transaction_id");
          window.history.replaceState({}, "", cleanUrl.toString());
        } catch (requestError) {
          setMessage("");
          setError(requestError.message || "Payment verification failed. Your plan has not been activated.");
        } finally {
          setVerifying(false);
        }
      })();
    }
  }, [auth, authReady]);

  const startCheckout = async (plan) => {
    if (!auth?.token || !isVerifiedVendor(auth.vendor)) {
      setError("Only verified vendors can purchase a partner plan.");
      return;
    }

    const planId = plan?._id || plan?.id || plan?.planId;
    if (!planId) {
      setError("This plan is missing its plan ID. Please contact support.");
      return;
    }

    setCheckoutPlanId(planId);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${DB_URL}/vendor/partner-plan/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ planId, paymentMethod }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Could not start checkout.");
      const paymentLink = payload?.data?.paymentLink || payload?.paymentLink;
      if (!paymentLink) throw new Error("Checkout succeeded, but no payment link was returned.");
      const checkoutUrl = new URL(paymentLink);
      if (checkoutUrl.protocol !== "https:" || !(checkoutUrl.hostname === "flutterwave.com" || checkoutUrl.hostname.endsWith(".flutterwave.com"))) {
        throw new Error("The checkout response did not contain a secure Flutterwave payment link.");
      }
      window.location.assign(checkoutUrl.toString());
    } catch (requestError) {
      setError(requestError.message || "Could not start checkout.");
      setCheckoutPlanId(null);
    }
  };

  if (!authReady) return <div style={{ padding: 32, color: "#64748b" }}>Loading partner plans…</div>;

  const verified = isVerifiedVendor(auth?.vendor);
  const activeName = activePlan?.name || activePlan?.planName || activePlan?.plan?.name || activePlan?.title;
  const expiry = activePlan?.expiresAt || activePlan?.expiryDate || activePlan?.expiresOn || activePlan?.planExpiresAt || activePlan?.plan?.expiresAt;

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", color: "#17221a" }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ color: "#185f2d", fontSize: 11, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Partner plans</div>
        <h1 style={{ margin: "7px 0", fontSize: 28, fontWeight: 800 }}>Grow your business with YooKatale</h1>
        <p style={{ margin: 0, color: "#647067", lineHeight: 1.6 }}>Choose a plan for your verified vendor account. Your plan activates only after payment verification.</p>
      </header>

      {activePlan && (
        <section aria-live="polite" style={{ background: "#edf7ef", border: "1px solid #b9ddc0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#246b35", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 800 }}>Active partner plan</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{activeName || "Partner plan active"}</div>
          {expiry && <div style={{ color: "#536653", fontSize: 13, marginTop: 4 }}>Expires {new Date(expiry).toLocaleDateString()}</div>}
        </section>
      )}

      {loadingActive && auth?.token && <p style={{ color: "#647067", fontSize: 13 }}>Checking active plan…</p>}
      {!auth?.token && <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 14, marginBottom: 18 }}>Sign in through the <Link href="/vendor/login" style={{ color: "#185f2d", fontWeight: 700 }}>vendor portal</Link> to purchase a partner plan.</div>}
      {auth?.token && !verified && <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: 14, marginBottom: 18 }}>Your vendor account must be verified before you can choose a plan. Current status: {auth?.vendor?.status || "Unverified"}.</div>}
      {verifying && <p role="status" style={{ color: "#185f2d", fontWeight: 700 }}>{message}</p>}
      {!verifying && message && <p role="status" style={{ color: "#246b35", fontWeight: 700 }}>{message}</p>}
      {error && <div role="alert" style={{ background: "#fef2f2", color: "#b42318", border: "1px solid #fecaca", borderRadius: 10, padding: 12, margin: "14px 0" }}>{error}</div>}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", margin: "22px 0 14px" }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Available plans</h2>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#536653", fontSize: 13, fontWeight: 700 }}>
          Payment method
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} style={{ border: "1px solid #cbd5ce", borderRadius: 8, background: "#fff", padding: "8px 10px", color: "#17221a" }}>
            {PAYMENT_METHODS.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
          </select>
        </label>
      </div>

      {loadingPlans ? (
        <p style={{ color: "#647067" }}>Loading available plans…</p>
      ) : plans.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e2e8e3", borderRadius: 12, padding: 20, color: "#647067" }}>No partner plans are available right now.</div>
      ) : (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 14 }}>
          {plans.map((plan) => {
            const id = plan?._id || plan?.id || plan?.planId;
            const rawBenefits = plan?.benefits || plan?.features || [];
            const benefits = Array.isArray(rawBenefits) ? rawBenefits : (rawBenefits ? [rawBenefits] : []);
            const duration = formatDuration(plan?.duration || plan?.durationLabel || plan?.period);
            const price = plan?.price ?? plan?.amount ?? plan?.cost;
            return (
              <article key={id || plan.name} style={{ background: "#fff", border: "1px solid #dce5dd", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", minHeight: 260, boxShadow: "0 2px 8px rgba(20,50,25,.04)" }}>
                <h3 style={{ fontSize: 18, margin: "0 0 6px" }}>{plan?.name || plan?.title || "Partner plan"}</h3>
                {duration && <div style={{ color: "#647067", fontSize: 12, marginBottom: 10 }}>{duration}</div>}
                <div style={{ color: "#185f2d", fontSize: 23, fontWeight: 900, marginBottom: 12 }}>{formatPrice(price, plan?.currency || "UGX")}</div>
                {plan?.description && <p style={{ color: "#647067", fontSize: 13, lineHeight: 1.5, margin: "0 0 12px" }}>{plan.description}</p>}
                {Array.isArray(benefits) && benefits.length > 0 && (
                  <ul style={{ color: "#445444", fontSize: 12, lineHeight: 1.8, paddingLeft: 18, margin: "0 0 16px" }}>
                    {benefits.map((benefit, index) => <li key={`${id}-benefit-${index}`}>{typeof benefit === "string" ? benefit : benefit?.name || benefit?.label || "Included benefit"}</li>)}
                  </ul>
                )}
                <button
                  type="button"
                  disabled={!verified || !auth?.token || checkoutPlanId === id}
                  onClick={() => startCheckout(plan)}
                  style={{ width: "100%", marginTop: "auto", border: 0, borderRadius: 8, padding: "11px 14px", background: !verified ? "#9ca3af" : "#185f2d", color: "#fff", fontWeight: 800, cursor: !verified ? "not-allowed" : "pointer", opacity: checkoutPlanId === id ? .7 : 1 }}
                >
                  {checkoutPlanId === id ? "Opening secure checkout…" : verified ? "Choose plan" : "Verification required"}
                </button>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
