"use client";

/**
 * Cashout & Rewards — UI: lucide + floating labels, animations.
 * Backend: stats, payout methods, withdraw, withdrawals (unchanged).
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast, useDisclosure } from "@chakra-ui/react";
import { useAuth } from "@slices/authSlice";
import ReferralModal from "@components/ReferralModal";
import PaymentProviderLogo from "@components/PaymentProviderLogo";
import {
  useGetCashoutStatsMutation,
  useGetPayoutMethodsMutation,
  useAddPayoutMethodMutation,
  useDeletePayoutMethodMutation,
  useSetDefaultPayoutMethodMutation,
  useWithdrawFundsMutation,
  useGetWithdrawalsMutation,
} from "@slices/usersApiSlice";
import {
  StatCard,
  SCard,
  SHead,
  PBtn,
  GBtn,
  FInput,
  FSelect,
  TxBadge,
  WithdrawModal,
  CashoutGlobalStyles,
  Wallet,
  ArrowDownToLine,
  Users,
  BadgePercent,
  Gift,
  CreditCard,
  Share2,
  Gamepad2,
  Sparkles,
  Zap,
  Landmark,
  Shield,
  Smartphone,
  Info,
  CheckCircle2,
  Plus,
  Lock,
  Trash2,
  ArrowRight,
  CalendarClock,
  Eye,
  EyeOff,
  TrendingUp,
  Copy,
  Check,
  CircleDollarSign,
} from "./CashoutUI";

async function generateReferralCode(userId) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder().encode(userId);
    const hash = await crypto.subtle.digest("SHA-256", enc);
    const hex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex.substring(0, 8);
  }
  let h = 0;
  const s = String(userId);
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).slice(0, 8);
}

export default function CashoutPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isReferralOpen, onOpen: openReferral, onClose: closeReferral } = useDisclosure();

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState(null);
  const [copied, setCopied] = useState(false);
  const [balVis, setBalVis] = useState(true);
  const [referralUrl, setReferralUrl] = useState("");
  const [payTab, setPayTab] = useState("momo");
  const [provider, setProvider] = useState("");
  const [phone, setPhone] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [stats, setStats] = useState({ cash: 0, invites: 0, loyalty: 0 });
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

  const [getCashoutStats] = useGetCashoutStatsMutation();
  const [getPayoutMethods] = useGetPayoutMethodsMutation();
  const [addPayoutMethod, { isLoading: adding }] = useAddPayoutMethodMutation();
  const [deletePayoutMethod, { isLoading: deleting }] = useDeletePayoutMethodMutation();
  const [setDefaultPayoutMethod, { isLoading: settingDefault }] = useSetDefaultPayoutMethodMutation();
  const [withdrawFunds, { isLoading: withdrawing }] = useWithdrawFundsMutation();
  const [getWithdrawals] = useGetWithdrawalsMutation();

  useEffect(() => {
    if (!userInfo?._id) return;
    generateReferralCode(userInfo._id).then((code) => setReferralUrl(`https://yookatale.app/signup?ref=${code}`));
  }, [userInfo?._id]);

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await getCashoutStats().unwrap();
      if (res?.status === "Success" && res?.data) setStats(res.data);
    } catch (e) {
      setStats({ cash: 0, invites: 0, loyalty: 0 });
    } finally {
      setLoadingStats(false);
    }
  }, [getCashoutStats]);

  const loadMethods = useCallback(async () => {
    try {
      setLoadingMethods(true);
      const res = await getPayoutMethods().unwrap();
      setPayoutMethods(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setPayoutMethods([]);
    } finally {
      setLoadingMethods(false);
    }
  }, [getPayoutMethods]);

  const loadWithdrawals = useCallback(async () => {
    try {
      setLoadingWithdrawals(true);
      const res = await getWithdrawals().unwrap();
      setWithdrawals(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setWithdrawals([]);
    } finally {
      setLoadingWithdrawals(false);
    }
  }, [getWithdrawals]);

  useEffect(() => {
    setIsCheckingAuth(true);
    // Check if userInfo is available
    if (!userInfo || typeof userInfo !== "object" || Object.keys(userInfo).length === 0) {
      setIsCheckingAuth(false);
      router.push("/signin");
      return;
    }
    setIsCheckingAuth(false);
    // Load data - errors are handled in individual load functions
    loadStats().catch(console.error);
    loadMethods().catch(console.error);
    loadWithdrawals().catch(console.error);
  }, [userInfo, router, loadStats, loadMethods, loadWithdrawals]);

  const handleSaveMobileMoney = async () => {
    const prov = (provider || "").toUpperCase();
    const ph = (phone || "").trim().replace(/^0/, "").replace(/^256/, "");
    if (!prov || !["MTN", "AIRTEL"].includes(prov)) {
      toast({ title: "Select MTN or Airtel", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    if (!ph || ph.length < 9) {
      toast({ title: "Enter a valid phone (e.g. 0712345678 or 256712345678)", status: "warning", duration: 4000, isClosable: true });
      return;
    }
    try {
      await addPayoutMethod({ type: "mobile_money", provider: prov, phone: ph.length === 9 ? `256${ph}` : ph }).unwrap();
      toast({ title: "Saved", description: "Mobile money added for payouts.", status: "success", duration: 4000, isClosable: true });
      setProvider("");
      setPhone("");
      loadMethods();
    } catch (e) {
      const errMsg = e?.data?.message || e?.message || "Failed to save.";
      toast({ title: "Error", description: errMsg, status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleCopy = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2400); });
    } else {
      openReferral();
    }
  };

  const handleSaveCard = async () => {
    const last4 = (cardLast4 || "").replace(/\D/g, "").slice(-4);
    if (last4.length !== 4) {
      toast({ title: "Enter the last 4 digits of your card", status: "warning", duration: 3000, isClosable: true });
      return;
    }
    let expiryMonth = "";
    let expiryYear = "";
    const parts = (cardExpiry || "").split("/");
    if (parts.length >= 2) {
      expiryMonth = parts[0].trim().padStart(2, "0").slice(0, 2);
      expiryYear = parts[1].trim().slice(-2);
    }
    try {
      await addPayoutMethod({
        type: "card",
        last4,
        brand: cardBrand || undefined,
        nameOnCard: cardName || undefined,
        expiryMonth: expiryMonth || undefined,
        expiryYear: expiryYear || undefined,
      }).unwrap();
      toast({ title: "Saved", description: "Card details saved for payouts.", status: "success", duration: 4000, isClosable: true });
      setCardLast4("");
      setCardBrand("");
      setCardName("");
      setCardExpiry("");
      loadMethods();
    } catch (e) {
      const errMsg = e?.data?.message || e?.message || "Failed to save card.";
      toast({ title: "Error", description: errMsg, status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePayoutMethod(id).unwrap();
      toast({ title: "Removed", description: "Payout method removed.", status: "success", duration: 3000, isClosable: true });
      loadMethods();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || "Could not remove.", status: "error", duration: 4000, isClosable: true });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultPayoutMethod(id).unwrap();
      toast({ title: "Updated", description: "Default payout method set.", status: "success", duration: 3000, isClosable: true });
      loadMethods();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || "Could not update.", status: "error", duration: 4000, isClosable: true });
    }
  };

  const handleWithdraw = () => {
    const defaultMethod = payoutMethods.find((m) => m.isDefault && m.type === "mobile_money");
    const firstMobile = payoutMethods.find((m) => m.type === "mobile_money");
    if (defaultMethod) {
      setSelectedPayoutMethod(defaultMethod);
      setShowWithdraw(true);
    } else if (firstMobile) {
      setSelectedPayoutMethod(firstMobile);
      setShowWithdraw(true);
    } else {
      toast({ title: "No Mobile Money", description: "Add a mobile money payout method first.", status: "warning", duration: 4000, isClosable: true });
    }
  };

  const confirmWithdraw = async (amountFromModal) => {
    const amt = Number(amountFromModal);
    if (!selectedPayoutMethod) {
      toast({ title: "Error", description: "Select a payout method.", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (!Number.isFinite(amt) || amt < 1000) {
      toast({ title: "Invalid Amount", description: "Minimum withdrawal is UGX 1,000.", status: "error", duration: 4000, isClosable: true });
      return;
    }
    if (amt > (stats.cash || 0)) {
      toast({ title: "Insufficient Balance", description: `Available: UGX ${(stats.cash || 0).toLocaleString()}`, status: "error", duration: 4000, isClosable: true });
      return;
    }
    try {
      const res = await withdrawFunds({ amount: amt, payoutMethodId: selectedPayoutMethod._id }).unwrap();
      toast({ title: "Withdrawal Initiated", description: res?.message || `UGX ${amt.toLocaleString()} withdrawal processing...`, status: "success", duration: 5000, isClosable: true });
      setShowWithdraw(false);
      setSelectedPayoutMethod(null);
      loadStats();
      loadWithdrawals();
    } catch (e) {
      toast({ title: "Error", description: e?.data?.message || e?.message || "Withdrawal failed.", status: "error", duration: 5000, isClosable: true });
    }
  };

  const defaultMethod = payoutMethods.find((m) => m.isDefault && m.type === "mobile_money") || payoutMethods.find((m) => m.type === "mobile_money");
  const defaultMethodDisplay = defaultMethod
    ? defaultMethod.type === "mobile_money"
      ? `Sending to default ${defaultMethod.provider} •••${String(defaultMethod.phone || "").slice(-4)}`
      : `Sending to default Card •••• ${defaultMethod.last4}`
    : null;


  const fmt = (n) => "UGX " + Number(n).toLocaleString();

  if (isCheckingAuth || !userInfo?._id) {
    return (
      <div style={{ minHeight: "100vh", background: "#f2f6f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 200, height: 40, background: "#e0e8e0", borderRadius: 12 }} />
      </div>
    );
  }

  return (
    <>
      <CashoutGlobalStyles />
      <ReferralModal isOpen={isReferralOpen} onClose={closeReferral} />
      {showWithdraw && (
        <WithdrawModal
          onClose={() => { setShowWithdraw(false); setSelectedPayoutMethod(null); }}
          balance={stats.cash || 0}
          defaultMethodDisplay={defaultMethodDisplay}
          onConfirm={confirmWithdraw}
          loading={withdrawing}
        />
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Hero */}
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <div style={{ background: "linear-gradient(135deg,#0a1f0a 0%,#1a5c1a 50%,#2d8c2d 100%)", borderRadius: "0 0 28px 28px", padding: "30px 26px 34px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wallet size={20} strokeWidth={1.8} color="#fff" />
                  </div>
                  <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: "#fff", fontStyle: "italic" }}>Cashout &amp; Rewards</h1>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>Manage earnings, invites, loyalty points &amp; payouts</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingUp size={14} strokeWidth={2} color="rgba(255,255,255,.8)" />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.8)", fontWeight: 700 }}>Earning active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14, marginBottom: 18 }}>
          <StatCard
            label="Cash Earned"
            delay={0}
            Icon={CircleDollarSign}
            value={
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {loadingStats ? "—" : balVis ? fmt(stats.cash || 0) : "UGX •••••"}
                <button type="button" onClick={() => setBalVis((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1a5c1a", padding: 0, marginTop: 2 }}>
                  {balVis ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </span>
            }
            sub="Available to withdraw"
            accent="#1a5c1a"
            gradient="linear-gradient(135deg,#1a5c1a,#2d8c2d)"
            cta={<PBtn Icon={ArrowDownToLine} small onClick={handleWithdraw}>Withdraw</PBtn>}
          />
          <StatCard label="Total Invites" delay={80} Icon={Users} value={loadingStats ? "—" : String(stats.invites || 0)} sub="Friends referred" accent="#0284c7" gradient="linear-gradient(135deg,#075985,#0284c7)" />
          <StatCard label="Loyalty Points" delay={160} Icon={BadgePercent} value={loadingStats ? "—" : String(stats.loyalty || 0)} sub="Points to redeem" accent="#c2620a" gradient="linear-gradient(135deg,#9a3412,#ea580c)" />
        </div>

        {/* Rewards + Gift cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14, marginBottom: 14 }}>
          <SCard delay={220}>
            <SHead Icon={Gift} title="Rewards" />
            <div style={{ padding: "18px 22px 22px" }}>
              <p style={{ fontSize: 13, color: "#5a7a5a", fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>Redeem loyalty points for discounts, free delivery, or exclusive offers.</p>
              <Link href="/rewards" style={{ display: "block" }}><PBtn Icon={Sparkles} full>View Rewards</PBtn></Link>
            </div>
          </SCard>
          <SCard delay={280}>
            <SHead Icon={CreditCard} title="Gift Cards" />
            <div style={{ padding: "18px 22px 22px" }}>
              <p style={{ fontSize: 13, color: "#5a7a5a", fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>Use or purchase gift cards for yourself or to send to friends.</p>
              <Link href="/gift-cards" style={{ display: "block" }}><GBtn Icon={CreditCard} onClick={() => {}}>My Gift Cards</GBtn></Link>
            </div>
          </SCard>
        </div>

        {/* Invite + Games */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14, marginBottom: 14 }}>
          <SCard delay={340}>
            <SHead Icon={Share2} title="Invite a Friend" />
            <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: 13, color: "#5a7a5a", fontWeight: 600, lineHeight: 1.7 }}>Earn up to <strong style={{ color: "#1a5c1a" }}>UGX 50,000</strong> for every friend who signs up with your link.</p>
              <div style={{ background: "#f0f7f0", borderRadius: 13, padding: "11px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1.5px solid #c6e4c6" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#2d6a2d", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{referralUrl || "Get your link below"}</span>
                <button type="button" onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: copied ? "#1a5c1a" : "#fff", color: copied ? "#fff" : "#1a5c1a", border: "1.5px solid #1a5c1a", borderRadius: 8, padding: "5px 11px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? <><Check size={11} strokeWidth={2.5} />Copied!</> : <><Copy size={11} strokeWidth={2.2} />Copy</>}
                </button>
              </div>
              <PBtn Icon={Share2} full onClick={openReferral}>Get Referral Link</PBtn>
            </div>
          </SCard>
          <SCard delay={400}>
            <SHead Icon={Gamepad2} title="Games" badge="Coming Soon" />
            <div style={{ padding: "18px 22px 22px" }}>
              <div style={{ background: "linear-gradient(135deg,#f8f4ff,#ede9ff)", borderRadius: 16, padding: "28px 20px", textAlign: "center", border: "1.5px dashed #c4b5fd", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#6d28d9,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(109,40,217,.3)" }}><Gamepad2 size={26} strokeWidth={1.8} color="#fff" /></div>
                <p style={{ fontSize: 13, color: "#5b21b6", fontWeight: 800 }}>Play to earn rewards</p>
                <p style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600, marginTop: 3 }}>Launching soon — stay tuned!</p>
                <span style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 9, fontWeight: 900, padding: "4px 10px", borderRadius: 100, letterSpacing: 0.8, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}><Zap size={9} strokeWidth={2.5} fill="#6d28d9" /> Coming Soon</span>
              </div>
            </div>
          </SCard>
        </div>

        {/* Payout methods */}
        <SCard delay={460} style={{ marginBottom: 14 }}>
          <SHead Icon={Landmark} title="Where to receive payouts" />
          <div style={{ padding: "18px 22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#f0f7f0", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 9, border: "1px solid #c6e4c6" }}>
              <Shield size={15} strokeWidth={2} color="#1a5c1a" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#2d6a2d", fontWeight: 700 }}>MTN &amp; Airtel supported • Card accepted for records</p>
            </div>
            {loadingMethods ? <div style={{ height: 80, background: "#f0f5f0", borderRadius: 12 }} /> : payoutMethods.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: "#94a394", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Saved payout methods</p>
                {payoutMethods.map((m) => (
                  <div key={m._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 15, border: "1.5px solid #1a5c1a", background: "#f8fcf8", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: "#ffcc00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#1a1a1a", flexShrink: 0 }}>
                        {m.type === "mobile_money" && ["MTN", "AIRTEL"].includes(m.provider) ? <PaymentProviderLogo provider={m.provider} size={28} /> : "MTN"}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "#0e1e0e" }}>{m.type === "mobile_money" ? `${m.provider}  •••${String(m.phone || "").slice(-4)}` : `•••• ${m.last4}`}</p>
                        {m.isDefault && <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 100, letterSpacing: 0.8, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 3 }}><CheckCircle2 size={9} strokeWidth={2.5} /> Default</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {!m.isDefault && <button type="button" onClick={() => handleSetDefault(m._id)} disabled={settingDefault} style={{ padding: "6px 10px", fontSize: 11, fontWeight: 700, color: "#1a5c1a", background: "#fff", border: "1.5px solid #1a5c1a", borderRadius: 8, cursor: "pointer" }}>Set default</button>}
                      <button type="button" onClick={() => handleDelete(m._id)} disabled={deleting} style={{ background: "#fef2f2", border: "none", borderRadius: 10, padding: "9px", cursor: "pointer", color: "#dc2626" }}><Trash2 size={16} strokeWidth={2} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 6, padding: "5px", background: "#f0f5f0", borderRadius: 15 }}>
              {[{ id: "momo", Icon: Smartphone, label: "Mobile Money" }, { id: "card", Icon: CreditCard, label: "Card (last 4)" }].map((t) => (
                <button key={t.id} type="button" onClick={() => setPayTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "11px", borderRadius: 11, border: "none", background: payTab === t.id ? "#fff" : "transparent", color: payTab === t.id ? "#1a5c1a" : "#5a7a5a", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: payTab === t.id ? "0 2px 10px rgba(0,0,0,.08)" : "none" }}>
                  <t.Icon size={15} strokeWidth={2} />{t.label}
                </button>
              ))}
            </div>
            {payTab === "momo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeUp .28s ease" }}>
                <FSelect label="Select provider" value={provider} onChange={(e) => setProvider(e.target.value)} opts={[{ v: "MTN", l: "MTN Mobile Money" }, { v: "AIRTEL", l: "Airtel Money" }]} />
                <div style={{ background: "#fffbeb", borderRadius: 11, padding: "10px 13px", display: "flex", alignItems: "flex-start", gap: 8, border: "1px solid #fde68a" }}>
                  <Info size={14} strokeWidth={2} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: "#92400e", fontWeight: 700, lineHeight: 1.5 }}>Uganda: MTN (076,077,078,031,039) or Airtel (070,075,074,020)</p>
                </div>
                <FInput label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" LeftIcon={Smartphone} prefix="+256" />
                <PBtn Icon={CheckCircle2} full onClick={handleSaveMobileMoney} loading={adding}>Save Mobile Money</PBtn>
              </div>
            )}
            {payTab === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .28s ease" }}>
                <div style={{ background: "#f0f7f0", borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: 9, border: "1px solid #c6e4c6" }}>
                  <Lock size={14} strokeWidth={2} color="#1a5c1a" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 12, color: "#1a5c1a", fontWeight: 800, marginBottom: 2 }}>Last 4 digits only</p>
                    <p style={{ fontSize: 11, color: "#2d6a2d", fontWeight: 600, lineHeight: 1.5 }}>For display and admin payouts. Full card is never stored.</p>
                  </div>
                </div>
                <FInput label="Last 4 digits" value={cardLast4} onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} type="tel" LeftIcon={CreditCard} />
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#94a394", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Brand</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[{ id: "Visa", label: "Visa" }, { id: "Mastercard", label: "Mastercard" }].map((b) => (
                      <button key={b.id} type="button" onClick={() => setCardBrand(b.id)} style={{ flex: 1, padding: "14px", borderRadius: 14, border: `2px solid ${cardBrand === b.id ? "#1a5c1a" : "#dde8dd"}`, background: cardBrand === b.id ? "#f0f7f0" : "#fafcfa", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 800, color: cardBrand === b.id ? "#1a5c1a" : "#4a6a4a", boxShadow: cardBrand === b.id ? "0 0 0 3px rgba(26,92,26,.12)" : "none" }}>{b.label}</button>
                    ))}
                  </div>
                </div>
                <FInput label="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} LeftIcon={CreditCard} />
                <FInput label="Expiry (MM/YY)" value={cardExpiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2); setCardExpiry(v); }} type="tel" LeftIcon={CalendarClock} />
                <PBtn Icon={Plus} full gradient="linear-gradient(135deg,#075985,#0284c7)" accent="#0284c7" onClick={handleSaveCard} loading={adding}>Save Card</PBtn>
              </div>
            )}
          </div>
        </SCard>

        {/* Withdrawal history */}
        <SCard delay={540}>
          <SHead Icon={CalendarClock} title="Withdrawal History" action={<button type="button" style={{ background: "none", border: "none", fontSize: 13, fontWeight: 800, color: "#1a5c1a", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }} onClick={() => loadWithdrawals()}>View All <ArrowRight size={13} strokeWidth={2.5} /></button>} />
          <div style={{ padding: "6px 0 10px" }}>
            {loadingWithdrawals ? <div style={{ height: 120, background: "#f0f5f0", borderRadius: 12, margin: "0 22px" }} /> : withdrawals.length > 0 ? withdrawals.slice(0, 5).map((t, i) => (
              <div key={t._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 22px", borderBottom: i < Math.min(5, withdrawals.length) - 1 ? "1px solid #f0f5f0" : "none", animation: `fadeUp .4s ${i * 60}ms ease both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", flexShrink: 0 }}><ArrowDownToLine size={18} strokeWidth={1.9} /></div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 900, color: "#0e1e0e" }}>{fmt(t.amount)}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}><CalendarClock size={11} strokeWidth={2} color="#94a394" /><span style={{ fontSize: 11, color: "#94a394", fontWeight: 600 }}>{new Date(t.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
                <TxBadge status={t.status} />
              </div>
            )) : <p style={{ padding: "20px 22px", fontSize: 13, color: "#94a394", textAlign: "center" }}>No withdrawals yet</p>}
          </div>
        </SCard>
      </div>
    </>
  );
}
