"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { DB_URL } from "@config/config";
import styles from "./YooKataleChatbot.module.css";

const API_BASE = (DB_URL || "").replace(/\/api\/?$/, "") || "https://yookatale-server.onrender.com";

const TABS = [
  { id: "all", label: "All" },
  { id: "orders", label: "Orders" },
  { id: "delivery", label: "Delivery" },
  { id: "payments", label: "Payments" },
  { id: "vendors", label: "Vendors" },
  { id: "products", label: "Products" },
  { id: "account", label: "Account" },
];

const CHIPS = {
  all: [
    { ic: "truck", cl: "", t: "How do I track my order?", k: "track" },
    { ic: "money", cl: "", t: "What are the delivery fees?", k: "fees" },
    { ic: "pin", cl: "", t: "Which areas do you deliver to?", k: "areas" },
    { ic: "phone", cl: "o", t: "How do I pay with Mobile Money?", k: "payment" },
    { ic: "alert", cl: "o", t: "I have a problem with my order", k: "agent" },
    { ic: "leaf", cl: "", t: "What fresh products are available?", k: "products" },
    { ic: "rider", cl: "", t: "How do I become a delivery rider?", k: "rider" },
    { ic: "store", cl: "", t: "How do I register as a vendor?", k: "vendor" },
  ],
  orders: [
    { ic: "truck", cl: "", t: "How do I track my order?", k: "track" },
    { ic: "alert", cl: "o", t: "My order is late", k: "late" },
    { ic: "alert", cl: "o", t: "I received the wrong item", k: "agent" },
    { ic: "refund", cl: "", t: "How do I cancel my order?", k: "refund" },
    { ic: "refund", cl: "", t: "How do I get a refund?", k: "refund" },
    { ic: "alert", cl: "o", t: "My order has missing items", k: "agent" },
  ],
  delivery: [
    { ic: "money", cl: "", t: "What are the delivery fees in Kampala?", k: "fees" },
    { ic: "pin", cl: "", t: "Which areas does YooKatale deliver to?", k: "areas" },
    { ic: "truck", cl: "", t: "How fast is delivery?", k: "fees" },
    { ic: "rider", cl: "", t: "Become a delivery partner", k: "rider" },
    { ic: "pin", cl: "", t: "Do you deliver to Entebbe?", k: "areas" },
    { ic: "pin", cl: "", t: "Do you deliver to Wakiso/Mukono?", k: "areas" },
  ],
  payments: [
    { ic: "phone", cl: "o", t: "How do I pay with MTN MoMo?", k: "payment" },
    { ic: "phone", cl: "o", t: "How do I pay with Airtel Money?", k: "payment" },
    { ic: "card", cl: "o", t: "Can I pay cash on delivery?", k: "payment" },
    { ic: "refund", cl: "", t: "My payment failed", k: "payment" },
    { ic: "refund", cl: "", t: "How do I get a refund?", k: "refund" },
    { ic: "card", cl: "o", t: "Is my payment information secure?", k: "payment" },
  ],
  vendors: [
    { ic: "store", cl: "", t: "How do I register as a vendor?", k: "vendor" },
    { ic: "money", cl: "", t: "What's YooKatale's commission?", k: "vendor" },
    { ic: "store", cl: "", t: "How do vendors get paid?", k: "vendor" },
    { ic: "store", cl: "", t: "What categories can I sell in?", k: "vendor" },
    { ic: "sub", cl: "y", t: "Are there any registration fees?", k: "vendor" },
  ],
  products: [
    { ic: "leaf", cl: "", t: "What's fresh and available today?", k: "products" },
    { ic: "leaf", cl: "", t: "Do you sell organic produce?", k: "products" },
    { ic: "leaf", cl: "", t: "Where are products sourced from?", k: "products" },
    { ic: "sub", cl: "y", t: "Tell me about subscription plans", k: "subscribe" },
    { ic: "money", cl: "", t: "Are there bulk purchase discounts?", k: "products" },
  ],
  account: [
    { ic: "acc", cl: "", t: "How do I manage my account?", k: "account" },
    { ic: "acc", cl: "", t: "How do I reset my password?", k: "account" },
    { ic: "acc", cl: "", t: "How do I update my delivery address?", k: "account" },
    { ic: "alert", cl: "o", t: "I cannot log in to my account", k: "account" },
  ],
};

