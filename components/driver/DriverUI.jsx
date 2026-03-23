"use client";

/* ════════════════════════════════════════════════════════
   YOOKATALE DRIVER — Shared UI primitives
   Icons, MapBg, Pin, CountdownRing, Chart
   ════════════════════════════════════════════════════════ */

// ── ICONS (stroke-based, consistent 24x24 viewBox) ──
export const I = {
  Home:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Nav:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
  Dollar:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  User:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Pin:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star:({s=20,c="currentColor",f="none"})=><svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Pkg:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Right:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Check:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Bike:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>,
  Bell:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Wallet:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Store:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-4h16l1 4"/><path d="M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9"/><path d="M9 21V9"/><path d="M3 9h18"/></svg>,
  Up:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Gear:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  X:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Route:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
  Zap:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Menu:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Msg:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Locate:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5" fill={c}/></svg>,
  Logout:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Left:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Crosshair:({s=20,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
};

// ── MAP BACKGROUND ──
export function MapBg({children, style={}, dim=false}) {
  return (
    <div style={{position:"relative",background:"#e5e3dd",overflow:"hidden",...style}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <defs>
          <pattern id="mR" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#e5e3dd"/>
            <rect x="0" y="23" width="100" height="3.5" fill="#fff" rx="1" opacity="0.9"/>
            <rect x="0" y="72" width="100" height="2.5" fill="#fafaf7" rx="1" opacity="0.7"/>
            <rect x="45" y="0" width="3.5" height="100" fill="#fff" rx="1" opacity="0.9"/>
            <rect x="82" y="0" width="2" height="55" fill="#fafaf7" rx="1" opacity="0.6"/>
            <rect x="15" y="50" width="25" height="2" fill="#fafaf7" rx="1" opacity="0.5"/>
          </pattern>
          <pattern id="mB" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect x="3" y="3" width="38" height="16" rx="2" fill="#d6d3cb" opacity="0.5"/>
            <rect x="53" y="30" width="44" height="36" rx="2" fill="#ccc9c0" opacity="0.4"/>
            <rect x="3" y="32" width="36" height="30" rx="2" fill="#d1cec6" opacity="0.45"/>
            <rect x="55" y="76" width="40" height="20" rx="2" fill="#d6d3cb" opacity="0.35"/>
            <rect x="5" y="78" width="42" height="18" rx="2" fill="#d0cdc5" opacity="0.4"/>
          </pattern>
          <pattern id="mG" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="40" r="10" fill="#b5c4a1" opacity="0.3"/>
            <circle cx="150" cy="25" r="7" fill="#aabb8c" opacity="0.25"/>
            <circle cx="85" cy="150" r="13" fill="#b0c098" opacity="0.3"/>
            <circle cx="175" cy="130" r="8" fill="#a5b889" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mB)"/>
        <rect width="100%" height="100%" fill="url(#mR)"/>
        <rect width="100%" height="100%" fill="url(#mG)"/>
      </svg>
      {dim&&<div style={{position:"absolute",inset:0,background:"rgba(229,227,221,0.3)"}}/>}
      {children}
    </div>
  );
}

// ── PIN MARKER ──
export function PinMarker({color, icon, label, pulse, style={}}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",...style}}>
      {pulse&&<div style={{position:"absolute",width:44,height:44,borderRadius:22,background:color,opacity:0.12,animation:"ping 2s cubic-bezier(0,0,0.2,1) infinite"}}/>}
      <div style={{width:32,height:32,borderRadius:16,background:color,display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:`0 2px 6px ${color}44`,border:"2px solid #fff",position:"relative",zIndex:1}}>{icon}</div>
      {label&&<><div style={{width:1.5,height:5,background:color,opacity:0.4}}/><div style={{fontSize:8,fontWeight:700,color,background:"#fff",
        padding:"1px 5px",borderRadius:3,boxShadow:"0 1px 2px rgba(0,0,0,0.08)",letterSpacing:0.3,textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</div></>}
    </div>
  );
}

// ── COUNTDOWN RING ──
export function CD({sec, mx=60, sz=38}) {
  const r=(sz-4)/2, c=2*Math.PI*r, p=sec/mx;
  const cl=sec>20?"#0d7c3b":sec>10?"#d97706":"#dc2626";
  return (
    <div style={{position:"relative",width:sz,height:sz,flexShrink:0}}>
      <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5"/>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={sec>20?"rgba(255,255,255,0.85)":"#fff"} strokeWidth="2.5"
          strokeDasharray={c} strokeDashoffset={c*(1-p)} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
      </svg>
      <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'Azeret Mono',monospace"}}>{sec}</span>
    </div>
  );
}

// ── CHART (custom bar chart, no recharts) ──
export function Chart({data}) {
  const mx=Math.max(...data.map(d=>d.v));
  const today=new Date().getDay();
  const dm={Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:0};
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:5,height:100,padding:"0 2px"}}>
      {data.map((d)=>{
        const h=Math.max(6,(d.v/mx)*88);
        const it=dm[d.d]===today;
        return (
          <div key={d.d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:8,fontWeight:600,color:"#9ca3af",fontFamily:"'Azeret Mono',monospace"}}>{(d.v/1000).toFixed(0)}k</span>
            <div style={{width:"100%",maxWidth:26,height:h,borderRadius:5,background:it?"#d97706":"#0d7c3b",opacity:it?1:0.65,transition:"height 0.5s"}}/>
            <span style={{fontSize:9,fontWeight:it?700:500,color:it?"#d97706":"#9ca3af"}}>{d.d}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── DELIVERY STEPS CONFIG ──
export const STEPS = [
  {k:"assigned",l:"Heading to pickup",sh:"Assigned"},
  {k:"picked_up",l:"Order collected",sh:"Picked Up"},
  {k:"in_transit",l:"On the way",sh:"In Transit"},
  {k:"delivered",l:"Order complete",sh:"Delivered"},
];

// ── GLOBAL STYLES ──
export const DRIVER_STYLES = `
  @keyframes ping{75%,100%{transform:scale(2);opacity:0}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  button{transition:opacity 0.15s,transform 0.1s}button:active{transform:scale(0.97);opacity:0.9}
`;

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
