"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@slices/authSlice";
import { useOrdersMutation } from "@slices/productsApiSlice";
import { useUpdateUserAvatarMutation } from "@slices/usersApiSlice";
import { getUserAvatarUrl, getOptimizedImageUrl } from "@constants/constants";
import UpdateAccount from "@components/modals/UpdateAccount";
import ChangePassword from "@components/modals/ChangePassword";
import OrdersTab from "@components/modals/tabs/settingsTabs/OrdersTab";
import SettingsTab from "@components/modals/tabs/settingsTabs/SettingsTab";
import SubscriptionsTab from "@components/modals/tabs/settingsTabs/SubscriptionsTab";
import { useDisclosure } from "@chakra-ui/react";
import { DB_URL } from "@config/config";

/* ─── BASE SVG ───────────────────────────────────────────────────────────── */
const Icon = ({ d, s = 18, stroke = "currentColor", fill = "none", sw = 1.7, children }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const UserIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>
);
const OrderIcon = ({ s = 18 }) => (
  <Icon s={s}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>
);
const SubIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>
);
const SettingsIcon = ({ s = 18 }) => (
  <Icon s={s}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-2.82-1.17l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Icon>
);
const MailIcon = ({ s = 18 }) => (
  <Icon s={s}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></Icon>
);
const PhoneIcon = ({ s = 18 }) => (
  <Icon s={s} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
);
const GenderIcon = ({ s = 18 }) => (
  <Icon s={s}><circle cx="12" cy="8" r="4" /><path d="M12 12v8M8 16h8" /></Icon>
);
const MapPinIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Icon>
);
const LeafIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></Icon>
);
const CameraIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></Icon>
);
const KeyIcon = ({ s = 18 }) => (
  <Icon s={s}><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></Icon>
);
const TrashIcon = ({ s = 18 }) => (
  <Icon s={s}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></Icon>
);
const ShareIcon = ({ s = 18 }) => (
  <Icon s={s}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></Icon>
);
const TruckIcon = ({ s = 18 }) => (
  <Icon s={s}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></Icon>
);
const StarIcon = ({ s = 10 }) => (
  <Icon s={s} fill="#f0c020" stroke="#f0c020" sw={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
);
const ChevRight = ({ s = 14 }) => <Icon s={s} d="m9 18 6-6-6-6" />;
const EditIcon = ({ s = 18 }) => (
  <Icon s={s}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
);
const CheckIcon = ({ s = 18 }) => <Icon s={s}><polyline points="20 6 9 17 4 12" /></Icon>;

const fmt = (n) => `UGX ${Number(n).toLocaleString()}`;

const navItems = [
  { id: "profile", label: "Profile", Icon: UserIcon },
  { id: "orders", label: "Orders", Icon: OrderIcon },
  { id: "subscriptions", label: "Subscriptions", Icon: SubIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
];

function Avatar({ name, size, src }) {
  const initials = name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: src ? "transparent" : "linear-gradient(135deg,#2d8c2d,#4cd964)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Sora',sans-serif",
        fontWeight: 900,
        fontSize: size * 0.34,
        color: "#fff",
        userSelect: "none",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </div>
  );
}

function Field({ Icon: FieldIcon, label, value, onEdit }) {
  return (
    <div className="acc-field">
      <div className="acc-field-icon"><FieldIcon s={14} /></div>
      <div className="acc-field-body">
        <div className="acc-field-label">{label}</div>
        <div className="acc-field-value">{value || <span className="acc-field-empty">Not set</span>}</div>
      </div>
      {onEdit && (
        <button type="button" className="acc-field-edit" onClick={onEdit} aria-label="Edit"><EditIcon s={11} /></button>
      )}
    </div>
  );
}

const ACC_CSS = `
.acc-page{min-height:100vh;max-width:1440px;margin:0 auto;padding:14px;display:flex;flex-direction:column;gap:14px;}
@media(min-width:900px){.acc-page{flex-direction:row;align-items:flex-start;padding:28px 32px;gap:22px;}}
.acc-hero{border-radius:18px;overflow:hidden;position:relative;background:linear-gradient(148deg,#061806 0%,#1a5c1a 55%,#2d8c2d 100%);animation:fadeUp .4s ease;flex-shrink:0;}
@media(min-width:900px){.acc-hero{width:256px;position:sticky;top:20px;}}
.acc-hero-grain{position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.4;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");}
.acc-hero-sweep{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.06) 50%,transparent 65%);background-size:300% 100%;animation:acc-shimmer 6s infinite;}
.acc-hero-blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.05);pointer-events:none;z-index:1;}
.acc-hero-body{position:relative;z-index:5;padding:20px 16px 16px;display:flex;flex-direction:column;gap:14px;}
.acc-hero-top{display:flex;align-items:flex-start;justify-content:space-between;}
.acc-av-ring{border-radius:50%;padding:3px;background:linear-gradient(135deg,#f0c020,#4cd964);display:inline-flex;}
.acc-av-inner{border-radius:50%;overflow:hidden;border:3px solid #0e1e0e;}
.acc-cam-dot{position:absolute;bottom:1px;right:1px;width:22px;height:22px;border-radius:50%;background:#e07820;border:2px solid #0e1e0e;display:flex;align-items:center;justify-content:center;color:#fff;}
.acc-share-btn{width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.8);transition:background .18s;}
.acc-share-btn:hover{background:rgba(255,255,255,.22);}
.acc-hero-name{font-family:'DM Serif Display',serif;font-size:21px;color:#fff;line-height:1.1;margin-bottom:5px;}
.acc-tier-pill{display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);border-radius:100px;padding:3px 9px;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#f0c020;}
.acc-hero-email{font-size:11px;color:rgba(255,255,255,.55);font-weight:500;margin-top:6px;}
.acc-hstats{display:grid;grid-template-columns:1fr 1fr 1fr;border-radius:13px;overflow:hidden;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.1);}
.acc-hstat{display:flex;flex-direction:column;align-items:center;padding:10px 4px;gap:2px;border-right:1px solid rgba(255,255,255,.08);}
.acc-hstat:last-child{border-right:none;}
.acc-hstat-val{font-size:16px;font-weight:900;color:#fff;line-height:1;}
.acc-hstat-lbl{font-size:8px;font-weight:600;color:rgba(255,255,255,.48);text-transform:uppercase;letter-spacing:.4px;text-align:center;}
.acc-loyalty{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:10px 12px;}
.acc-loy-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.acc-loy-lbl{font-size:10px;font-weight:700;color:rgba(255,255,255,.65);}
.acc-loy-pts{font-size:12px;font-weight:900;color:#f0c020;}
.acc-loy-track{height:5px;border-radius:3px;background:rgba(255,255,255,.15);overflow:hidden;}
.acc-loy-fill{height:100%;width:62%;border-radius:3px;background:linear-gradient(90deg,#d4a800,#f0c020);}
.acc-loy-hint{font-size:9px;color:rgba(255,255,255,.4);margin-top:5px;font-weight:500;}
.acc-snav{display:flex;flex-direction:column;gap:2px;}
@media(max-width:899px){.acc-snav{flex-direction:row;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}.acc-snav::-webkit-scrollbar{display:none;}}
.acc-snav-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:11px;cursor:pointer;border:none;background:transparent;font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:rgba(255,255,255,.65);width:100%;text-align:left;transition:background .18s,color .18s;white-space:nowrap;}
.acc-snav-btn:hover{background:rgba(255,255,255,.08);color:#fff;}
.acc-snav-btn.on{background:rgba(255,255,255,.14);color:#fff;}
.acc-snav-badge{margin-left:auto;background:#e07820;color:#fff;font-size:9px;font-weight:800;border-radius:100px;padding:1px 7px;min-width:20px;text-align:center;}
@media(max-width:899px){.acc-snav-btn{width:auto;padding:8px 13px;font-size:12px;}}
.acc-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:14px;animation:fadeUp .5s ease;}
.acc-card{background:#fff;border-radius:18px;box-shadow:0 2px 18px rgba(0,0,0,.07);border:1px solid rgba(0,0,0,.07);overflow:hidden;}
.acc-card-head{padding:15px 18px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.07);gap:10px;}
.acc-card-head-left{display:flex;align-items:center;gap:10px;}
.acc-card-head-icon{width:34px;height:34px;border-radius:10px;background:#e6f0e6;display:flex;align-items:center;justify-content:center;color:#1a5c1a;flex-shrink:0;}
.acc-card-title{font-family:'DM Serif Display',serif;font-size:17px;color:#0e180e;}
.acc-card-sub{font-size:10.5px;color:#8a9e87;font-weight:500;margin-top:1px;}
.acc-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:14px 16px;}
.acc-stat{background:#edf0ea;border-radius:13px;padding:14px 10px;text-align:center;border:1px solid rgba(0,0,0,.07);}
.acc-stat-val{font-size:clamp(15px,3vw,22px);font-weight:900;color:#0e180e;line-height:1;margin-bottom:4px;}
.acc-stat-lbl{font-size:9.5px;font-weight:700;color:#8a9e87;text-transform:uppercase;letter-spacing:.5px;}
.acc-stat-sub{font-size:10px;color:#8a9e87;margin-top:3px;}
.acc-av-sec{padding:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.acc-av-hint{font-size:11px;color:#8a9e87;font-weight:500;margin-top:4px;}
.acc-actions{padding:0 18px 16px;display:flex;gap:8px;flex-wrap:wrap;}
.acc-btn{display:inline-flex;align-items:center;gap:6px;border-radius:100px;padding:9px 18px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;border:none;transition:transform .15s,box-shadow .18s,background .18s;}
.acc-btn:hover{transform:translateY(-1px);}
.acc-btn-green{background:#1a5c1a;color:#fff;box-shadow:0 4px 14px rgba(26,92,26,.3);}
.acc-btn-green:hover{background:#2d8c2d;}
.acc-btn-ghost{background:transparent;color:#445444;border:1.5px solid rgba(0,0,0,.07);}
.acc-btn-ghost:hover{background:#edf0ea;}
.acc-btn-danger{background:transparent;color:#c0392b;border:1.5px solid rgba(192,57,43,.2);}
.acc-btn-danger:hover{background:rgba(192,57,43,.05);}
.acc-info-grid{display:grid;grid-template-columns:1fr;gap:1px;background:rgba(0,0,0,.07);}
@media(min-width:540px){.acc-info-grid{grid-template-columns:1fr 1fr;}}
@media(min-width:1100px){.acc-info-grid{grid-template-columns:1fr 1fr 1fr;}}
.acc-field{display:flex;align-items:center;gap:12px;padding:13px 18px;background:#fff;transition:background .15s;position:relative;cursor:default;}
.acc-field:hover{background:#fafcfa;}
.acc-field-icon{width:30px;height:30px;border-radius:8px;background:#e6f0e6;display:flex;align-items:center;justify-content:center;color:#1a5c1a;flex-shrink:0;}
.acc-field-body{flex:1;min-width:0;}
.acc-field-label{font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#8a9e87;margin-bottom:3px;}
.acc-field-value{font-size:13px;font-weight:700;color:#0e180e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.acc-field-empty{color:#8a9e87;font-weight:500;font-style:italic;}
.acc-field-edit{position:absolute;top:10px;right:10px;width:22px;height:22px;border-radius:6px;background:#e6f0e6;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#1a5c1a;opacity:0;transition:opacity .18s;}
.acc-field:hover .acc-field-edit{opacity:1;}
.acc-act-item{display:flex;align-items:center;gap:12px;padding:13px 18px;border-bottom:1px solid rgba(0,0,0,.07);transition:background .15s;cursor:pointer;}
.acc-act-item:last-child{border-bottom:none;}
.acc-act-item:hover{background:#fafcfa;}
.acc-act-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.acc-act-icon.shipped{background:#e6f0e6;color:#1a5c1a;}
.acc-act-icon.order{background:#fff4ea;color:#e07820;}
.acc-act-title{font-size:13px;font-weight:700;color:#0e180e;}
.acc-act-date{font-size:11px;color:#8a9e87;font-weight:500;margin-top:2px;}
.acc-act-right{margin-left:auto;text-align:right;flex-shrink:0;}
.acc-act-amount{font-size:13px;font-weight:800;color:#0e180e;}
.acc-act-status{display:inline-block;font-size:9px;font-weight:800;border-radius:100px;padding:2px 8px;margin-top:3px;}
.acc-s-delivered{background:#e6f0e6;color:#1a5c1a;}
.acc-s-processing{background:#fff4ea;color:#e07820;}
.acc-toast{position:fixed;bottom:28px;left:50%;z-index:1000;background:#1a5c1a;color:#fff;padding:12px 22px;border-radius:100px;font-size:13px;font-weight:800;box-shadow:0 8px 32px rgba(26,92,26,.42);display:flex;align-items:center;gap:8px;animation:acc-popIn .3s cubic-bezier(.34,1.4,.64,1) forwards;white-space:nowrap;transform:translateX(-50%);}
.acc-mob-pad{height:80px;}
@media(min-width:900px){.acc-mob-pad{display:none;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes acc-shimmer{from{background-position:300% 0}to{background-position:-300% 0}}
@keyframes acc-popIn{from{opacity:0;transform:translateX(-50%) translateY(12px) scale(.9)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
`;

export default function AccountPage() {
  const { userInfo } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, spent: 0, subscription: "Free" });
  const [activity, setActivity] = useState([]);
  const [fetchOrders] = useOrdersMutation();
  const [updateUserAvatar] = useUpdateUserAvatarMutation();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userInfo === undefined) return;
    if (!userInfo) {
      router.replace("/signin");
      return;
    }
  }, [userInfo, router]);

  function formatActivityDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  useEffect(() => {
    let cancelled = false;
    async function loadAccountData() {
      if (!userInfo?._id) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const res = await fetchOrders(userInfo._id).unwrap();
        if (cancelled) return;
        if (res?.status === "Success" && res?.data) {
          const { CompletedOrders = [], AllOrders = [] } = res.data;
          const ordersCount = Array.isArray(AllOrders) ? AllOrders.length : 0;
          const totalSpent = Array.isArray(CompletedOrders)
            ? CompletedOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0)
            : 0;
          setStats((s) => ({
            ...s,
            orders: ordersCount,
            spent: totalSpent,
            subscription: userInfo?.subscription || userInfo?.plan || "Free",
          }));
          const completed = Array.isArray(CompletedOrders) ? CompletedOrders : [];
          const activeOrders = Array.isArray(AllOrders) ? AllOrders.filter((o) => (o?.status || "").toLowerCase() !== "completed") : [];
          const act = [];
          completed.forEach((o) => {
            act.push({
              id: o._id,
              type: "shipped",
              title: "Package shipped",
              date: formatActivityDate(o?.createdAt),
              status: "Delivered",
              amount: Number(o?.total) || 0,
              sortAt: o?.createdAt ? new Date(o.createdAt).getTime() : 0,
            });
          });
          activeOrders.forEach((o) => {
            act.push({
              id: o._id + "_order",
              type: "order",
              title: "Order placed",
              date: formatActivityDate(o?.createdAt),
              status: "Processing",
              amount: Number(o?.total) || 0,
              sortAt: o?.createdAt ? new Date(o.createdAt).getTime() : 0,
            });
          });
          act.sort((a, b) => (b.sortAt || 0) - (a.sortAt || 0));
          setActivity(act.slice(0, 6));
        }
      } catch {
        if (!cancelled) setStats((s) => ({ ...s, subscription: userInfo?.subscription || userInfo?.plan || "Free" }));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadAccountData();
    return () => { cancelled = true; };
  }, [userInfo?._id, userInfo?.subscription, userInfo?.plan, fetchOrders]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  const handleAvatarChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file || !userInfo?._id) return;
    if (!file.type.startsWith("image/")) return;
    setAvatarLoading(true);
    try {
      const res = await updateUserAvatar({ userId: userInfo._id, file }).unwrap();
      if (res?.data) {
        const updated = { ...userInfo, avatar: res.data.avatar ?? userInfo.avatar, ...res.data };
        dispatch(setCredentials(updated));
        handleSave();
      }
    } catch (_) {}
    finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${DB_URL}/users/${userInfo?._id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok || data?.status === "Success") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("yookatale-app");
          window.location.href = "/";
        }
      }
    } catch (_) {}
    finally {
      setIsDeleting(false);
    }
  };

  const displayName = `${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`.trim() || userInfo?.email || "Account";
  const tier = (userInfo?.subscription || userInfo?.plan || stats.subscription || "Free") + " MEMBER";
  const loyaltyPts = userInfo?.loyaltyPts ?? 0;

  if (userInfo === undefined) return null;
  if (!userInfo) return null;

  const renderTabContent = () => {
    switch (active) {
      case "orders": return <OrdersTab />;
      case "subscriptions": return <SubscriptionsTab />;
      case "settings": return <SettingsTab />;
      default: return null;
    }
  };

  return (
    <>
      <style>{ACC_CSS}</style>
      <UpdateAccount isOpen={isUpdateOpen} onClose={onUpdateClose} />
      <ChangePassword isOpen={isPasswordOpen} onClose={onPasswordClose} />

      {saved && (
        <div className="acc-toast">
          <CheckIcon s={15} /> Profile saved successfully!
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarChange}
        disabled={avatarLoading}
      />

      <div className="acc-page">
        <div className="acc-hero">
          <div className="acc-hero-grain" />
          <div className="acc-hero-sweep" />
          <div className="acc-hero-blob" style={{ width: 180, height: 180, top: -60, right: -40 }} />
          <div className="acc-hero-blob" style={{ width: 80, height: 80, bottom: -20, left: 12 }} />
          <div className="acc-hero-body">
            <div className="acc-hero-top">
              <div style={{ position: "relative", display: "inline-flex" }}>
                <div className="acc-av-ring">
                  <div className="acc-av-inner">
                    <Avatar
                      name={displayName}
                      size={70}
                      src={getOptimizedImageUrl(getUserAvatarUrl(userInfo)) ?? getUserAvatarUrl(userInfo)}
                    />
                  </div>
                </div>
                <div className="acc-cam-dot" onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}>
                  <CameraIcon s={11} />
                </div>
              </div>
              <button type="button" className="acc-share-btn" aria-label="Share"><ShareIcon s={14} /></button>
            </div>
            <div>
              <div className="acc-hero-name">{displayName}</div>
              <div className="acc-tier-pill"><StarIcon s={9} />{tier}</div>
              <div className="acc-hero-email">{userInfo?.email}</div>
            </div>
            <div className="acc-hstats">
              <div className="acc-hstat">
                <div className="acc-hstat-val">{stats.orders}</div>
                <div className="acc-hstat-lbl">Orders</div>
              </div>
              <div className="acc-hstat">
                <div className="acc-hstat-val" style={{ color: "#f0c020", fontSize: 12 }}>{(stats.spent / 1000).toFixed(0)}K</div>
                <div className="acc-hstat-lbl">UGX Spent</div>
              </div>
              <div className="acc-hstat">
                <div className="acc-hstat-val" style={{ color: "#4cd964" }}>{loyaltyPts}</div>
                <div className="acc-hstat-lbl">Pts</div>
              </div>
            </div>
            <div className="acc-loyalty">
              <div className="acc-loy-row">
                <div className="acc-loy-lbl">Loyalty Progress</div>
                <div className="acc-loy-pts">{Number(loyaltyPts).toLocaleString()} pts</div>
              </div>
              <div className="acc-loy-track"><div className="acc-loy-fill" /></div>
              <div className="acc-loy-hint">760 pts to unlock Silver tier</div>
            </div>
            <nav className="acc-snav">
              {navItems.map(({ id, label, Icon: NavIcon }) => (
                <button
                  key={id}
                  type="button"
                  className={`acc-snav-btn${active === id ? " on" : ""}`}
                  onClick={() => setActive(id)}
                >
                  <NavIcon s={15} />
                  <span>{label}</span>
                  {id === "orders" && stats.orders > 0 && <span className="acc-snav-badge">{stats.orders}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="acc-main">
          {active === "profile" ? (
            <>
              {!isLoading && (
                <>
                  <div className="acc-card">
                    <div className="acc-stats-row">
                      <div className="acc-stat">
                        <div className="acc-stat-val">{stats.orders}</div>
                        <div className="acc-stat-lbl">Total Orders</div>
                        <div className="acc-stat-sub">All time</div>
                      </div>
                      <div className="acc-stat">
                        <div className="acc-stat-val" style={{ color: "#e07820", fontSize: "clamp(11px,2.2vw,16px)" }}>{fmt(stats.spent)}</div>
                        <div className="acc-stat-lbl">Total Spent</div>
                        <div className="acc-stat-sub">Since joining</div>
                      </div>
                      <div className="acc-stat">
                        <div className="acc-stat-val" style={{ color: "var(--g,#1a5c1a)" }}>{loyaltyPts}</div>
                        <div className="acc-stat-lbl">Loyalty Pts</div>
                        <div className="acc-stat-sub">Redeemable</div>
                      </div>
                    </div>
                  </div>
                  <div className="acc-card">
                    <div className="acc-card-head">
                      <div className="acc-card-head-left">
                        <div className="acc-card-head-icon"><CameraIcon s={16} /></div>
                        <div>
                          <div className="acc-card-title">Profile Picture</div>
                          <div className="acc-card-sub">Your photo appears on orders and reviews</div>
                        </div>
                      </div>
                    </div>
                    <div className="acc-av-sec">
                      <div className="acc-av-ring" style={{ background: "linear-gradient(135deg,#f0c020,#4cd964)" }}>
                        <div className="acc-av-inner">
                          <Avatar name={displayName} size={66} src={getOptimizedImageUrl(getUserAvatarUrl(userInfo)) ?? getUserAvatarUrl(userInfo)} />
                        </div>
                      </div>
                      <div>
                        <button type="button" className="acc-btn acc-btn-green" onClick={() => fileInputRef.current?.click()} disabled={avatarLoading}>
                          <CameraIcon s={13} />{avatarLoading ? "Uploading…" : "Upload photo"}
                        </button>
                        <div className="acc-av-hint">JPG or PNG · Max 5MB · Min 200×200px</div>
                      </div>
                    </div>
                    <div className="acc-actions">
                      <button type="button" className="acc-btn acc-btn-ghost" onClick={onPasswordOpen}><KeyIcon s={13} />Change password</button>
                      <button type="button" className="acc-btn acc-btn-green" onClick={onUpdateOpen}>
                        <EditIcon s={13} />Update profile
                      </button>
                      <button type="button" className="acc-btn acc-btn-danger" onClick={handleDeleteAccount} disabled={isDeleting}><TrashIcon s={13} />Delete account</button>
                    </div>
                  </div>
                  <div className="acc-card">
                    <div className="acc-card-head">
                      <div className="acc-card-head-left">
                        <div className="acc-card-head-icon"><UserIcon s={16} /></div>
                        <div>
                          <div className="acc-card-title">Personal Information</div>
                          <div className="acc-card-sub">View and manage your profile details</div>
                        </div>
                      </div>
                      <button type="button" className="acc-btn acc-btn-ghost" style={{ padding: "7px 14px", fontSize: 11.5 }} onClick={onUpdateOpen}><EditIcon s={12} />Edit</button>
                    </div>
                    <div className="acc-info-grid">
                      <Field Icon={UserIcon} label="First Name" value={userInfo?.firstname} onEdit={onUpdateOpen} />
                      <Field Icon={UserIcon} label="Last Name" value={userInfo?.lastname} onEdit={onUpdateOpen} />
                      <Field Icon={MailIcon} label="Email" value={userInfo?.email} />
                      <Field Icon={PhoneIcon} label="Phone" value={userInfo?.phone} onEdit={onUpdateOpen} />
                      <Field Icon={GenderIcon} label="Gender" value={userInfo?.gender} onEdit={onUpdateOpen} />
                      <Field Icon={LeafIcon} label="Diet" value={userInfo?.vegan ? "Vegan" : "Not Vegan"} onEdit={onUpdateOpen} />
                      <Field Icon={MapPinIcon} label="Address" value={userInfo?.address} onEdit={onUpdateOpen} />
                    </div>
                  </div>
                  <div className="acc-card">
                    <div className="acc-card-head">
                      <div className="acc-card-head-left">
                        <div className="acc-card-head-icon"><TruckIcon s={16} /></div>
                        <div>
                          <div className="acc-card-title">Recent Activity</div>
                          <div className="acc-card-sub">Your latest orders and shipments</div>
                        </div>
                      </div>
                      <button type="button" className="acc-btn acc-btn-ghost" style={{ padding: "7px 14px", fontSize: 11.5 }} onClick={() => setActive("orders")}>View all <ChevRight s={12} /></button>
                    </div>
                    {activity.length === 0 ? (
                      <div style={{ padding: 24, textAlign: "center", color: "#8a9e87", fontSize: 13 }}>No recent activity</div>
                    ) : (
                      activity.map((a) => (
                        <div key={a.id} className="acc-act-item">
                          <div className={`acc-act-icon ${a.type}`}>
                            {a.type === "shipped" ? <TruckIcon s={15} /> : <OrderIcon s={15} />}
                          </div>
                          <div>
                            <div className="acc-act-title">{a.title}</div>
                            <div className="acc-act-date">{a.date}</div>
                          </div>
                          <div className="acc-act-right">
                            <div className="acc-act-amount">{fmt(a.amount)}</div>
                            <div className={`acc-act-status acc-s-${a.status.toLowerCase()}`}>{a.status}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
              {isLoading && (
                <div className="acc-card" style={{ padding: 40, textAlign: "center", color: "#8a9e87" }}>Loading…</div>
              )}
            </>
          ) : (
            <div className="acc-card" style={{ padding: 24 }}>
              {renderTabContent()}
            </div>
          )}
        </div>
      </div>
      <div className="acc-mob-pad" />
    </>
  );
}