const KB = {
  track: {
    intro: "To <strong>track your order</strong> on YooKatale:",
    steps: [
      "Open the app and tap <strong>My Account</strong> in the sidebar",
      "Select <strong>My Orders</strong> and tap on the order you want to track",
      "View live status: <em>Confirmed → Preparing → Out for Delivery → Delivered</em>",
      "You'll also receive <strong>SMS notifications</strong> at every stage to your registered number",
    ],
    extra: "If your order hasn't updated in over 2 hours, tap <strong>Report Issue</strong> on the order page for immediate help.",
    qrs: ["Order is late", "Cancel my order", "Talk to agent"],
  },
  fees: {
    intro: "<strong>YooKatale delivery fees</strong> across Uganda:",
    steps: [
      "<strong>Kampala (all zones):</strong> UGX 3,000 flat fee",
      "<strong>Entebbe / Wakiso:</strong> UGX 5,000",
      "<strong>Mukono / Jinja:</strong> UGX 8,000",
      "<strong>Free delivery</strong> on all orders above UGX 100,000",
    ],
    extra: "Orders placed before <strong>3 PM</strong> are guaranteed same-day delivery in Kampala and Entebbe.",
    qrs: ["Delivery areas", "How fast is delivery?", "Free delivery conditions"],
  },
  areas: {
    intro: "<strong>YooKatale currently delivers to:</strong>",
    steps: [
      "<strong>Kampala</strong> — All zones within 2–4 hours",
      "<strong>Entebbe</strong> — Same-day delivery",
      "<strong>Wakiso</strong> — Nansana, Kira, Namugongo, Gayaza",
      "<strong>Mukono</strong> — Same or next-day delivery",
      "<strong>Jinja</strong> — Next-day delivery",
    ],
    extra: "We are actively expanding to <strong>Mbarara</strong>, <strong>Gulu</strong>, and <strong>Lira</strong>. Follow our social media for updates!",
    qrs: ["Delivery fees", "Schedule a delivery", "Talk to support"],
  },
  payment: {
    intro: "<strong>Payment methods accepted on YooKatale:</strong>",
    steps: [
      "<strong>MTN Mobile Money</strong> — Most popular, instant confirmation",
      "<strong>Airtel Money</strong> — Fast and reliable",
      "<strong>Visa / Mastercard</strong> — Secure online card payment",
      "<strong>Cash on Delivery</strong> — Pay when your order arrives",
    ],
    extra: "All digital payments are processed securely with <strong>256-bit encryption</strong>. You receive an instant SMS confirmation after every payment.",
    qrs: ["Payment failed?", "Cash on delivery areas", "Refund process"],
  },
  products: {
    intro: "<strong>Today's fresh products on YooKatale:</strong>",
    steps: [
      "<strong>Vegetables:</strong> Sukuma wiki, Tomatoes, Nakati, Dodo, Onions",
      "<strong>Fruits:</strong> Jackfruit, Matooke, Pineapple, Mangoes, Passion fruit",
      "<strong>Meat & Poultry:</strong> Farm chicken, Beef, Goat, Pork",
      "<strong>Dairy:</strong> Fresh goat milk, Yoghurt, Eggs, Ghee",
      "<strong>Grains & Staples:</strong> Posho, Cowpeas, Maize, Sorghum, Simsim",
    ],
    extra: "All products are sourced from <strong>verified local Ugandan farms</strong> and delivered fresh daily.",
    card: {
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      cat: "Fresh Today",
      name: "Farm Vegetables Basket",
      desc: "Assorted fresh vegetables from local Ugandan farms, harvested daily.",
      price: "UGX 15,000",
    },
    qrs: ["Browse all categories", "Best sellers this week", "Organic products"],
  },
  vendor: {
    intro: "<strong>How to register as a YooKatale vendor:</strong>",
    steps: [
      "Tap <strong>Partner With Us</strong> in the sidebar or visit yookatale.app/partner",
      "Fill in your store name, phone number, location and business category",
      "Submit your application — our team reviews within <strong>24 hours</strong>",
      "Once approved, list products and go live immediately",
    ],
    extra: "<strong>No upfront registration fee.</strong> YooKatale takes a small commission per sale only. Vendors keep up to <strong>85% of every sale</strong> and receive weekly payouts via Mobile Money.",
    qrs: ["Vendor commissions", "What categories can I sell?", "Partner support team"],
  },
  rider: {
    intro: "<strong>Become a YooKatale delivery partner:</strong>",
    steps: [
      "<strong>Requirements:</strong> Own motorcycle/bicycle, valid driving permit (for bikes), smartphone",
      "<strong>Apply:</strong> Tap Partner → Delivery Partner in the sidebar menu",
      "<strong>Onboarding:</strong> Attend a 1-day orientation at our Kampala office",
      "<strong>Start earning:</strong> UGX 500,000 – 1,200,000/month with flexible hours",
    ],
    extra: "Current openings in <strong>Kampala, Wakiso, and Entebbe</strong>. Apply today and start riding within 72 hours.",
    qrs: ["Rider earnings breakdown", "Vehicle requirements", "Apply now"],
  },
  refund: {
    intro: "<strong>YooKatale Refund & Return Policy:</strong>",
    steps: [
      "Contact us <strong>within 1 hour</strong> of delivery if there's an issue",
      "Go to <strong>My Orders → Select Order → Report Issue</strong> and choose your reason",
      "Our team investigates and responds within <strong>2 hours</strong>",
      "Approved refunds are sent back to your original payment method within 24 hours",
    ],
    extra: "For urgent refund cases, call <strong>+256 786 118137</strong> directly.",
    qrs: ["Wrong item delivered", "Damaged product", "Call support now"],
  },
  subscribe: {
    intro: "<strong>YooKatale Subscription Plans</strong> — save money on regular orders:",
    steps: [
      "<strong>Weekly Fresh Box:</strong> Seasonal vegetables delivered every week",
      "<strong>Monthly Staples Plan:</strong> Maize, beans, rice and essentials at discounted prices",
      "<strong>Custom Plan:</strong> Choose your own products and delivery schedule",
      "Pay once, enjoy automatic fresh deliveries with <strong>priority dispatch</strong>",
    ],
    extra: "Subscribers save up to <strong>20% off</strong> regular prices.",
    qrs: ["Subscription pricing", "Modify my subscription", "Cancel subscription"],
  },
  account: {
    intro: "<strong>Managing your YooKatale account:</strong>",
    steps: [
      "Open the app and tap your profile photo or go to the sidebar menu",
      "Tap <strong>My Profile</strong> to update name, phone number, and email",
      "Change your delivery address under <strong>Saved Addresses</strong>",
      "View order history and download invoices under <strong>My Orders</strong>",
    ],
    extra: "Forgot your password? Tap <strong>Forgot Password</strong> on the login screen. For help, call <strong>+256 786 118137</strong>.",
    qrs: ["Reset password", "Delete account", "Contact support"],
  },
  late: {
    intro: "Sorry your order is running late! Here's what to do right now:",
    steps: [
      "Check the live tracking status in <strong>My Orders</strong>",
      "If the status hasn't updated for <strong>2+ hours</strong>, tap <strong>Report Issue</strong>",
      "Our dispatch team will contact your rider immediately",
      "You can also call <strong>+256 786 118137</strong> for live assistance",
    ],
    extra: "Orders delayed beyond <strong>6 hours</strong> automatically qualify for a <strong>free replacement or full refund</strong>.",
    qrs: ["Track my order", "Request replacement", "Call support now"],
  },
  agent: {
    isAgent: true,
    intro:
      "Connecting you with a live YooKatale support agent. Our team is available <strong>Monday–Saturday, 7 AM – 9 PM</strong>.<br><br>Average wait time: <strong>under 3 minutes</strong>.",
    qrs: ["Call +256 786 118137", "WhatsApp us", "Leave a message"],
  },
  default: {
    intro:
      "I want to make sure I give you the best answer. Let me know more about what you need, or tap one of the suggested questions below — I'm here to help!",
    qrs: ["Track my order", "Delivery info", "Payment help", "Talk to an agent"],
  },
};

function matchKey(text) {
  const s = (text || "").toLowerCase();
  if (/track|where.*order|order status|my order|shipped/.test(s)) return "track";
  if (/fee|cost|charge|how much.*deliv/.test(s)) return "fees";
  if (/area|deliver.*to|location|kampala|entebbe|wakiso|mukono|jinja|zone|where.*deliv/.test(s)) return "areas";
  if (/mobile money|mtn|airtel|pay|payment|visa|card|cash on/.test(s)) return "payment";
  if (/vendor|sell|register.*store|my store|partner.*vendor|become.*vendor/.test(s)) return "vendor";
  if (/product|fresh|available|buy|food|vegetable|fruit|meat|dairy|grain|today/.test(s)) return "products";
  if (/rider|delivery partner|boda|driver|motorcycle|bicycle|join.*delivery/.test(s)) return "rider";
  if (/refund|return|replace|money back|cancel/.test(s)) return "refund";
  if (/subscri/.test(s)) return "subscribe";
  if (/account|profile|password|address|login|sign in/.test(s)) return "account";
  if (/late|delay|not arrived|missing|wrong|damaged|problem|issue|error/.test(s)) return "late";
  if (/agent|human|person|staff|support team|call|speak.*to/.test(s)) return "agent";
  if (/fail|failed.*pay|error.*pay|payment.*error/.test(s)) return "payment";
  return "default";
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Icons as small SVG components
const IconTruck = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconMoney = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IconPin = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const IconPhone = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const IconAlert = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconLeaf = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.25A13 13 0 0015 21c3.87 0 7-3.13 7-7 0-2.5-1-4.75-5-6z" />
  </svg>
);
const IconRider = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6h2l3 5.5M8 17.5h5.5L16 9H9L6.5 14" />
  </svg>
);
const IconStore = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconCard = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconSub = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);
const IconRefund = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
  </svg>
);
const IconAcc = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconArr = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="13" height="13">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const ICONS = {
  truck: IconTruck,
  money: IconMoney,
  pin: IconPin,
  phone: IconPhone,
  alert: IconAlert,
  leaf: IconLeaf,
  rider: IconRider,
  store: IconStore,
  card: IconCard,
  sub: IconSub,
  refund: IconRefund,
  acc: IconAcc,
  arr: IconArr,
};

// Get plain text from a message for search
function getMessageText(m) {
  if (m.type === "steps" && m.steps) return m.steps.join(" ");
  if (m.type === "qrs" && m.qrs) return m.qrs.join(" ");
  if (m.type === "productCard" && m.card) return [m.card.cat, m.card.name, m.card.desc].join(" ");
  if (m.type === "agentCard") return "agent connect";
  if (typeof m.content === "string") return m.content.replace(/<[^>]+>/g, " ");
  return "";
}

// Highlight search term in HTML-safe way (for plain text)
function highlightText(text, query, highlightClass) {
  if (!query || !text || !highlightClass) return text;
  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!q) return text;
  const re = new RegExp(`(${q})`, "gi");
  return text.replace(re, `<mark class="${highlightClass}">$1</mark>`);
}

export default function YooKataleChatbot() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("all");
  const [messages, setMessages] = useState([]);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [withAgent, setWithAgent] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [userInfo] = useState(() => {
    if (typeof window === "undefined") return { name: "", email: "", phone: "" };
    try {
      const s = window.localStorage.getItem("yookatale_support_user_info");
      if (s) return JSON.parse(s);
    } catch {}
    return { name: "", email: "", phone: "" };
  });
  const msgsRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollBot = useCallback(() => {
    const el = msgsRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Speech recognition (microphone)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let final = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setInput((prev) => {
        const base = prev.trim() ? prev + " " : prev;
        return base + final + interim;
      });
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {}
    };
  }, []);

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) {
      setInput((prev) => prev + " (Voice not supported in this browser)");
      return;
    }
    const rec = recognitionRef.current;
    if (listening) {
      try {
        rec.stop();
      } catch {}
      setListening(false);
    } else {
      try {
        rec.start();
        setListening(true);
      } catch (e) {
        setListening(false);
      }
    }
  }, [listening]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setChipsVisible(true);
    setTopic("all");
    setWithAgent(false);
    setConversationId(null);
    setSearchQuery("");
    setMenuOpen(false);
    setOpen(true);
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your <strong>YooKatale Smart Assistant</strong>.<br><br>I can help with <strong>orders & tracking</strong>, <strong>deliveries across Uganda</strong>, <strong>Mobile Money payments</strong>, <strong>vendor registration</strong>, fresh products, subscriptions, and much more.<br><br>What can I do for you today?",
        time: formatTime(),
      },
    ]);
  }, []);

  // Add user or bot message
  const addMsg = useCallback(
    (html, isUser) => {
      const time = formatTime();
      setMessages((prev) => [...prev, { role: isUser ? "user" : "assistant", content: html, time }]);
      setTimeout(scrollBot, 50);
    },
    [scrollBot]
  );

  const addTyping = useCallback(() => {
    setTyping(true);
    setTimeout(scrollBot, 50);
  }, [scrollBot]);

  const removeTyping = useCallback(() => setTyping(false), []);

  const addSteps = useCallback(
    (steps) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "steps",
          steps,
          time: formatTime(),
        },
      ]);
      setTimeout(scrollBot, 50);
    },
    [scrollBot]
  );

  const addQRs = useCallback(
    (qrs) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "qrs",
          qrs,
          time: formatTime(),
        },
      ]);
      setTimeout(scrollBot, 50);
    },
    [scrollBot]
  );

  const addProductCard = useCallback(
    (card) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "productCard",
          card,
          time: formatTime(),
        },
      ]);
      setTimeout(scrollBot, 50);
    },
    [scrollBot]
  );

  const addAgentCard = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        type: "agentCard",
        time: formatTime(),
      },
    ]);
    setTimeout(scrollBot, 50);
  }, [scrollBot]);

  // Local KB respond
  const respond = useCallback(
    (key) => {
      const r = KB[key] || KB.default;
      const delay = 650 + Math.random() * 500;
      addTyping();
      setTimeout(() => {
        removeTyping();
        addMsg(r.intro, false);
        if (r.isAgent) {
          addAgentCard();
          if (r.qrs) setTimeout(() => addQRs(r.qrs), 300);
          return;
        }
        if (r.steps) addSteps(r.steps);
        const after = () => {
          if (r.card) addProductCard(r.card);
          if (r.qrs) addQRs(r.qrs);
        };
        if (r.extra) {
          setTimeout(() => {
            addMsg(r.extra, false);
            setTimeout(after, 300);
          }, 450);
        } else {
          after();
        }
      }, delay);
    },
    [
      addTyping,
      removeTyping,
      addMsg,
      addSteps,
      addQRs,
      addProductCard,
      addAgentCard,
    ]
  );

  // Backend: request agent handoff
  const requestAgent = useCallback(async () => {
    if (sending || withAgent) return;
    setSending(true);
    const payload = {
      userInfo: userInfo.name || userInfo.email || userInfo.phone ? userInfo : {},
      messageHistory: messages
        .filter((m) => m.role && (m.role === "assistant" || m.role === "user"))
        .map((m) => ({ role: m.role, content: typeof m.content === "string" ? m.content : "" })),
    };
    try {
      const res = await fetch(`${API_BASE}/api/support/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (data.conversationId) {
        setConversationId(data.conversationId);
        setWithAgent(true);
        addMsg("You're connected. An agent will reply here soon. You can keep sending messages.", false);
      } else {
        addMsg("Could not connect to an agent. Please try again or call +256 786 118137.", false);
      }
    } catch {
      addMsg("Could not connect to an agent. Please try again or call +256 786 118137.", false);
    } finally {
      setSending(false);
    }
  }, [sending, withAgent, messages, userInfo, addMsg]);

  // Poll for agent messages when withAgent
  useEffect(() => {
    if (!withAgent || !conversationId || !open) return;
    const url = `${API_BASE}/api/support/conversations/${conversationId}/messages`;
    const fetchMessages = async () => {
      try {
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (data.messages && Array.isArray(data.messages)) {
          const mapped = data.messages.map((m) => ({
            role: m.role === "agent" ? "assistant" : m.role,
            content: m.content,
            time: m.createdAt
              ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : formatTime(),
          }));
          setMessages(mapped);
        }
      } catch {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [withAgent, conversationId, open]);

  const sendMessage = useCallback(
    async (prefilledText) => {
      const text = (prefilledText || input || "").trim();
      if (!text) return;

      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      setChipsVisible(false);
      addMsg(text.replace(/</g, "&lt;"), true);

      if (withAgent && conversationId) {
        setSending(true);
        try {
          await fetch(`${API_BASE}/api/support/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: text }),
            credentials: "include",
          });
        } catch {
          addMsg("Message could not be sent. Please try again.", false);
        } finally {
          setSending(false);
        }
        return;
      }

      respond(matchKey(text));
    },
    [input, withAgent, conversationId, addMsg, respond]
  );

  const chipClick = useCallback(
    (chipText, key) => {
      setChipsVisible(false);
      addMsg(chipText.replace(/</g, "&lt;"), true);
      setTimeout(() => respond(key), 100);
    },
    [addMsg, respond]
  );

  const switchTopic = useCallback((newTopic) => {
    setTopic(newTopic);
    setChipsVisible(true);
    scrollBot();
  }, [scrollBot]);

  const openChat = useCallback(() => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your <strong>YooKatale Smart Assistant</strong>.<br><br>I can help with <strong>orders & tracking</strong>, <strong>deliveries across Uganda</strong>, <strong>Mobile Money payments</strong>, <strong>vendor registration</strong>, fresh products, subscriptions, and much more.<br><br>What can I do for you today?",
          time: formatTime(),
        },
      ]);
      setChipsVisible(true);
    }
  }, [messages.length]);

  const closeChat = useCallback(() => {
    setOpen(false);
  }, []);

  const chipsList = (CHIPS[topic] || CHIPS.all).slice(0, 7);

  // Filter messages by search query (show all if empty)
  const searchQ = searchQuery.trim().toLowerCase();
  const displayedMessages = searchQ
    ? messages.filter((m) => getMessageText(m).toLowerCase().includes(searchQ))
    : messages;

  return (
    <div className={styles.wrapper}>
      {/* FAB */}
      {!open && (
        <button
          type="button"
          className={styles.fab}
          onClick={openChat}
          aria-label="Open YooKatale Assistant"
        >
          <span className={styles.fabRing} />
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="26" height="26" style={{ color: "#fff" }}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span className={styles.fabDot}>1</span>
        </button>
      )}

      {/* Chat shell */}
      <div className={`${styles.chat} ${open ? styles.chatOpen : ""}`}>
        {/* Header */}
        <div className={styles.hd}>
          <div className={styles.hdBg1} />
          <div className={styles.hdBg2} />
          <div className={styles.hdBar} />
          {searchOpen ? (
            <div className={styles.hdSearchWrap}>
              <input
                ref={searchInputRef}
                type="search"
                className={styles.hdSearchInput}
                placeholder="Search in conversation…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search in conversation"
              />
              <button
                type="button"
                className={styles.hdSearchClose}
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                aria-label="Close search"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="18" height="18">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
          <>
          <div className={styles.hdMain}>
            <div className={styles.hdAv}>
              <span>YK</span>
              <span className={styles.hdAvDot} />
            </div>
            <div className={styles.hdInf}>
              <div className={styles.hdNm}>YooKatale Assistant</div>
              <div className={styles.hdSt}>
                <span className={styles.ld} />
                <span className={styles.hdStT}>Online · Instant replies · 24/7</span>
              </div>
            </div>
            <div className={styles.hdBts}>
              <button
                type="button"
                className={styles.hdBt}
                onClick={() => setSearchOpen(true)}
                aria-label="Search in conversation"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <div className={styles.hdMenuWrap} ref={menuRef}>
                <button
                  type="button"
                  className={styles.hdBt}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Menu"
                  aria-expanded={menuOpen}
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
                {menuOpen && (
                  <div className={styles.hdMenuDropdown}>
                    <button type="button" className={styles.hdMenuItem} onClick={() => { clearChat(); setMenuOpen(false); }}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Clear chat
                    </button>
                    {!withAgent && (
                      <button type="button" className={styles.hdMenuItem} onClick={() => { requestAgent(); setMenuOpen(false); }}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Talk to an agent
                      </button>
                    )}
                    <Link href="/faqs" className={styles.hdMenuItem} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      FAQs
                    </Link>
                    <Link href="/contact" className={styles.hdMenuItem} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      Contact us
                    </Link>
                  </div>
                )}
              </div>
              <button type="button" className={styles.hdBt} onClick={closeChat} aria-label="Close">
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="16" height="16">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          </>
          )}
          {!searchOpen && (
          <div className={styles.hdStats}>
            <div className={styles.hdS}>
              <div className={styles.hdSv}>&lt;1 min</div>
              <div className={styles.hdSl}>Avg Reply</div>
            </div>
            <div className={styles.hdS}>
              <div className={styles.hdSv}>24 / 7</div>
              <div className={styles.hdSl}>Available</div>
            </div>
            <div className={styles.hdS}>
              <div className={styles.hdSv}>98%</div>
              <div className={styles.hdSl}>Satisfied</div>
            </div>
          </div>
          )}
        </div>

        {/* Messages */}
        <div className={styles.msgs} ref={msgsRef}>
          <div className={styles.dsep}>
            <span className={styles.dsepSpan}>Today</span>
          </div>

          {displayedMessages.length === 0 && searchQ ? (
            <div className={styles.row}>
              <div className={styles.sp28} />
              <div className={styles.mw}>
                <div className={`${styles.bbl} ${styles.bblBot}`}>
                  No messages match &quot;{searchQuery.trim()}&quot;.
                </div>
              </div>
            </div>
          ) : null}
          {displayedMessages.map((m, i) => {
            if (m.type === "steps") {
              return (
                <div key={`s-${i}`} className={styles.row}>
                  <div className={styles.sp28} />
                  <div className={`${styles.mw} ${styles.mfull}`}>
                    <div className={`${styles.bbl} ${styles.bblBot}`}>
                      <div className={styles.stepsWrap}>
                        {m.steps.map((s, j) => (
                          <div key={j} className={styles.step}>
                            <div className={styles.snum}>{j + 1}</div>
                            <div className={styles.stxt} dangerouslySetInnerHTML={{ __html: s }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (m.type === "qrs") {
              return (
                <div key={`q-${i}`} className={styles.row}>
                  <div className={styles.sp28} />
                  <div className={`${styles.mw} ${styles.mfull}`}>
                    <div className={styles.qrs}>
                      {m.qrs.map((q, j) => (
                        <button
                          key={j}
                          type="button"
                          className={styles.qr}
                          onClick={() => sendMessage(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            if (m.type === "productCard") {
              const c = m.card;
              return (
                <div key={`p-${i}`} className={styles.row}>
                  <div className={styles.sp28} />
                  <div className={styles.mw}>
                    <div className={styles.pcard}>
                      <img className={styles.pcardImg} src={c.img} alt={c.name} />
                      <div className={styles.pcb}>
                        <div className={styles.pccat}>{c.cat}</div>
                        <div className={styles.pcnm}>{c.name}</div>
                        <div className={styles.pcdesc}>{c.desc}</div>
                      </div>
                      <div className={styles.pcft}>
                        <div className={styles.pcpr}>{c.price}</div>
                        <Link href="/marketplace" className={styles.pcbtn}>Order Now</Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (m.type === "agentCard") {
              return (
                <div key={`a-${i}`} className={styles.row}>
                  <div className={styles.sp28} />
                  <div className={`${styles.mw} ${styles.mfull}`}>
                    <a
                      href="tel:+256786118137"
                      className={styles.agcard}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className={styles.agav}>SK</div>
                      <div className={styles.aginf}>
                        <div className={styles.agnm}>Sarah Kyomuhendo</div>
                        <div className={styles.agrl}>Senior Support Agent · YooKatale</div>
                        <div className={styles.agon}>
                          <span className={styles.agdot} />
                          <span className={styles.agavT}>Available now · &lt;3 min wait</span>
                        </div>
                      </div>
                      <span className={styles.agbtn}>Connect</span>
                    </a>
                  </div>
                </div>
              );
            }

            const isUser = m.role === "user";
            return (
              <div key={i} className={`${styles.row} ${isUser ? styles.rowUser : ""}`}>
                {!isUser && (
                  <div className={styles.rav}>
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13" height="13" style={{ color: "#fff" }}>
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4" />
                    </svg>
                  </div>
                )}
                <div className={styles.mw}>
                  {!isUser && <div className={styles.slbl}>YooKatale Assistant</div>}
                  {typeof m.content === "string" && m.content.includes("<") ? (
                    <div
                      className={`${styles.bbl} ${isUser ? styles.bblUsr : styles.bblBot}`}
                      dangerouslySetInnerHTML={{ __html: m.content }}
                    />
                  ) : (
                    <div
                      className={`${styles.bbl} ${isUser ? styles.bblUsr : styles.bblBot}`}
                      dangerouslySetInnerHTML={{
                        __html: highlightText(m.content || "", searchQuery, styles.msgHighlight),
                      }}
                    />
                  )}
                  <div className={styles.ts}>{m.time}</div>
                </div>
              </div>
            );
          })}

          {typing && (
            <div className={styles.row}>
              <div className={styles.rav}>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="13" height="13" style={{ color: "#fff" }}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4" />
                </svg>
              </div>
              <div className={styles.mw}>
                <div className={`${styles.bbl} ${styles.bblBot}`}>
                  <div className={styles.tdots}>
                    <span className={styles.td} />
                    <span className={styles.td} />
                    <span className={styles.td} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {chipsVisible && chipsList.length > 0 && !searchOpen && (
            <>
              <div className={styles.row}>
                <div className={styles.sp28} />
                <div className={`${styles.mw} ${styles.mfull}`}>
                  <div className={styles.chipsLbl}>QUICK QUESTIONS</div>
                  <div className={styles.chipsList}>
                    {chipsList.map((c, j) => {
                      const Icon = ICONS[c.ic] || ICONS.alert;
                      return (
                        <button
                          key={j}
                          type="button"
                          className={styles.chip}
                          onClick={() => chipClick(c.t, c.k)}
                        >
                          <span className={`${styles.ci} ${c.cl === "o" ? styles.ciO : ""} ${c.cl === "y" ? styles.ciY : ""}`}>
                            <Icon />
                          </span>
                          {c.t}
                          <span className={styles.chArr}>
                            <IconArr />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${topic === t.id ? styles.tabOn : ""}`}
              onClick={() => switchTopic(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={styles.inpArea}>
          <div className={styles.inpRow}>
            <div className={styles.inpBox}>
              <textarea
                ref={inputRef}
                className={styles.inp}
                placeholder="Type your message…"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  const ta = e.target;
                  ta.style.height = "auto";
                  ta.style.height = `${Math.min(ta.scrollHeight, 96)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={sending}
              />
              <button type="button" className={styles.inpIc} aria-label="Attach">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="17" height="17">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.inpIc} ${listening ? styles.inpIcListening : ""}`}
                onClick={toggleVoice}
                aria-label={listening ? "Stop listening" : "Voice input"}
                title={listening ? "Listening… Speak now" : "Type with your voice"}
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="17" height="17">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className={styles.send}
              onClick={() => sendMessage()}
              disabled={sending}
              aria-label="Send"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" width="19" height="19" style={{ color: "#fff" }}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className={styles.enc}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className={styles.encSpan}>End-to-end encrypted · Powered by YooKatale AI</span>
          </div>
          {!withAgent && (
            <button
              type="button"
              onClick={requestAgent}
              disabled={sending}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#1a6b3a",
                background: "#e8f5ee",
                border: "1.5px solid #1a6b3a",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Talk to an agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
